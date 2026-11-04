# Taste of Africa

A multi-page website celebrating the rich and diverse cuisines of Africa. Visitors can browse traditional recipes, explore food by region, save favourite dishes, scale ingredients for any number of servings, and learn about the history and cultures behind the food.

Built with **HTML5, CSS and vanilla JavaScript only**: no frameworks or libraries.

## 🔗 Live Site

**GitHub Pages:** _Coming soon — https://cashme8.github.io/taste_of_africa_website_project/ (link will be confirmed once deployed)_

## ✨ Features

- **Responsive design**: CSS Grid and Flexbox layouts with breakpoints for tablets (≤ 900px) and phones (≤ 640px), plus a mobile-friendly navigation bar
- **Dark / light mode**: theme toggle in every page header, remembered between visits
- **Recipe filter**: show recipes by region (West, East, North or Southern Africa)
- **Favorites**: save recipes with ❤️; your choices persist in the browser
- **Ingredient scaler**: change the number of servings and every quantity updates
- **Contact form validation**: friendly error messages and a personalised thank-you
- **Newsletter signup**: in every page footer
- **Embedded media**: YouTube cooking videos and Google Maps (responsive 16:9 wrappers)
- **Accessible, semantic HTML**: landmarks, one `<h1>` per page, labelled form fields, alt text, `<mark>` highlights for key ingredients and techniques

## 📄 Pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Hero with video, featured dishes, regions, food trends |
| Recipes | `recipes.html` | Filterable recipe cards with favorite buttons |
| Regions | `regions.html` | Overview of Africa's culinary regions |
| About | `about.html` | Mission statement, history of African cuisine, Kigali map |
| Contact | `contact.html` | Validated contact form with country suggestions |

### Recipe pages (`recipes/`)
Each one includes the story of the dish, an ingredient scaler, collapsible steps, a video tutorial, a nutrition table and a map of its country of origin.

- Jollof Rice (West Africa): `recipes/jollof-rice.html`
- Tagine (North Africa): `recipes/tagine.html`
- Injera (East Africa): `recipes/injera.html`
- Bunny Chow (Southern Africa): `recipes/bunny-chow.html`
- Isombe (East Africa): `recipes/isombe.html`

### Region pages (`regions/`)
Food culture, staple ingredients, cooking techniques, signature dishes and a video.

- West Africa: `regions/west-africa.html`
- North Africa: `regions/north-africa.html`
- East Africa: `regions/east-africa.html`

## ⚙️ How the JavaScript Works

All code is in `js/script.js`, loaded with `defer` on every page. Each feature is its own function and first checks that its elements exist, so the same script runs safely on every page.

1. **Recipe filter** (`initRecipeFilter`): each `.filter-btn` has a `data-region`. On click, the script marks that button `.active` and loops through every `.recipe-card`, adding the `.hidden` class to cards whose `data-region` doesn't match (`all` shows everything).
2. **Favorites** (`initFavorites`): each `.favorite-btn` has a `data-id` (e.g. `jollof-rice`). Clicking toggles the `.active` class and adds or removes that id in an array stored in `localStorage`. On page load the array is read back and matching buttons are marked active. Favorites are shared between the recipes list and the individual recipe pages.
3. **Contact form** (`initContactForm`): `event.preventDefault()` stops the page reloading. The script checks the name, email and that the message is **more than 20 characters**. Errors appear in `#form-error`. On success the form is hidden and `#form-success` shows *"Thank you, [Name]! We've received your message."*
4. **Ingredient scaler** (`initIngredientScaler`): the `#servings` input stores the original serving count in `data-base-servings`. Each amount is a `<span class="qty" data-qty="…">`. When servings change, every amount becomes `data-qty × servings ÷ base servings`, rounded to at most 2 decimals.
5. **Dark mode** (`initThemeToggle`): `#theme-toggle` toggles `body.dark-mode`, which redefines the CSS colour variables. The choice (`dark`/`light`) is saved in `localStorage` and restored on every page.
6. **Newsletter** (`initNewsletter`): prevents the default submit and shows "Thanks for subscribing!" under the form.

## 🛠️ Technologies Used

- HTML5 (semantic elements, forms, `<details>`, `<datalist>`, tables, iframes)
- CSS3 (custom properties, Grid, Flexbox, media queries, transitions)
- Vanilla JavaScript (DOM events, `localStorage`)
- Google Fonts: Abril Fatface (headings), Nunito (body)

## 📁 Project Structure

```
├── index.html, recipes.html, regions.html, about.html, contact.html
├── recipes/      # Individual recipe pages
├── regions/      # Regional cuisine pages
├── css/styles.css
├── js/script.js
└── images/       # Dish, region and hero photos
```

## ▶️ Running Locally

No build step is needed. Open `index.html` in a browser, or use the VS Code **Live Server** extension for auto-reload.
