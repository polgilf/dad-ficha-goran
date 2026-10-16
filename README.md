# Ficha de Goran

Initial static page for **Ficha de Goran**, currently displaying **En construcción**.

- Website: https://polgilf.github.io/dad-ficha-goran/
- Repository: https://github.com/polgilf/dad-ficha-goran

## Local preview

Open `index.html` in a browser, or run the following from this directory and visit http://localhost:8000/:

```sh
python -m http.server 8000
```

## Publishing updates

GitHub Pages publishes the repository root (`/`) from the `main` branch. The `.nojekyll` file keeps the site as plain static files.

Edit the page and assets, commit the changes, and push to `main`. GitHub Pages will deploy the update automatically; deployment progress appears in the repository's Actions tab.

```sh
git add index.html
git commit -m "Update the page"
git push origin main
```

If the app later needs a framework build, configure GitHub Actions to build and deploy its static output, with `/dad-ficha-goran/` as the base path.
