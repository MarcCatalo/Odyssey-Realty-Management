"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { ProjectImage } from "@/features/catalog/types";

export function ProjectGalleryCarousel({ images }: { images: ProjectImage[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const selectedScrollYRef = useRef(0);
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    const galleryTrack = track;
    galleryTrack.scrollLeft = 0;

    function handleWheel(event: WheelEvent) {
      const horizontalDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      galleryTrack.scrollBy({
        behavior: "smooth",
        left: horizontalDelta
      });
      event.preventDefault();
    }

    galleryTrack.addEventListener("wheel", handleWheel, { capture: true, passive: false });

    return () => {
      galleryTrack.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, []);

  const closeInspector = useCallback(() => {
    if (!selectedImage) {
      return;
    }

    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
    }, 180);
  }, [selectedImage]);

  function openInspector(image: ProjectImage) {
    selectedScrollYRef.current = window.scrollY;
    setSelectedImage(image);
  }

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    function closeWhenGalleryLeavesView() {
      const carousel = carouselRef.current;

      if (!carousel) {
        return;
      }

      const rect = carousel.getBoundingClientRect();
      const hasScrolledAwayFromSelection = Math.abs(window.scrollY - selectedScrollYRef.current) > 80;
      const isGalleryActive = rect.top < window.innerHeight * 0.45 && rect.bottom > window.innerHeight * 0.45;

      if (hasScrolledAwayFromSelection || !isGalleryActive) {
        closeInspector();
      }
    }

    window.addEventListener("scroll", closeWhenGalleryLeavesView, { passive: true });

    return () => {
      window.removeEventListener("scroll", closeWhenGalleryLeavesView);
    };
  }, [closeInspector, selectedImage]);

  const inspector = selectedImage ? (
    <div
      className={`project-gallery-inspector ${isClosing ? "project-gallery-inspector-closing" : ""}`}
      onClick={closeInspector}
      role="presentation"
    >
      <div
        aria-label={`${selectedImage.caption} expanded preview`}
        className="project-gallery-expanded"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="project-gallery-expanded-image">
          <Image
            alt={selectedImage.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 76vw, 92vw"
            src={selectedImage.src}
          />
        </div>
        <div className="project-gallery-expanded-caption">
          <div>
            <span>Selected image</span>
            <strong>{selectedImage.caption}</strong>
          </div>
          <button aria-label="Close expanded gallery image" onClick={closeInspector} type="button">
            <X aria-hidden="true" className="h-4 w-4" />
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="project-gallery-carousel" ref={carouselRef}>
        <div
          aria-label="Scrollable house gallery"
          className="project-gallery-track stagger-list"
          ref={trackRef}
        >
          {images.length === 0 ? (
            <div className="project-gallery-empty">
              House gallery photos will appear here once uploaded by the realtor.
            </div>
          ) : null}
          {images.map((image) => (
            <button
              className="project-gallery-slide interactive-card reveal scroll-reveal"
              key={image.id}
              onClick={() => openInspector(image)}
              type="button"
            >
              <span className="project-gallery-image">
                <Image
                  alt={image.alt}
                  className="card-media object-cover"
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 768px) 42vw, 88vw"
                  src={image.src}
                />
              </span>
              <span className="project-gallery-caption">{image.caption}</span>
            </button>
          ))}
        </div>
      </div>

      {isMounted && inspector ? createPortal(inspector, document.body) : null}
    </>
  );
}
