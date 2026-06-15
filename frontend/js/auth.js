/**
 * auth.js — Handles login, register, and logout
 */

// ─── Register ─────────────────────────────────────────────────────
const registerForm = document.getElementById("register-form");
if (registerForm) {
  // Redirect if already logged in
  if (isLoggedIn()) window.location.href = "index.html";

  // Password strength indicator
  const passwordInput = document.getElementById("password");
  const strengthBar   = document.getElementById("strength-bar");

  if (passwordInput && strengthBar) {
    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value;
      let strength = 0;
      if (val.length >= 6)                            strength++;
      if (/[A-Z]/.test(val))                          strength++;
      if (/[0-9]/.test(val))                          strength++;
      if (/[^A-Za-z0-9]/.test(val))                  strength++;

      const widths  = ["0%", "25%", "50%", "75%", "100%"];
      const colors  = ["transparent", "#e50914", "#e5c30a", "#46d369", "#46d369"];
      strengthBar.style.width      = widths[strength];
      strengthBar.style.background = colors[strength];
    });
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn       = document.getElementById("register-btn");
    const errorEl   = document.getElementById("auth-error");
    const name      = document.getElementById("name").value.trim();
    const email     = document.getElementById("email").value.trim();
    const password  = document.getElementById("password").value;

    // Clear previous error
    errorEl.textContent = "";
    errorEl.classList.remove("show");

    if (!name || !email || !password) {
      errorEl.textContent = "All fields are required.";
      errorEl.classList.add("show");
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="width:20px;height:20px;border-width:2px;margin:0;"></span> Creating account...`;

    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      // Store token and user
      localStorage.setItem("netflix_token", data.data.token);
      localStorage.setItem("netflix_user", JSON.stringify(data.data));
      showToast("Account created! Welcome to Netflix Clone 🎬", "success");
      setTimeout(() => (window.location.href = "index.html"), 1200);
    } catch (error) {
      const msg = getErrorMessage(error);
      errorEl.textContent = msg;
      errorEl.classList.add("show");
      btn.disabled = false;
      btn.innerHTML = "Create Account";
    }
  });
}

// ─── Login ────────────────────────────────────────────────────────
const loginForm = document.getElementById("login-form");
if (loginForm) {
  // Redirect if already logged in
  if (isLoggedIn()) window.location.href = "index.html";

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn     = document.getElementById("login-btn");
    const errorEl = document.getElementById("auth-error");
    const email   = document.getElementById("email").value.trim();
    const password= document.getElementById("password").value;

    errorEl.textContent = "";
    errorEl.classList.remove("show");

    if (!email || !password) {
      errorEl.textContent = "Please enter both email and password.";
      errorEl.classList.add("show");
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" style="width:20px;height:20px;border-width:2px;margin:0;"></span> Signing in...`;

    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("netflix_token", data.data.token);
      localStorage.setItem("netflix_user", JSON.stringify(data.data));
      showToast(`Welcome back, ${data.data.name}! 🎬`, "success");
      setTimeout(() => (window.location.href = "index.html"), 1200);
    } catch (error) {
      const msg = getErrorMessage(error);
      errorEl.textContent = msg;
      errorEl.classList.add("show");
      btn.disabled = false;
      btn.innerHTML = "Sign In";
    }
  });
}

// ─── Logout ───────────────────────────────────────────────────────
const logoutBtns = document.querySelectorAll(".logout-btn");
logoutBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("netflix_token");
    localStorage.removeItem("netflix_user");
    showToast("Signed out. See you soon! 👋", "info");
    setTimeout(() => (window.location.href = "login.html"), 1000);
  });
});

// ─── Populate Navbar User Info ────────────────────────────────────
const populateNavUser = () => {
  const user = getCurrentUser();
  if (!user) return;

  const nameEl   = document.getElementById("nav-user-name");
  const roleEl   = document.getElementById("nav-user-role");
  const avatarEl = document.getElementById("nav-avatar");

  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) roleEl.textContent = user.role;
  if (avatarEl) {
    avatarEl.src = user.profilePic ||
      `https://ui-avatars.com/api/?background=e50914&color=fff&name=${encodeURIComponent(user.name)}&bold=true`;
    avatarEl.alt = user.name;
  }

  // Show admin link if admin
  const adminLink = document.getElementById("admin-link");
  if (adminLink && user.role === "admin") {
    adminLink.style.display = "flex";
  }
};

// Run on page load
populateNavUser();
