import { useState } from "react";

import { showToast } from "../../common/toast";
import styles from "./LearningProfile.module.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LearningProfile({ learningProfile }) {
  const [profileInfo, setProfileInfo] = useState(learningProfile);
  const [draftProfile, setDraftProfile] = useState(learningProfile);
  const [editing, setEditing] = useState(false);

  const updateDraftField = (field, value) => {
    setDraftProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setDraftProfile(profileInfo);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraftProfile(profileInfo);
    setEditing(false);
  };

  const handleSave = () => {
    const email = draftProfile.email.trim();
    const goal = draftProfile.goal.trim();
    const preferredField = draftProfile.preferredField.trim();
    const currentFocus = draftProfile.currentFocus.trim();

    if (!email || !goal || !preferredField || !currentFocus) {
      showToast("Please complete all learning profile fields.", "warning");
      return;
    }

    const nextProfile = {
      email,
      goal,
      preferredField,
      currentFocus,
    };

    if (!emailPattern.test(nextProfile.email)) {
      showToast("Please enter a valid email address.", "warning");
      return;
    }

    setProfileInfo(nextProfile);
    setDraftProfile(nextProfile);
    setEditing(false);
    showToast("Learning profile updated successfully.", "success");
  };

  return (
    <section className={styles.profileInfoCard}>
      <h2>Learning Profile</h2>

      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <span>Email Address</span>
          {editing ? (
            <input
              type="email"
              value={draftProfile.email}
              onChange={(event) => updateDraftField("email", event.target.value)}
            />
          ) : (
            <strong>{profileInfo.email}</strong>
          )}
        </div>

        <div className={styles.infoItem}>
          <span>Learning Goal</span>
          {editing ? (
            <input
              value={draftProfile.goal}
              onChange={(event) => updateDraftField("goal", event.target.value)}
            />
          ) : (
            <strong>{profileInfo.goal}</strong>
          )}
        </div>

        <div className={styles.infoItem}>
          <span>Preferred Field</span>
          {editing ? (
            <input
              value={draftProfile.preferredField}
              onChange={(event) =>
                updateDraftField("preferredField", event.target.value)
              }
            />
          ) : (
            <strong>{profileInfo.preferredField}</strong>
          )}
        </div>

        <div className={styles.infoItem}>
          <span>Current Focus</span>
          {editing ? (
            <input
              value={draftProfile.currentFocus}
              onChange={(event) =>
                updateDraftField("currentFocus", event.target.value)
              }
            />
          ) : (
            <strong>{profileInfo.currentFocus}</strong>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {editing ? (
          <>
            <button
              className={`${styles.updateButton} ${styles.saveButton}`}
              type="button"
              onClick={handleSave}
            >
              Save Learning Profile
            </button>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className={styles.updateButton}
            type="button"
            onClick={handleEdit}
          >
            Update Learning Profile
          </button>
        )}
      </div>
    </section>
  );
}
