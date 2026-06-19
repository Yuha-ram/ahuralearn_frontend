import { useState } from "react";
import { Check, Pencil, Share2, X } from "lucide-react";

import { showToast } from "../../common/toast";
import styles from "./ProfileCard.module.css";

const fallbackAvatar = "https://i.pravatar.cc/150?img=47";

function getTopNavAvatar(profileAvatar) {
  const storedUser = localStorage.getItem("userInfo");

  if (!storedUser) {
    return profileAvatar || fallbackAvatar;
  }

  try {
    const userInfo = JSON.parse(storedUser);

    return userInfo.avatar || profileAvatar || fallbackAvatar;
  } catch (error) {
    console.warn("Failed to parse stored user info", error);
    return profileAvatar || fallbackAvatar;
  }
}

export default function ProfileCard({ profile }) {
  const [profileInfo, setProfileInfo] = useState(profile);
  const [draftProfile, setDraftProfile] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(() =>
    getTopNavAvatar(profile.avatar)
  );
  const [shareLabel, setShareLabel] = useState("Share Profile");

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      showToast("Please choose a valid image file.", "warning");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const nextAvatar = reader.result;
      const storedUser = localStorage.getItem("userInfo");

      setAvatarSrc(nextAvatar);

      if (storedUser) {
        try {
          const userInfo = JSON.parse(storedUser);

          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...userInfo,
              avatar: nextAvatar,
            })
          );
        } catch (error) {
          console.warn("Failed to update stored avatar", error);
          showToast("Avatar changed, but local profile sync failed.", "warning");
        }
      }

      showToast("Avatar updated successfully.", "success");
    };

    reader.onerror = () => {
      showToast("Could not read the selected image.", "error");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

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
    const name = draftProfile.name.trim();
    const role = draftProfile.role.trim();
    const description = draftProfile.description.trim();

    if (!name || !role || !description) {
      showToast("Please complete all profile fields before saving.", "warning");
      return;
    }

    const nextProfile = {
      ...draftProfile,
      name,
      role,
      description,
    };
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);

        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            ...userInfo,
            username: nextProfile.name,
          })
        );
      } catch (error) {
        console.warn("Failed to update stored user info", error);
        showToast("Profile saved, but local account sync failed.", "warning");
      }
    }

    setProfileInfo(nextProfile);
    setDraftProfile(nextProfile);
    setEditing(false);
    showToast("Profile updated successfully.", "success");
  };

  const handleShare = async () => {
    const shareData = {
      title: profileInfo.name,
      text: `${profileInfo.name} - ${profileInfo.role}. ${profileInfo.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareLabel("Shared");
        showToast("Profile shared successfully.", "success");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        setShareLabel("Copied Link");
        showToast("Profile link copied.", "success");
      } else {
        const textArea = document.createElement("textarea");

        textArea.value = `${shareData.text} ${shareData.url}`;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setShareLabel("Copied Link");
        showToast("Profile link copied.", "success");
      }

      window.setTimeout(() => {
        setShareLabel("Share Profile");
      }, 1800);
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareLabel("Share Failed");
        showToast("Could not share profile.", "error");
        window.setTimeout(() => {
          setShareLabel("Share Profile");
        }, 1800);
      }
    }
  };

  return (
    <section className={styles.profileCard}>
      <label className={styles.avatarWrap} title="Change avatar">
        <img
          src={avatarSrc}
          alt={profileInfo.name}
          onError={() => setAvatarSrc(fallbackAvatar)}
        />
        <span className={styles.avatarOverlay}>Change</span>
        <input
          type="file"
          accept="image/*"
          className={styles.avatarInput}
          onChange={handleAvatarChange}
        />
      </label>

      {editing ? (
        <div className={styles.editForm}>
          <label>
            Name
            <input
              value={draftProfile.name}
              onChange={(event) => updateDraftField("name", event.target.value)}
            />
          </label>

          <label>
            Role
            <input
              value={draftProfile.role}
              onChange={(event) => updateDraftField("role", event.target.value)}
            />
          </label>

          <label>
            Bio
            <textarea
              rows="4"
              value={draftProfile.description}
              onChange={(event) =>
                updateDraftField("description", event.target.value)
              }
            />
          </label>
        </div>
      ) : (
        <>
          <h1>{profileInfo.name}</h1>
          <p className={styles.role}>{profileInfo.role}</p>
          <p className={styles.description}>{profileInfo.description}</p>
        </>
      )}

      <div className={styles.profileActions}>
        {editing ? (
          <>
            <button
              className={`${styles.actionButton} ${styles.saveButton}`}
              type="button"
              onClick={handleSave}
            >
              <Check size={18} strokeWidth={2.3} />
              <span>Save Profile</span>
            </button>

            <button
              className={styles.actionButton}
              type="button"
              onClick={handleCancel}
            >
              <X size={18} strokeWidth={2.3} />
              <span>Cancel</span>
            </button>
          </>
        ) : (
          <button
            className={styles.actionButton}
            type="button"
            onClick={handleEdit}
          >
            <Pencil size={18} strokeWidth={2.3} />
            <span>Edit Profile</span>
          </button>
        )}

        <button
          className={styles.actionButton}
          type="button"
          onClick={handleShare}
        >
          <Share2 size={18} strokeWidth={2.3} />
          <span>{shareLabel}</span>
        </button>
      </div>
    </section>
  );
}
