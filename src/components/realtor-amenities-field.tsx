"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type RealtorAmenitiesFieldProps = {
  disabled?: boolean;
  initialValues?: string[];
};

export function RealtorAmenitiesField({
  disabled = false,
  initialValues = []
}: RealtorAmenitiesFieldProps) {
  const [amenities, setAmenities] = useState(initialValues);

  function addAmenity() {
    if (amenities.length >= 30) {
      return;
    }

    setAmenities((current) => [...current, ""]);
  }

  function updateAmenity(index: number, value: string) {
    setAmenities((current) =>
      current.map((amenity, amenityIndex) => (amenityIndex === index ? value : amenity))
    );
  }

  function moveAmenity(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= amenities.length) {
      return;
    }

    setAmenities((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function removeAmenity(index: number) {
    setAmenities((current) => current.filter((_, amenityIndex) => amenityIndex !== index));
  }

  return (
    <div className="realtor-amenities-field">
      <div className="realtor-amenities-intro">
        <div>
          <strong>Optional amenities</strong>
          <p>Add only the facilities and shared features available within this project.</p>
        </div>
        <button
          className="realtor-text-button"
          disabled={disabled || amenities.length >= 30}
          onClick={addAmenity}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add amenity
        </button>
      </div>

      {amenities.length > 0 ? (
        <div className="realtor-amenities-list">
          {amenities.map((amenity, index) => (
            <div className="realtor-amenity-row" key={index}>
              <label className="realtor-field">
                <span>Amenity {index + 1}</span>
                <input
                  disabled={disabled}
                  maxLength={120}
                  name="featuresAmenities"
                  onChange={(event) => updateAmenity(index, event.target.value)}
                  placeholder="Example: Clubhouse"
                  type="text"
                  value={amenity}
                />
              </label>
              <div className="realtor-amenity-actions">
                <button
                  aria-label={`Move amenity ${index + 1} up`}
                  disabled={disabled || index === 0}
                  onClick={() => moveAmenity(index, -1)}
                  title="Move up"
                  type="button"
                >
                  <ArrowUp aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  aria-label={`Move amenity ${index + 1} down`}
                  disabled={disabled || index === amenities.length - 1}
                  onClick={() => moveAmenity(index, 1)}
                  title="Move down"
                  type="button"
                >
                  <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  aria-label={`Remove amenity ${index + 1}`}
                  className="realtor-amenity-remove"
                  disabled={disabled}
                  onClick={() => removeAmenity(index)}
                  title="Remove amenity"
                  type="button"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="realtor-amenities-empty">
          No amenities added. This section will stay hidden on the public project page.
        </p>
      )}
    </div>
  );
}
