/**
 * watchlist.js — Loads and manages user's watchlist
 */

if (!requireAuth()) throw new Error("Auth required");

const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 10);
});

// ─── Build Watchlist Card ─────────────────────────────────────────
const buildWatchlistCard = (item, type, id) => {
  const title    = item.title;
  const thumb    = item.thumbnail;
  const rating   = item.rating?.toFixed(1) || "N/A";
  const year     = item.year;
  const sub      = type === "tvshow"
    ? `${item.seasons} Season${item.seasons > 1 ? "s" : ""}`
    : item.duration || "N/A";

  return `
    <div class="movie-card" id="card-${id}" style="width:100%;">
      <img src="${thumb}" alt="${title}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/200x300/1a1a1a/666?text=No+Image'">
      <div class="movie-card-overlay">
        <p class="card-title">${title}</p>
        <div class="card-meta">
          <span class="card-rating">★ ${rating}</span>
          <span>${year}</span>
          <span>${sub}</span>
        </div>
        <div class="card-actions">
          <button class="card-btn play" onclick="playWatchlistItem('${id}','${type}')" title="Play">▶</button>
          <button class="card-btn" style="background:rgba(229,9,20,0.4);border-color:rgba(229,9,20,0.6);"
                  onclick="removeItem('${id}','${type}')" title="Remove">✕</button>
        </div>
      </div>
    </div>`;
};

// ─── Load Watchlist ───────────────────────────────────────────────
const loadWatchlist = async () => {
  const moviesGrid  = document.getElementById("watchlist-movies");
  const showsGrid   = document.getElementById("watchlist-shows");
  const countEl     = document.getElementById("watchlist-count");

  try {
    const { data } = await api.get("/watchlist");
    const wl        = data.data;

    const movies    = wl.movies  || [];
    const tvshows   = wl.tvshows || [];
    const total     = movies.length + tvshows.length;

    if (countEl) countEl.textContent = total;

    // Movies section
    if (moviesGrid) {
      if (movies.length === 0) {
        moviesGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;padding:40px 0;">
          <div class="empty-icon">🎬</div>
          <h3>No movies yet</h3>
          <p>Browse movies and add them to your list</p>
          <a href="browse.html" class="btn btn-primary btn-sm" style="margin-top:16px;">Browse Movies</a>
        </div>`;
      } else {
        moviesGrid.innerHTML = movies
          .filter((m) => m.movie)
          .map((m) => buildWatchlistCard(m.movie, "movie", m.movie._id))
          .join("");
      }
    }

    // TV Shows section
    if (showsGrid) {
      if (tvshows.length === 0) {
        showsGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;padding:40px 0;">
          <div class="empty-icon">📺</div>
          <h3>No TV shows yet</h3>
          <p>Browse TV shows and add them to your list</p>
          <a href="browse.html" class="btn btn-primary btn-sm" style="margin-top:16px;">Browse Shows</a>
        </div>`;
      } else {
        showsGrid.innerHTML = tvshows
          .filter((t) => t.tvshow)
          .map((t) => buildWatchlistCard(t.tvshow, "tvshow", t.tvshow._id))
          .join("");
      }
    }
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

// ─── Remove from Watchlist ────────────────────────────────────────
const removeItem = async (id, type) => {
  try {
    const endpoint = type === "movie"
      ? `/watchlist/movie/${id}`
      : `/watchlist/tvshow/${id}`;
    await api.delete(endpoint);
    document.getElementById(`card-${id}`)?.remove();
    showToast("Removed from watchlist", "info");
    // Reload to update count
    loadWatchlist();
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

// ─── Play Item ────────────────────────────────────────────────────
const playWatchlistItem = async (id, type) => {
  try { await api.post("/recently-watched", { contentId: id, contentType: type }); } catch {}
  
  try {
    const endpoint = type === "movie" ? `/movies/${id}` : `/tvshows/${id}`;
    const { data } = await api.get(endpoint);
    const item     = data.data;
    playVideo(item.videoUrl, item.title);
  } catch (error) {
    showToast("Error starting playback: " + getErrorMessage(error), "error");
  }
};

// ─── Init ─────────────────────────────────────────────────────────
loadWatchlist();
