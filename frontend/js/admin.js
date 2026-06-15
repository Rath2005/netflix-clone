/**
 * admin.js — Admin dashboard: stats, movie/TV show management, user management
 */

if (!requireAuth()) throw new Error("Auth required");
if (!requireAdmin()) throw new Error("Admin required");

const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 10);
});

// ─── Load Stats ───────────────────────────────────────────────────
const loadStats = async () => {
  try {
    const { data } = await api.get("/admin/stats");
    const stats    = data.data;

    setVal("stat-users",   stats.totalUsers);
    setVal("stat-movies",  stats.totalMovies);
    setVal("stat-shows",   stats.totalTVShows);

    // Recent users mini table
    const recentBody = document.getElementById("recent-users-body");
    if (recentBody && stats.recentUsers) {
      recentBody.innerHTML = stats.recentUsers
        .map(
          (u) => `
          <tr>
            <td class="user-name">${u.name}</td>
            <td>${u.email}</td>
            <td><span class="badge ${u.role === "admin" ? "badge-red" : "badge-green"}">${u.role}</span></td>
            <td>${new Date(u.createdAt).toLocaleDateString()}</td>
          </tr>`
        )
        .join("");
    }
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

// ─── Load Users ───────────────────────────────────────────────────
const loadUsers = async () => {
  const tbody = document.getElementById("users-body");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;"><div class="spinner" style="width:30px;height:30px;margin:0 auto;"></div></td></tr>`;

  try {
    const { data } = await api.get("/admin/users?limit=50");
    tbody.innerHTML = data.data
      .map(
        (u) => `
        <tr>
          <td class="user-name">${u.name}</td>
          <td>${u.email}</td>
          <td><span class="badge ${u.role === "admin" ? "badge-red" : "badge-green"}">${u.role}</span></td>
          <td>${new Date(u.createdAt).toLocaleDateString()}</td>
          <td>
            <div style="display:flex;gap:8px;">
              ${u.role !== "admin" ? `<button class="btn btn-sm btn-secondary" onclick="promoteUser('${u._id}')">Promote</button>` : ""}
              <button class="btn btn-sm" style="background:rgba(229,9,20,0.2);color:#ff6b6b;border:1px solid rgba(229,9,20,0.3);"
                      onclick="deleteUser('${u._id}','${u.name}')">Delete</button>
            </div>
          </td>
        </tr>`
      )
      .join("");
  } catch (error) {
    showToast(getErrorMessage(error), "error");
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px;">Failed to load users</td></tr>`;
  }
};

// ─── Promote User ─────────────────────────────────────────────────
const promoteUser = async (id) => {
  if (!confirm("Promote this user to admin?")) return;
  try {
    const { data } = await api.put(`/admin/users/${id}/promote`);
    showToast(`${data.data.name} is now an admin ✅`, "success");
    loadUsers();
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

// ─── Delete User ──────────────────────────────────────────────────
const deleteUser = async (id, name) => {
  if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
  try {
    await api.delete(`/admin/users/${id}`);
    showToast(`User "${name}" deleted ✅`, "success");
    loadUsers();
    loadStats();
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

// ─── Add Movie Form ───────────────────────────────────────────────
const addMovieForm = document.getElementById("add-movie-form");
if (addMovieForm) {
  addMovieForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn  = document.getElementById("add-movie-btn");
    btn.disabled    = true;
    btn.textContent = "Adding...";

    const formData = {
      title:         getInputVal("m-title"),
      description:   getInputVal("m-description"),
      genre:         getInputVal("m-genre").split(",").map((g) => g.trim()).filter(Boolean),
      year:          parseInt(getInputVal("m-year")),
      rating:        parseFloat(getInputVal("m-rating")) || 0,
      duration:      getInputVal("m-duration"),
      thumbnail:     getInputVal("m-thumbnail"),
      backdropImage: getInputVal("m-backdrop"),
      videoUrl:      getInputVal("m-videoUrl"),
      language:      getInputVal("m-language") || "English",
      isTrending:    document.getElementById("m-trending")?.checked || false,
      isRecommended: document.getElementById("m-recommended")?.checked || false,
    };

    try {
      await api.post("/movies", formData);
      showToast("Movie added successfully ✅", "success");
      addMovieForm.reset();
      loadStats();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      btn.disabled    = false;
      btn.textContent = "Add Movie";
    }
  });
}

// ─── Add TV Show Form ─────────────────────────────────────────────
const addShowForm = document.getElementById("add-show-form");
if (addShowForm) {
  addShowForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn  = document.getElementById("add-show-btn");
    btn.disabled    = true;
    btn.textContent = "Adding...";

    const formData = {
      title:         getInputVal("s-title"),
      description:   getInputVal("s-description"),
      genre:         getInputVal("s-genre").split(",").map((g) => g.trim()).filter(Boolean),
      year:          parseInt(getInputVal("s-year")),
      rating:        parseFloat(getInputVal("s-rating")) || 0,
      seasons:       parseInt(getInputVal("s-seasons")) || 1,
      episodes:      parseInt(getInputVal("s-episodes")) || 1,
      thumbnail:     getInputVal("s-thumbnail"),
      videoUrl:      getInputVal("s-videoUrl"),
      isTrending:    document.getElementById("s-trending")?.checked || false,
      isRecommended: document.getElementById("s-recommended")?.checked || false,
    };

    try {
      await api.post("/tvshows", formData);
      showToast("TV Show added successfully ✅", "success");
      addShowForm.reset();
      loadStats();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      btn.disabled    = false;
      btn.textContent = "Add TV Show";
    }
  });
}

// ─── Tab Navigation ───────────────────────────────────────────────
document.querySelectorAll(".admin-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target;
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(target)?.classList.add("active");
    if (target === "panel-users") loadUsers();
  });
});

// ─── Helpers ──────────────────────────────────────────────────────
const setVal = (id, val) => {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
};

const getInputVal = (id) => document.getElementById(id)?.value?.trim() || "";

// ─── Init ─────────────────────────────────────────────────────────
loadStats();
