/**
 * home.js — Home page: loads hero, trending, recommended, genre rows
 */

// ─── Guard ────────────────────────────────────────────────────────
if (!requireAuth()) throw new Error("Auth required");

// ─── Navbar Scroll Effect ─────────────────────────────────────────
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) navbar.classList.add("scrolled");
  else                      navbar.classList.remove("scrolled");
});

// ─── Build Movie Card HTML ────────────────────────────────────────
const buildMovieCard = (item, type = "movie") => {
  const id          = item._id;
  const title       = item.title;
  const thumbnail   = item.thumbnail;
  const rating      = item.rating?.toFixed(1) || "N/A";
  const year        = item.year;
  const duration    = item.duration || `${item.seasons} Season${item.seasons > 1 ? "s" : ""}`;

  return `
    <div class="movie-card" data-id="${id}" data-type="${type}" onclick="openModal('${id}','${type}')">
      <img src="${thumbnail}" alt="${title}" loading="lazy"
           onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22300%22%3E%3Crect%20width%3D%22200%22%20height%3D%22300%22%20fill%3D%22%231a1a1a%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22155%22%20fill%3D%22%23666%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%2213%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E'">
      <div class="movie-card-overlay">
        <p class="card-title">${title}</p>
        <div class="card-meta">
          <span class="card-rating">★ ${rating}</span>
          <span>${year}</span>
          <span>${duration}</span>
        </div>
        <div class="card-actions">
          <button class="card-btn play" onclick="event.stopPropagation(); playContent('${id}','${type}')" title="Play">▶</button>
          <button class="card-btn" onclick="event.stopPropagation(); addToWatchlist('${id}','${type}')" title="Add to list">+</button>
        </div>
      </div>
    </div>`;
};

// ─── Render Row ───────────────────────────────────────────────────
const renderRow = (containerId, items, type = "movie") => {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (!items || items.length === 0) {
    el.innerHTML = `<p style="color:var(--text-muted);padding:20px 0;">No content available yet.</p>`;
    return;
  }

  el.innerHTML = items.map((item) => buildMovieCard(item, type)).join("");
};

// ─── Set Hero Banner ──────────────────────────────────────────────
const setHero = (item, type = "movie") => {
  if (!item) return;

  const backdrop = item.backdropImage || item.thumbnail;
  const heroEl   = document.querySelector(".hero-backdrop");
  if (heroEl) heroEl.style.backgroundImage = `url("${backdrop}")`;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText("hero-badge",       type === "movie" ? "🎬 FEATURED MOVIE" : "📺 FEATURED SHOW");
  setText("hero-title",       item.title);
  setText("hero-description", item.description || "");
  setText("hero-rating",      `★ ${item.rating?.toFixed(1) || "N/A"}`);
  setText("hero-year",        item.year);
  setText("hero-duration",    item.duration || (item.seasons ? `${item.seasons} Seasons` : ""));

  // Wire play button
  const playBtn = document.getElementById("hero-play-btn");
  if (playBtn) {
    playBtn.onclick = () => playContent(item._id, type);
  }

  const listBtn = document.getElementById("hero-list-btn");
  if (listBtn) {
    listBtn.onclick = () => addToWatchlist(item._id, type);
  }
};

// ─── Load All Sections ────────────────────────────────────────────
const loadHomePage = async () => {
  try {
    // Fire all requests in parallel
    const [trendingMovies, recommendedMovies, actionMovies,
           comedyMovies, trendingShows] = await Promise.all([
      api.get("/movies/trending?limit=10"),
      api.get("/movies/recommended?limit=10"),
      api.get("/movies/genre/Action?limit=10"),
      api.get("/movies/genre/Comedy?limit=10"),
      api.get("/tvshows/trending?limit=10"),
    ]);

    const trending     = trendingMovies.data.data;
    const recommended  = recommendedMovies.data.data;
    const action       = actionMovies.data.data;
    const comedy       = comedyMovies.data.data;
    const tvTrending   = trendingShows.data.data;

    // Hero: pick first featured trending item
    const heroItem = trending[0] || recommended[0];
    if (heroItem) setHero(heroItem, "movie");

    // Render rows
    renderRow("trending-row",     trending,    "movie");
    renderRow("recommended-row",  recommended, "movie");
    renderRow("action-row",       action,      "movie");
    renderRow("comedy-row",       comedy,      "movie");
    renderRow("tvshow-row",       tvTrending,  "tvshow");

    // Hide loading spinners
    document.querySelectorAll(".row-spinner").forEach((el) => el.remove());
  } catch (error) {
    console.error("Failed to load home page:", error);
    showToast("Failed to load content. Is the server running?", "error");
  }
};

