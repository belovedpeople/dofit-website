'use client';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { uploadMediaFile } from '@/lib/uploadHelper';
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
      const basePercent = Math.round((i / fileArray.length) * 100);
      setUploadProgress(basePercent);

      try {
        const result = await uploadMediaFile(originalFile, {
          productId,
          onProgress: (_p, statusText) => {
            setUploadStatusText(
              `[${i + 1}/${fileArray.length}] ${originalFile.name}: ${statusText}`
            );
          },
        });

        const fileObj: MediaFile = {
          url: result.url,
          type: result.isVideo ? 'video' : 'image',
          name: originalFile.name,
        };
        newFiles.push(fileObj);
      } catch (err: any) {
        console.error(`Upload error on ${originalFile.name}:`, err);
        let errMsg = err?.message || `Failed to upload ${originalFile.name}`;
        if (errMsg.toLowerCase().includes('load failed')) {
          errMsg = `Mobile network dropped during "${originalFile.name}". Please re-select the file to retry.`;
        }
        errors.push(errMsg);
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

