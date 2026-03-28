// src/services/cloudinary.js
// All uploads are proxied through the backend (API keys stay server-side)

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function getAuthToken() {
  const { getAuth } = await import("firebase/auth");
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
}

// ─── Upload artwork image ─────────────────────────────────────────────────
export async function uploadArtworkImage(file, onProgress) {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append("image", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/upload/artwork`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.error || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

// ─── Upload profile picture ───────────────────────────────────────────────
export async function uploadProfileImage(file) {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/upload/profile`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Profile upload failed");
  return data;
}

// ─── Upload audio recording ───────────────────────────────────────────────
export async function uploadAudio(blob, onProgress) {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append("audio", blob, "voice-note.webm");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/upload/audio`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.error || "Audio upload failed"));
      } catch {
        reject(new Error("Audio upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during audio upload"));
    xhr.send(formData);
  });
}

// ─── Get restored/enhanced image URLs ────────────────────────────────────
export async function restoreImage(publicId) {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE}/upload/restore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ publicId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Restore failed");
  return data; // { original, restored }
}
