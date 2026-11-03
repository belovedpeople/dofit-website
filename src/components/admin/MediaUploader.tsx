'use client';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
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

    const formData = new FormData();
    fileArray.forEach((f) => formData.append('files', f));
    if (productId) formData.append('productId', productId);

    try {
      setUploadProgress(30);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      setUploadProgress(80);
      const data = await res.json();

      if (data.urls) {
        const newFiles: MediaFile[] = data.urls.map((url: string, i: number) => {
          const original = fileArray[i];
          return {
            url,
            type: original.type.startsWith('video') ? 'video' : 'image',
            name: original.name,
          };
        });
        const updated = [...mediaFiles, ...newFiles];
        setMediaFiles(updated);
        emitChange(updated);
      }
      setUploadProgress(100);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 600);
    }
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
            <span>Uploading... {uploadProgress}%</span>
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

