/* ==========================================================================
   Taste of Africa — Main Script
   Description: Interactive features for the Taste of Africa website.
   Vanilla JavaScript only. Loaded with "defer" on every page.

   Features (each checks that its elements exist before running):
     1. Recipe filter       (recipes.html)
     2. Favorites           (recipes.html + recipe pages)
     3. Contact form        (contact.html)
     4. Ingredient scaler   (recipe pages)
     5. Dark mode toggle    (every page)
     6. Newsletter signup   (every page footer)
   ========================================================================== */

/* localStorage keys */
const FAVORITES_KEY = "toa-favorites";
const THEME_KEY = "toa-theme";

/* --------------------------------------------------------------------------
   Safe localStorage helpers
   (localStorage can throw in private mode or when storage is blocked)
   -------------------------------------------------------------------------- */
function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Storage unavailable: the feature still works, it just won't be remembered.
  }
}

/* --------------------------------------------------------------------------
   1. Recipe filter
   Clicking a .filter-btn shows only the .recipe-card elements whose
   data-region matches (or all of them for "all").
   -------------------------------------------------------------------------- */
function initRecipeFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const recipeCards = document.querySelectorAll(".recipe-card");

  if (filterButtons.length === 0 || recipeCards.length === 0) return;

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("active"));

    button.addEventListener("click", () => {
      const region = button.dataset.region;

      // Mark the clicked button as active
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Show matching cards, hide the rest
      recipeCards.forEach((card) => {
        const matches = region === "all" || card.dataset.region === region;
        card.classList.toggle("hidden", !matches);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. Favorites
   Clicking a .favorite-btn toggles .active and saves/removes its data-id
   in a localStorage array. Saved favorites are restored on page load.
   -------------------------------------------------------------------------- */
function getFavorites() {
  try {
    const saved = JSON.parse(storageGet(FAVORITES_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return []; // corrupted value: start fresh
  }
}

function saveFavorites(favorites) {
  storageSet(FAVORITES_KEY, JSON.stringify(favorites));
}

function setFavoriteState(button, isFavorite) {
  button.classList.toggle("active", isFavorite);
  button.setAttribute("aria-pressed", isFavorite);
}

function initFavorites() {
  const favoriteButtons = document.querySelectorAll(".favorite-btn");
  if (favoriteButtons.length === 0) return;

  // Restore saved favorites
  const favorites = getFavorites();
  favoriteButtons.forEach((button) => {
    setFavoriteState(button, favorites.includes(button.dataset.id));
  });

  // Toggle on click
  favoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      let current = getFavorites();

      if (current.includes(id)) {
        current = current.filter((savedId) => savedId !== id);
        setFavoriteState(button, false);
      } else {
        current.push(id);
        setFavoriteState(button, true);
      }

      saveFavorites(current);
    });
  });
}

/* --------------------------------------------------------------------------
   3. Contact form validation
   Message must be more than 20 characters. On success, hide the form and
   show a personalised thank-you message.
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const errorBox = document.getElementById("form-error");
  const successBox = document.getElementById("form-success");

  if (!form || !errorBox || !successBox) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Check each rule and show the first problem found
    let error = "";
    if (name === "") {
      error = "Please enter your name.";
    } else if (email === "" || !emailInput.checkValidity()) {
      error = "Please enter a valid email address.";
    } else if (message.length <= 20) {
      error = `Your message must be more than 20 characters (currently ${message.length}).`;
    }

    if (error) {
      errorBox.textContent = error;
      return;
    }

    // Success: clear errors, hide form, show thank-you
    errorBox.textContent = "";
    form.classList.add("hidden");
    successBox.textContent = `Thank you, ${name}! We've received your message.`;
    successBox.classList.remove("hidden");
  });

  // Clear the error as soon as the user starts fixing it
  form.addEventListener("input", () => {
    errorBox.textContent = "";
  });
}

/* --------------------------------------------------------------------------
   4. Ingredient scaler
   new amount = data-qty × servings ÷ data-base-servings, rounded neatly.
   -------------------------------------------------------------------------- */
function formatQuantity(value) {
  // Whole numbers stay whole; otherwise round to at most 2 decimals
  // and drop trailing zeros (e.g. 1.50 -> 1.5, 0.333 -> 0.33).
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(parseFloat(rounded.toFixed(2)));
}

function initIngredientScaler() {
  const servingsInput = document.getElementById("servings");
  const quantities = document.querySelectorAll(".qty");

  if (!servingsInput || quantities.length === 0) return;

  const baseServings = parseFloat(servingsInput.dataset.baseServings) || 1;

  function updateQuantities() {
    const servings = parseFloat(servingsInput.value);

    // Ignore empty or invalid values while the user is still typing
    if (!servings || servings <= 0) return;

    quantities.forEach((qty) => {
      const baseQty = parseFloat(qty.dataset.qty);
      qty.textContent = formatQuantity((baseQty * servings) / baseServings);
    });
  }

  servingsInput.addEventListener("input", updateQuantities);
  servingsInput.addEventListener("change", updateQuantities);
}

/* --------------------------------------------------------------------------
   5. Dark mode toggle
   #theme-toggle toggles body.dark-mode; the choice is saved and restored.
   -------------------------------------------------------------------------- */
function applyTheme(isDark, toggleButton) {
  document.body.classList.toggle("dark-mode", isDark);

  if (toggleButton) {
    toggleButton.textContent = isDark ? "☀️" : "🌙";
    toggleButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    toggleButton.setAttribute("aria-pressed", isDark);
  }
}

function initThemeToggle() {
  const toggleButton = document.getElementById("theme-toggle");

  // Restore the saved theme (even if the button were missing)
  applyTheme(storageGet(THEME_KEY) === "dark", toggleButton);

  if (!toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark, toggleButton);
    storageSet(THEME_KEY, isDark ? "dark" : "light");
  });
}

/* --------------------------------------------------------------------------
   6. Newsletter signup
   Prevents the page reload and shows a short thank-you message.
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const forms = document.querySelectorAll(".newsletter-form");
  if (forms.length === 0) return;

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const message = form.parentElement.querySelector(".newsletter-message");
      if (message) {
        message.textContent = "Thanks for subscribing! 🎉";
      }
      form.reset();
    });
  });
}

/* --------------------------------------------------------------------------
   Start everything once the page has loaded
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initRecipeFilter();
  initFavorites();
  initContactForm();
  initIngredientScaler();
  initNewsletter();
});
