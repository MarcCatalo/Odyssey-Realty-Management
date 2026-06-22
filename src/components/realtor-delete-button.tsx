"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";

import { refreshAfterMutation } from "@/lib/realtor-navigation";

type RealtorDeleteButtonProps =
  | {
      developerSlug: string;
      itemName: string;
      kind: "developer";
    }
  | {
      developerSlug: string;
      itemName: string;
      kind: "project";
      projectSlug: string;
    };

export function RealtorDeleteButton(props: RealtorDeleteButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const endpoint = props.kind === "developer" ? "/api/realtor/developers" : "/api/realtor/projects";
  const payload =
    props.kind === "developer"
      ? { slug: props.developerSlug }
      : { developerSlug: props.developerSlug, projectSlug: props.projectSlug };

  async function handleDelete() {
    setIsDeleting(true);
    setErrorMessage(null);

    const response = await fetch(endpoint, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      },
      method: "DELETE"
    });
    const result = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    if (!response.ok) {
      setIsDeleting(false);
      setErrorMessage(result?.message ?? `${props.itemName} could not be deleted.`);
      return;
    }

    refreshAfterMutation(router);
  }

  return (
    <>
      <button className="realtor-card-archive-button" onClick={() => setShowConfirm(true)} type="button">
        <Trash2 aria-hidden="true" className="h-4 w-4" />
        Delete
      </button>

      {showConfirm ? (
        <div className="realtor-confirm-overlay" role="presentation">
          <div
            aria-describedby={`${props.kind}-delete-description`}
            aria-modal="true"
            className="realtor-confirm-modal"
            role="dialog"
          >
            <AlertTriangle aria-hidden="true" className="h-8 w-8 text-[#8d1f19]" />
            <h2>Delete {props.kind}?</h2>
            <p id={`${props.kind}-delete-description`}>
              {props.itemName} will be permanently deleted from this realtor catalog.
            </p>
            {errorMessage ? (
              <p className="realtor-form-error" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <div className="realtor-confirm-actions">
              <button className="realtor-text-button" onClick={() => setShowConfirm(false)} type="button">
                Cancel
              </button>
              <button className="realtor-danger-button" disabled={isDeleting} onClick={handleDelete} type="button">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
