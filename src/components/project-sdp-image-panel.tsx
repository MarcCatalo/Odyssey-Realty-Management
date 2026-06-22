"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { ProjectImage } from "@/features/catalog/types";

export function ProjectSdpImagePanel({
  image
}: {
  image: ProjectImage;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openedScrollYRef = useRef(0);

  const closeInspector = useCallback(() => {
    setIsOpen(false);
  }, []);

  function openInspector() {
    openedScrollYRef.current = window.scrollY;
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function closeWhenScrolledAway() {
      if (Math.abs(window.scrollY - openedScrollYRef.current) > 80) {
        closeInspector();
      }
    }

    window.addEventListener("scroll", closeWhenScrolledAway, { passive: true });

    return () => {
      window.removeEventListener("scroll", closeWhenScrolledAway);
    };
  }, [closeInspector, isOpen]);

  return (
    <>
      <button
        aria-label={`Expand ${image.caption}`}
        className="project-sdp-image-button"
        onClick={openInspector}
        type="button"
      >
        <Image
          alt={image.alt}
          className="object-contain"
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          src={image.src}
        />
      </button>

      {isOpen
        ? createPortal(
            <div className="project-gallery-inspector" onClick={closeInspector} role="presentation">
              <div
                aria-label={`${image.caption} expanded preview`}
                className="project-gallery-expanded"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
              >
                <div className="project-gallery-expanded-image">
                  <Image
                    alt={image.alt}
                    className="object-contain"
                    fill
                    sizes="(min-width: 1024px) 86vw, 94vw"
                    src={image.src}
                  />
                </div>
                <div className="project-gallery-expanded-caption">
                  <div>
                    <span>Selected image</span>
                    <strong>{image.caption}</strong>
                  </div>
                  <button aria-label="Close expanded SDP image" onClick={closeInspector} type="button">
                    <X aria-hidden="true" className="h-4 w-4" />
                    Close
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