// ─── Add to Watchlist ─────────────────────────────────────────────
const addToWatchlist = async (id, type) => {
  try {
    const endpoint = type === "movie"
      ? `/watchlist/movie/${id}`
      : `/watchlist/tvshow/${id}`;
    await api.post(endpoint);
    showToast("Added to your watchlist ✅", "success");
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

// ─── Play Content ─────────────────────────────────────────────────
const playContent = async (id, type) => {
  // Record as recently watched
  try {
    await api.post("/recently-watched", { contentId: id, contentType: type });
  } catch {}
  
  try {
    const endpoint = type === "movie" ? `/movies/${id}` : `/tvshows/${id}`;
    const { data } = await api.get(endpoint);
    const item     = data.data;
    playVideo(item.videoUrl, item.title);
  } catch (error) {
    showToast("Error starting playback: " + getErrorMessage(error), "error");
  }
};

// ─── Simple Movie Detail Modal ────────────────────────────────────
const openModal = async (id, type) => {
  try {
    const endpoint = type === "movie" ? `/movies/${id}` : `/tvshows/${id}`;
    const { data } = await api.get(endpoint);
    const item     = data.data;

    const modalHTML = `
      <div class="modal-overlay" id="detail-modal" onclick="closeModalOnOverlay(event)">
        <div class="modal">
          <button class="modal-close" onclick="document.getElementById('detail-modal').remove()">✕</button>
          <div style="position:relative;height:280px;overflow:hidden;border-radius:12px 12px 0 0;">
            <img src="${item.backdropImage || item.thumbnail}" alt="${item.title}"
                 style="width:100%;height:100%;object-fit:cover;">
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(31,31,31,1) 0%,transparent 50%)"></div>
          </div>
          <div style="padding:28px;">
            <h2 style="font-size:26px;font-weight:800;margin-bottom:10px;">${item.title}</h2>
            <div style="display:flex;gap:16px;margin-bottom:16px;font-size:13px;color:#b3b3b3;">
              <span style="color:#46d369;font-weight:700;">★ ${item.rating?.toFixed(1) || "N/A"}</span>
              <span>${item.year}</span>
              <span>${item.maturityRating || ""}</span>
              <span>${item.duration || (item.seasons ? item.seasons + " Seasons" : "")}</span>
              <span>${item.language || "English"}</span>
            </div>
            <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
              ${(item.genre || []).map((g) => `<span class="badge badge-red">${g}</span>`).join("")}
            </div>
            <p style="font-size:14px;color:#b3b3b3;line-height:1.7;margin-bottom:24px;">${item.description}</p>
            ${item.cast?.length ? `<p style="font-size:13px;color:#808080;margin-bottom:6px;"><strong style="color:#b3b3b3;">Cast:</strong> ${item.cast.join(", ")}</p>` : ""}
            ${item.director ? `<p style="font-size:13px;color:#808080;"><strong style="color:#b3b3b3;">Director:</strong> ${item.director}</p>` : ""}
            <div style="display:flex;gap:12px;margin-top:24px;">
              <button class="btn btn-primary" onclick="playContent('${id}','${type}')">▶ Play</button>
              <button class="btn btn-secondary" onclick="addToWatchlist('${id}','${type}')">+ My List</button>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

const closeModalOnOverlay = (e) => {
  if (e.target.id === "detail-modal") {
    document.getElementById("detail-modal")?.remove();
  }
};

// ─── Init ─────────────────────────────────────────────────────────
loadHomePage();
