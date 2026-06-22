"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { CheckSquare, ImagePlus, Pencil, RotateCcw, Trash2, Upload, X } from "lucide-react";

import { refreshAfterMutation } from "@/lib/realtor-navigation";

type InitialImage = {
  alt: string;
  caption?: string;
  src: string;
};

type RealtorImageUploadProps = {
  accept?: string;
  description: string;
  disabled?: boolean;
  fallbackText?: string;
  initialImages?: InitialImage[];
  label: string;
  manageable?: boolean;
  mediaRole?: "project_cover" | "project_gallery" | "project_sdp";
  multiple?: boolean;
  projectId?: string;
  variant?: "logo" | "wide" | "gallery";
};

export function RealtorImageUpload({
  accept = "image/*",
  description,
  disabled = false,
  fallbackText,
  initialImages = [],
  label,
  manageable = false,
  mediaRole,
  multiple = false,
  projectId,
  variant = "wide"
}: RealtorImageUploadProps) {
  const router = useRouter();
  const inputId = useId();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showManager, setShowManager] = useState(false);
  const [isMultiSelecting, setIsMultiSelecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedPhotoIndexes, setSelectedPhotoIndexes] = useState<Set<number>>(new Set());
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [photoLabels, setPhotoLabels] = useState<Record<number, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const previewImages = useMemo<InitialImage[]>(() => {
    if (previewUrls.length > 0) {
      return previewUrls.map((src, index) => ({
        alt: selectedFiles[index]?.name ?? `${label} preview ${index + 1}`,
        src
      }));
    }

    return initialImages;
  }, [initialImages, label, previewUrls, selectedFiles]);

  const showManageActions = manageable;
  const previewClassName = [
    "realtor-upload-preview",
    variant === "logo" ? "realtor-upload-preview-logo" : "",
    variant === "gallery" ? "realtor-upload-preview-gallery" : ""
  ]
    .filter(Boolean)
    .join(" ");

  function toggleSelectedPhoto(index: number) {
    setSelectedPhotoIndexes((currentIndexes) => {
      const nextIndexes = new Set(currentIndexes);

      if (nextIndexes.has(index)) {
        nextIndexes.delete(index);
      } else {
        nextIndexes.add(index);
      }

      return nextIndexes;
    });
  }

  function closeManager() {
    setShowManager(false);
    setShowDeleteConfirm(false);
    setIsMultiSelecting(false);
    setSelectedPhotoIndexes(new Set());
    setEditingPhotoIndex(null);
  }

  function getPhotoLabel(image: InitialImage, index: number) {
    return photoLabels[index] ?? image.caption ?? image.alt;
  }

  async function uploadFiles(files: File[]) {
    if (!projectId || !mediaRole || files.length === 0) {
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("projectId", projectId);
      formData.set("role", mediaRole);
      formData.set("altText", file.name);
      formData.set("caption", file.name.replace(/\.[^.]+$/, ""));

      const response = await fetch("/api/realtor/media", {
        body: formData,
        method: "POST"
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setErrorMessage(payload?.message ?? "Image could not be uploaded.");
        setIsUploading(false);
        return;
      }
    }

    setIsUploading(false);
    setSelectedFiles([]);
    refreshAfterMutation(router);
  }

  const managerOverlay =
    showManager && mounted
      ? createPortal(
          <div className="realtor-media-manager-overlay" role="presentation">
            <div
              aria-labelledby={`${inputId}-manager-title`}
              aria-modal="true"
              className="realtor-media-manager"
              role="dialog"
            >
              <div className="realtor-media-manager-header">
                <div>
                  <span>{label}</span>
                  <h2 id={`${inputId}-manager-title`}>Manage photos</h2>
                  <p>
                    {multiple
                      ? "Rename gallery labels or select multiple photos for deletion."
                      : "Choose which uploaded image should be used as the selected cover photo."}
                  </p>
                </div>
                <button aria-label="Close media manager" onClick={closeManager} type="button">
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>

              {multiple ? (
                <div className="realtor-media-manager-actions">
                  <button
                    className={isMultiSelecting ? "realtor-media-manager-action-active" : ""}
                    onClick={() => {
                      setIsMultiSelecting((currentValue) => !currentValue);
                      setSelectedPhotoIndexes(new Set());
                    }}
                    type="button"
                  >
                    <CheckSquare aria-hidden="true" className="h-4 w-4" />
                    Multiple select
                  </button>
                  <button
                    className="realtor-media-manager-danger"
                    disabled={disabled || !isMultiSelecting || selectedPhotoIndexes.size === 0}
                    onClick={() => setShowDeleteConfirm(true)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                    Delete selected
                    {selectedPhotoIndexes.size > 0 ? ` (${selectedPhotoIndexes.size})` : ""}
                  </button>
                </div>
              ) : null}

              <div className="realtor-media-manager-grid">
                {previewImages.map((image, index) => {
                  const isBulkSelected = selectedPhotoIndexes.has(index);
                  const isSelectedCover = !multiple && selectedCoverIndex === index;

                  return (
                    <article
                      className={`realtor-manager-photo-card ${
                        isBulkSelected || isSelectedCover ? "realtor-manager-photo-card-selected" : ""
                      }`}
                      key={`${image.src}-${index}`}
                    >
                      {isMultiSelecting ? (
                        <label className="realtor-manager-photo-check" aria-label={`Select ${getPhotoLabel(image, index)}`}>
                          <input
                            checked={isBulkSelected}
                            onChange={() => toggleSelectedPhoto(index)}
                            type="checkbox"
                          />
                        </label>
                      ) : null}
                      {!multiple && isSelectedCover ? (
                        <span className="realtor-manager-photo-check realtor-manager-photo-check-static" aria-label="Selected cover">
                          <CheckSquare aria-hidden="true" className="h-4 w-4" />
                        </span>
                      ) : null}
                      <div className="realtor-manager-photo-image">
                        <Image
                          alt={image.alt}
                          fill
                          onError={(event) => {
                            event.currentTarget.style.opacity = "0";
                          }}
                          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 100vw"
                          src={image.src}
                          unoptimized
                        />
                      </div>
                      <div className="realtor-manager-photo-meta">
                        <div className="realtor-manager-photo-copy">
                          {editingPhotoIndex === index ? (
                            <input
                              aria-label={`Photo ${index + 1} name`}
                              autoFocus
                              onChange={(event) =>
                                setPhotoLabels((currentLabels) => ({
                                  ...currentLabels,
                                  [index]: event.target.value
                                }))
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  setEditingPhotoIndex(null);
                                }
                              }}
                              type="text"
                              value={getPhotoLabel(image, index)}
                            />
                          ) : (
                            <strong>{getPhotoLabel(image, index)}</strong>
                          )}
                          <span>{multiple ? `Photo ${index + 1}` : "Cover option"}</span>
                        </div>
                        <div className="realtor-manager-photo-actions">
                          {multiple ? (
                            <button
                              disabled={disabled}
                              onClick={() => {
                                if (editingPhotoIndex === index) {
                                  setEditingPhotoIndex(null);
                                } else {
                                  setEditingPhotoIndex(index);
                                }
                              }}
                              type="button"
                            >
                              <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                              {editingPhotoIndex === index ? "Save" : "Edit name"}
                            </button>
                          ) : (
                            <button
                              disabled={disabled || isSelectedCover}
                              onClick={() => setSelectedCoverIndex(index)}
                              type="button"
                            >
                              <CheckSquare aria-hidden="true" className="h-3.5 w-3.5" />
                              Select
                            </button>
                          )}
                          {multiple ? (
                            <button
                              className="realtor-media-delete"
                              disabled={disabled}
                              onClick={() => {
                                setSelectedPhotoIndexes(new Set([index]));
                                setShowDeleteConfirm(true);
                              }}
                              type="button"
                            >
                              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {showDeleteConfirm ? (
                <div className="realtor-media-delete-confirm" role="presentation">
                  <div
                    aria-labelledby={`${inputId}-delete-title`}
                    aria-modal="true"
                    className="realtor-confirm-modal"
                    role="dialog"
                  >
                    <Trash2 aria-hidden="true" className="h-8 w-8 text-[#8d1f19]" />
                    <h2 id={`${inputId}-delete-title`}>Delete selected photos?</h2>
                    <p>
                      This will remove{" "}
                      {selectedPhotoIndexes.size > 0 ? selectedPhotoIndexes.size : "the selected"} photo
                      {selectedPhotoIndexes.size === 1 ? "" : "s"} from this project media.
                    </p>
                    <div className="realtor-confirm-actions">
                      <button className="realtor-text-button" onClick={() => setShowDeleteConfirm(false)} type="button">
                        Cancel
                      </button>
                      <button className="realtor-danger-button" onClick={() => setShowDeleteConfirm(false)} type="button">
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                        Delete photos
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="realtor-upload-control">
      {managerOverlay}

      <div className="realtor-upload-copy">
        <span>{label}</span>
        <p>{description}</p>
      </div>

      <div className={previewClassName}>
        {previewImages.length > 0 ? (
          previewImages.slice(0, 1).map((image, index) => (
            <div className="realtor-upload-image-shell" key={`${image.src}-${index}`}>
              <Image
                alt={image.alt}
                fill
                onError={(event) => {
                  event.currentTarget.style.opacity = "0";
                }}
                sizes="(min-width: 768px) 22vw, 100vw"
                src={image.src}
                unoptimized
              />
            </div>
          ))
        ) : (
          <div className="realtor-upload-fallback">
            <ImagePlus aria-hidden="true" className="h-7 w-7" />
            <strong>{fallbackText ?? "Image preview"}</strong>
          </div>
        )}
      </div>

      <div className="realtor-upload-actions">
        <label aria-disabled={disabled} className="realtor-upload-button" htmlFor={inputId}>
          <Upload aria-hidden="true" className="h-4 w-4" />
          {isUploading ? "Uploading..." : multiple ? "Upload photos" : "Upload photo"}
        </label>
        <input
          accept={accept}
          disabled={disabled || isUploading}
          id={inputId}
          multiple={multiple}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            setSelectedFiles(files);
            void uploadFiles(files);
          }}
          type="file"
        />
        {selectedFiles.length > 0 ? (
          <button className="realtor-upload-reset" onClick={() => setSelectedFiles([])} type="button">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reset preview
          </button>
        ) : null}
        {showManageActions ? (
          <button
            className="realtor-upload-manage"
            disabled={disabled || previewImages.length === 0}
            onClick={() => setShowManager(true)}
            type="button"
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Manage photos
          </button>
        ) : null}
      </div>

      {errorMessage ? <p className="realtor-form-error" role="alert">{errorMessage}</p> : null}
      {disabled ? <p className="realtor-upload-note">Click edit before changing this image.</p> : null}
    </div>
  );
}
