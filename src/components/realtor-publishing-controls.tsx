"use client";

import { useState } from "react";

type RealtorPublishingControlsProps = {
  defaultPublished?: boolean;
  draftLabel?: string;
  inputName?: string;
  publishedLabel?: string;
};

export function RealtorPublishingControls({
  defaultPublished = false,
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
