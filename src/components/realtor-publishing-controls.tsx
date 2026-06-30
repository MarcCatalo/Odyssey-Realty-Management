"use client";

import { useState } from "react";

type RealtorPublishingControlsProps = {
  defaultPublished?: boolean;
  disabled?: boolean;
  draftLabel?: string;
  inputName?: string;
  publishedLabel?: string;
};

export function RealtorPublishingControls({
  defaultPublished = false,
  disabled = false,
  draftLabel = "Save as draft after creation",
  inputName,
  publishedLabel = "Published on public catalog"
}: RealtorPublishingControlsProps) {
  const [saveAsDraft, setSaveAsDraft] = useState(!defaultPublished);
  const [isPublished, setIsPublished] = useState(defaultPublished);

  return (
    <>
      {inputName ? (
        <input name={inputName} type="hidden" value={isPublished ? "published" : "draft"} />
      ) : null}
      <label className="realtor-check-row">
        <input
          checked={saveAsDraft}
          disabled={disabled}
          onChange={(event) => {
            const checked = event.target.checked;
            if (!checked && !isPublished) {
              return;
            }

            setSaveAsDraft(checked);
            setIsPublished(!checked);
          }}
          type="checkbox"
        />
        <span>{draftLabel}</span>
      </label>
      <label className="realtor-check-row">
        <input
          checked={isPublished}
          disabled={disabled}
          onChange={(event) => {
            const checked = event.target.checked;
            if (!checked && !saveAsDraft) {
              return;
            }

            setIsPublished(checked);
            setSaveAsDraft(!checked);
          }}
          type="checkbox"
        />
        <span>{publishedLabel}</span>
      </label>
    </>
  );
}
