'use client';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { compressImageIfNeeded } from '@/lib/imageCompression';
import styles from './MediaUploader.module.css';

interface MediaFile {
  url: string;
  type: 'image' | 'video';
  name: string;
}

interface MediaUploaderProps {
  productId?: string;
  existingImages?: string[];
  existingVideos?: string[];
  onChange: (images: string[], videos: string[]) => void;
}

export default function MediaUploader({
  productId,
  existingImages = [],
  existingVideos = [],
  onChange,
}: MediaUploaderProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    ...existingImages.map((url) => ({ url, type: 'image' as const, name: url.split('/').pop() || '' })),
    ...existingVideos.map((url) => ({ url, type: 'video' as const, name: url.split('/').pop() || '' })),
  ]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const emitChange = useCallback((files: MediaFile[]) => {
    const images = files.filter((f) => f.type === 'image').map((f) => f.url);
    const videos = files.filter((f) => f.type === 'video').map((f) => f.url);
    onChange(images, videos);
  }, [onChange]);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatusText(`Preparing ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}...`);

    const newFiles: MediaFile[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const originalFile = fileArray[i];
      const isVideo = originalFile.type.startsWith('video');
      const percent = Math.round((i / fileArray.length) * 100);
      setUploadProgress(percent);
      setUploadStatusText(`Uploading ${i + 1} of ${fileArray.length}: ${originalFile.name} (${percent}%)`);

      try {
        // Optimize & compress photos client-side (prevents 4.5MB Vercel payload limit)
        const processedFile = await compressImageIfNeeded(originalFile);

        // Safeguard for video or large files
        if (processedFile.size > 4.5 * 1024 * 1024) {
          throw new Error(
            `"${originalFile.name}" (${(processedFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 4.5MB upload limit. Please compress it first.`
          );
        }

        const formData = new FormData();
        formData.append('files', processedFile);
        if (productId) formData.append('productId', productId);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });

        if (!res.ok) {
          const text = await res.text();
          let msg = `Server returned status ${res.status}`;
          if (res.status === 413 || text.includes('Request Entity Too Large')) {
            msg = `"${originalFile.name}" is too large for upload (exceeds 4.5MB server limit).`;
          } else {
            try {
              const json = JSON.parse(text);
              if (json.error) msg = json.error;
            } catch {
              msg = text.slice(0, 100);
            }
          }
          throw new Error(msg);
        }

        const data = await res.json();
        if (data.urls && data.urls.length > 0) {
          const fileObj: MediaFile = {
            url: data.urls[0],
            type: isVideo ? 'video' : 'image',
            name: originalFile.name,
          };
          newFiles.push(fileObj);
        } else {
          throw new Error(data.error || 'No URL returned from upload server');
        }
      } catch (err: any) {
        console.error(`Upload error on ${originalFile.name}:`, err);
        errors.push(err?.message || `Failed to upload ${originalFile.name}`);
      }
    }

    setUploadProgress(100);
    setUploadStatusText('Upload complete!');

    if (newFiles.length > 0) {
      setMediaFiles((prev) => {
        const updated = [...prev, ...newFiles];
        emitChange(updated);
        return updated;
      });
    }

    if (errors.length > 0) {
      alert(`Upload Notice:\n\n${errors.join('\n\n')}`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      setUploadStatusText('');
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const removeFile = (idx: number) => {
    const updated = mediaFiles.filter((_, i) => i !== idx);
    setMediaFiles(updated);
    emitChange(updated);
  };

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const copy = [...mediaFiles];
    const dragged = copy.splice(dragItem.current, 1)[0];
    copy.splice(dragOverItem.current, 0, dragged);
    dragItem.current = null;
    dragOverItem.current = null;
    setMediaFiles(copy);
    emitChange(copy);
  };

  return (
    <div className={styles.wrapper}>
      {/* Drop Zone */}
      <div
        className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ''} ${uploading ? styles.dropzoneUploading : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className={styles.hiddenInput}
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <div className={styles.uploadingState}>
            <div className={styles.spinner} />
            <span style={{ textAlign: 'center', wordBreak: 'break-word', padding: '0 8px' }}>
              {uploadStatusText || `Uploading... ${uploadProgress}%`}
            </span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : (
          <div className={styles.dropzoneContent}>
            <div className={styles.dropzoneIcon}>📁</div>
            <p className={styles.dropzoneTitle}>Drop images & videos here</p>
            <p className={styles.dropzoneSub}>or click to browse — JPG, PNG, WebP, MP4, MOV supported</p>
          </div>
        )}
      </div>

      {/* Media Grid */}
      {mediaFiles.length > 0 && (
        <div className={styles.mediaGrid}>
          {mediaFiles.map((file, idx) => (
            <div
              key={`${file.url}-${idx}`}
              className={styles.mediaItem}
              draggable
              onDragStart={() => { dragItem.current = idx; }}
              onDragEnter={() => { dragOverItem.current = idx; }}
              onDragEnd={handleDragSort}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className={styles.mediaPreview}>
                {file.type === 'video' ? (
                  <video
                    src={file.url}
                    className={styles.videoThumb}
                    muted
                    playsInline
                    onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLVideoElement).pause(); (e.currentTarget as HTMLVideoElement).currentTime = 0; }}
                  />
                ) : (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className={styles.imageThumb}
                    unoptimized
                  />
                )}
                <div className={styles.mediaOverlay}>
                  <span className={styles.mediaTypeBadge}>
                    {file.type === 'video' ? '🎬 Video' : '🖼 Image'}
                  </span>
                  {idx === 0 && <span className={styles.primaryBadge}>★ Primary</span>}
                </div>
              </div>
              <div className={styles.mediaActions}>
                <span className={styles.dragHandle} title="Drag to reorder">⠿</span>
                <span className={styles.mediaName} title={file.name}>{file.name}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFile(idx)}
                  title="Remove"
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

