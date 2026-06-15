/**
 * profile.js — View and edit user profile, change password
 */

if (!requireAuth()) throw new Error("Auth required");

const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 10);
});

// ─── Load Profile ─────────────────────────────────────────────────
const loadProfile = async () => {
  try {
    const { data } = await api.get("/users/profile");
    const user     = data.data;

    // Populate view
    setVal("profile-name",  user.name);
    setVal("profile-email", user.email);
    setVal("profile-role",  user.role === "admin" ? "🔐 Administrator" : "👤 Member");
    setVal("profile-since", new Date(user.createdAt).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
    }));

    // Avatar
    const avatar = document.getElementById("profile-avatar");
    if (avatar) {
      avatar.src = user.profilePic ||
        `https://ui-avatars.com/api/?background=e50914&color=fff&name=${encodeURIComponent(user.name)}&bold=true&size=200`;
    }

    // Pre-fill edit form
    const nameInput = document.getElementById("edit-name");
    const picInput  = document.getElementById("edit-profilePic");
    if (nameInput) nameInput.value = user.name;
    if (picInput)  picInput.value  = user.profilePic || "";
  } catch (error) {
    showToast(getErrorMessage(error), "error");
  }
};

const setVal = (id, val) => {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
};

// ─── Update Profile ───────────────────────────────────────────────
const profileForm = document.getElementById("profile-form");
if (profileForm) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn  = document.getElementById("profile-save-btn");
    const name = document.getElementById("edit-name")?.value.trim();
    const pic  = document.getElementById("edit-profilePic")?.value.trim();

    if (!name) {
      showToast("Name cannot be empty", "error");
      return;
    }

    btn.disabled    = true;
    btn.textContent = "Saving...";

    try {
      const { data } = await api.put("/users/profile", { name, profilePic: pic || undefined });
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("netflix_user") || "{}");
      localStorage.setItem("netflix_user", JSON.stringify({ ...stored, ...data.data }));
      showToast("Profile updated successfully ✅", "success");
      loadProfile();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      btn.disabled    = false;
      btn.textContent = "Save Changes";
    }
  });
}

// ─── Change Password ──────────────────────────────────────────────
const passwordForm = document.getElementById("password-form");
if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn         = document.getElementById("password-save-btn");
    const current     = document.getElementById("current-password")?.value;
    const newPass     = document.getElementById("new-password")?.value;
    const confirmPass = document.getElementById("confirm-password")?.value;

    if (!current || !newPass || !confirmPass) {
      showToast("All password fields are required", "error");
      return;
    }

    if (newPass !== confirmPass) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (newPass.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    btn.disabled    = true;
    btn.textContent = "Changing...";

    try {
      await api.put("/users/change-password", {
        currentPassword: current,
        newPassword: newPass,
      });
      showToast("Password changed successfully ✅", "success");
      passwordForm.reset();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      btn.disabled    = false;
      btn.textContent = "Change Password";
    }
  });
}

// ─── Init ─────────────────────────────────────────────────────────
loadProfile();
