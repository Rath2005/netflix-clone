/**
 * api.js — Axios base instance with interceptors
 *
 * This file is the SINGLE SOURCE OF TRUTH for all API calls.
 * All JS files import from this file.
 */

// Determine the backend API URL dynamically.
// If the frontend is loaded from a standard development or Live Server port,
// automatically route API requests to port 5000 on the same host.
let BASE_URL = window.location.origin + "/api";
const devPorts = ["5500", "5501", "5502", "5503", "3000", "3001"];
if (devPorts.includes(window.location.port)) {
  BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;
}

// ─── Axios Instance ───────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor — Attach JWT Token ───────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("netflix_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Handle 401 Globally ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — log out
      localStorage.removeItem("netflix_token");
      localStorage.removeItem("netflix_user");
      const currentPage = window.location.pathname;
      const isAuthPage =
        currentPage.includes("login") || currentPage.includes("register");
      if (!isAuthPage) {
        window.location.href = "login.html";
      }
    }

    return Promise.reject(error);
  }
);

// ─── Helper: Get error message ────────────────────────────────────
const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

// ─── Toast Notification System ────────────────────────────────────
const showToast = (message, type = "info", duration = 3500) => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => toast.remove());
  }, duration);
};

// ─── Auth Helpers ─────────────────────────────────────────────────
const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("netflix_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const isLoggedIn = () => !!localStorage.getItem("netflix_token");

const requireAuth = (redirectTo = "login.html") => {
  if (!isLoggedIn()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
};

const requireAdmin = (redirectTo = "index.html") => {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    showToast("Admin access required", "error");
    setTimeout(() => (window.location.href = redirectTo), 1500);
    return false;
  }
  return true;
};

// ─── Helper: Get YouTube Embed URL ────────────────────────────────
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // If it's already an embed URL
  if (url.includes("/embed/")) {
    return url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
  }
  
  let videoId = "";
  if (url.includes("youtube.com/watch")) {
    try {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v");
    } catch (e) {}
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  }
  
  return null;
};

// ─── Global Fullscreen Video Player Modal ─────────────────────────
const playVideo = (videoUrl, title) => {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  
  let playerHTML = "";
  if (embedUrl) {
    playerHTML = `
      <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <iframe src="${embedUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
        </iframe>
      </div>
    `;
  } else {
    const url = videoUrl || "https://vjs.zencdn.net/v/oceans.mp4";
    playerHTML = `
      <video controls autoplay style="
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        outline: none;
      ">
        <source src="${url}" type="video/mp4">
        <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        Your browser does not support the video tag or is unable to load the video.
      </video>
    `;
  }

  const modalHTML = `
    <div id="video-player-modal" style="
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 20px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
        z-index: 10000;
      ">
        <h2 style="color: #fff; margin: 0; font-family: sans-serif; font-weight: 700; font-size: 24px;">${title}</h2>
        <button onclick="document.getElementById('video-player-modal').remove()" style="
          background: none;
          border: none;
          color: #fff;
          font-size: 30px;
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">✕</button>
      </div>

      <div style="width: 100%; max-width: 1000px; padding: 20px; box-sizing: border-box;">
        ${playerHTML}
      </div>
    </div>
  `;
  
  document.getElementById('video-player-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};
