/**
 * browse.js — Browse page: search + filter movies and TV shows
 */

if (!requireAuth()) throw new Error("Auth required");

// ─── State ────────────────────────────────────────────────────────
let currentType   = "movies";  // "movies" | "tvshows"
let currentGenre  = "";
let searchTimeout = null;

// ─── Navbar Scroll ────────────────────────────────────────────────
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 10);
});

// ─── Build Card ───────────────────────────────────────────────────
const buildCard = (item, type) => {
  const rating   = item.rating?.toFixed(1) || "N/A";
  const sub      = type === "tvshows"
    ? `${item.seasons} Season${item.seasons > 1 ? "s" : ""}`
    : item.duration || "N/A";

  return `
    <div class="movie-card" style="width:100%;" onclick="openItemModal('${item._id}','${type}')">
      <img src="${item.thumbnail}" alt="${item.title}" loading="lazy"
           onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%231a1a1a%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22155%22%20fill%3D%22%23666%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2213%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E'">
      <div class="movie-card-overlay">
        <p class="card-title">${item.title}</p>
        <div class="card-meta">
          <span class="card-rating">★ ${rating}</span>
          <span>${item.year}</span>
          <span>${sub}</span>
        </div>
        <div class="card-actions">
          <button class="card-btn play" onclick="event.stopPropagation();playItem('${item._id}','${type}')" title="Play">▶</button>
          <button class="card-btn" onclick="event.stopPropagation();addToWatchlistBrowse('${item._id}','${type}')" title="My List">+</button>
        </div>
      </div>
    </div>`;
};

// ─── Render Grid ─────────────────────────────────────────────────
const renderGrid = (items, type) => {
  const grid    = document.getElementById("content-grid");
  const countEl = document.getElementById("result-count");

  if (!items || items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🔍</div>
        <h3>No results found</h3>
        <p>Try a different search or genre</p>
      </div>`;
    if (countEl) countEl.textContent = "0 results";
    return;
  }

  grid.innerHTML = items.map((item) => buildCard(item, type)).join("");
  if (countEl) countEl.textContent = `${items.length} result${items.length !== 1 ? "s" : ""}`;
};

// ─── Fetch Content ────────────────────────────────────────────────
const fetchContent = async () => {
  const grid    = document.getElementById("content-grid");
  const keyword = document.getElementById("search-input")?.value.trim();

  grid.innerHTML = `<div class="spinner" style="grid-column:1/-1;"></div>`;

  try {
    let url = `/${currentType}`;
    const params = new URLSearchParams();

    if (keyword) {
      url = `/${currentType}/search`;
      params.set("keyword", keyword);
    } else if (currentGenre) {
      url = `/${currentType}/genre/${currentGenre}`;
    }

    params.set("limit", "40");
    const { data } = await api.get(`${url}?${params.toString()}`);
    renderGrid(data.data, currentType);
  } catch (error) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="empty-icon">⚠️</div>
      <h3>Failed to load</h3>
      <p>${getErrorMessage(error)}</p>
    </div>`;
  }
};

// ─── Search ───────────────────────────────────────────────────────
const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(fetchContent, 400);
  });
}

// ─── Type Tabs (Movies / TV Shows) ───────────────────────────────
document.querySelectorAll(".type-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".type-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentType  = tab.dataset.type;
    currentGenre = "";
    document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
    fetchContent();
  });
});

// ─── Genre Filter Tabs ────────────────────────────────────────────
document.querySelectorAll(".filter-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentGenre = tab.dataset.genre || "";
    fetchContent();
  });
});

// ─── Modal ────────────────────────────────────────────────────────
const openItemModal = async (id, type) => {
  try {
    const endpointMap = { movies: "movies", tvshows: "tvshows" };
    const { data }    = await api.get(`/${endpointMap[type]}/${id}`);
    const item        = data.data;
    const normalType  = type === "movies" ? "movie" : "tvshow";

    const modalHTML = `
      <div class="modal-overlay" id="detail-modal" onclick="if(event.target.id==='detail-modal')document.getElementById('detail-modal').remove()">
        <div class="modal">
          <button class="modal-close" onclick="document.getElementById('detail-modal').remove()">✕</button>
          <div style="position:relative;height:260px;overflow:hidden;border-radius:12px 12px 0 0;">
            <img src="${item.backdropImage || item.thumbnail}" alt="${item.title}"
                 style="width:100%;height:100%;object-fit:cover;">
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(31,31,31,1) 0%,transparent 50%)"></div>
          </div>
          <div style="padding:24px;">
            <h2 style="font-size:24px;font-weight:800;margin-bottom:10px;">${item.title}</h2>
            <div style="display:flex;gap:14px;margin-bottom:14px;font-size:13px;color:#b3b3b3;">
              <span style="color:#46d369;font-weight:700;">★ ${item.rating?.toFixed(1) || "N/A"}</span>
              <span>${item.year}</span>
              <span>${item.language || "English"}</span>
              <span>${item.duration || (item.seasons ? item.seasons + " Seasons" : "")}</span>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
              ${(item.genre || []).map((g) => `<span class="badge badge-red">${g}</span>`).join("")}
            </div>
            <p style="font-size:14px;color:#b3b3b3;line-height:1.7;margin-bottom:20px;">${item.description}</p>
            <div style="display:flex;gap:12px;">
              <button class="btn btn-primary" onclick="playItem('${id}','${normalType}')">▶ Play</button>
              <button class="btn btn-secondary" onclick="addToWatchlistBrowse('${id}','${normalType}')">+ My List</button>
            </div>
          </div>
        </div>
      </div>`;

    document.getElementById("detail-modal")?.remove();
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

const addToWatchlistBrowse = async (id, type) => {
  try {
    const endpoint = type === "movie" || type === "movies"
      ? `/watchlist/movie/${id}`
      : `/watchlist/tvshow/${id}`;
    await api.post(endpoint);
    showToast("Added to your watchlist ✅", "success");
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

const playItem = async (id, type) => {
  const normalType = type === "movies" ? "movie" : (type === "tvshows" ? "tvshow" : type);
  try { await api.post("/recently-watched", { contentId: id, contentType: normalType }); } catch {}
  
  try {
    const endpoint = normalType === "movie" ? `/movies/${id}` : `/tvshows/${id}`;
    const { data } = await api.get(endpoint);
    const item     = data.data;
    playVideo(item.videoUrl, item.title);
  } catch (error) {
    showToast("Error starting playback: " + getErrorMessage(error), "error");
  }
};

// ─── Init ─────────────────────────────────────────────────────────
fetchContent();
