/* Small interactions used across the site. */

/* I use these keys to remember favorites and the chosen theme. */
const FAVORITES_KEY = "toa-favorites";
const THEME_KEY = "toa-theme";

/* Storage can be blocked, so these helpers keep that from breaking the page. */
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
    // If storage is blocked, the rest of the feature still works.
  }
}

/* Show recipes from the selected region, or all of them. */
function initRecipeFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const recipeCards = document.querySelectorAll(".recipe-card");

  if (filterButtons.length === 0 || recipeCards.length === 0) return;

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("active"));

    button.addEventListener("click", () => {
      const region = button.dataset.region;

      // Show which filter is selected.
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Keep matching cards visible and hide the rest.
      recipeCards.forEach((card) => {
        const matches = region === "all" || card.dataset.region === region;
        card.classList.toggle("hidden", !matches);
      });
    });
  });
}

/* Save favorite dishes and restore them when the page loads. */
function getFavorites() {
  try {
    const saved = JSON.parse(storageGet(FAVORITES_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return []; // If the saved value is unreadable, start with an empty list.
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

  // Bring back the favorites saved from an earlier visit.
  const favorites = getFavorites();
  favoriteButtons.forEach((button) => {
    setFavoriteState(button, favorites.includes(button.dataset.id));
  });

  // Let each button add or remove its dish from the list.
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

/* Check the contact form and show a thank-you when everything looks good. */
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

    // Show the first issue the visitor needs to fix.
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

    // Clear the error, hide the form, and show a thank-you.
    errorBox.textContent = "";
    form.classList.add("hidden");
    successBox.textContent = `Thank you, ${name}! We've received your message.`;
    successBox.classList.remove("hidden");
  });

  // Clear the old error as soon as they start typing again.
  form.addEventListener("input", () => {
    errorBox.textContent = "";
  });
}

/* Update ingredient amounts when the serving count changes. */
function formatQuantity(value) {
  // Keep whole numbers tidy and trim decimals to at most two places.
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

    // Leave the amounts alone while the input is empty or invalid.
    if (!servings || servings <= 0) return;

    quantities.forEach((qty) => {
      const baseQty = parseFloat(qty.dataset.qty);
      qty.textContent = formatQuantity((baseQty * servings) / baseServings);
    });
  }

  servingsInput.addEventListener("input", updateQuantities);
  servingsInput.addEventListener("change", updateQuantities);
}

/* Restore the saved theme and let the button switch between modes. */
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

  // Apply the saved theme even if this page has no toggle button.
  applyTheme(storageGet(THEME_KEY) === "dark", toggleButton);

  if (!toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark, toggleButton);
    storageSet(THEME_KEY, isDark ? "dark" : "light");
  });
}

/* Show a quick signup thank-you without reloading the page. */
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

/* Start each feature once the page is ready. */
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initRecipeFilter();
  initFavorites();
  initContactForm();
  initIngredientScaler();
  initNewsletter();
});
