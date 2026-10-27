# Hertz Canada

The Hertz Canada Four51 storefront theme. Four51 deploys this repo with Git File Deployment.

It started as a copy of the Hertz (US) theme, [`thumb-dev/Hertz`](https://github.com/thumb-dev/Hertz), after that repo was brought up to date with the live US site (www.hertzmarket.com/shop) on 2026-10-27.

## Layout

The theme is flat at the repo root: `index.html`, `js/`, `css/`, `lib/`, `partials/`, `fonts/`, `images/`. There is no build step. AngularJS 1.2 static files are served exactly as they are in git.

The US repo keeps the theme under `app/`, next to an old test harness. That layout is left out here on purpose. When Hertz-Reformed was moved under `app/` on this Four51 account, the deploy broke: `index.html` was served at the site root, every `js/…` and `css/…` request 404'd, and Angular never started. Every asset path in `index.html` is relative, so the assets have to sit right beside it. **Don't add an `app/` folder** without re-testing a deploy.

`index.html` keeps Four51's `<!--baseTagToken-->` and `<!--headscriptToken-->` placeholders. Four51 replaces them when it serves the page (base path, sign-in state, analytics). Don't paste in a copy of the live page source in their place.

## Four51 Git File Deployment

In Four51 admin, go to **Git File Deployment** and choose **New Git Repository**:

| Field | Value |
|---|---|
| Repository URL | `https://github.com/Thumbprint-Dev/Hertz-Canada` |
| App code folder | the repo root. Try `/`, then `.` |
| Deployment sub folder in repository | *(leave blank)* |

Then **Pull Repository**, **Deploy Commit** on the newest commit, and assign the app to the Hertz Canada site.

- **A merge to `master` is a live deploy.** There's no staging step in between.
- If a change doesn't show up, clear `localStorage` before assuming the deploy failed. The category tree is cached there with no expiry. Check the live file with `curl` and a cache-busting query string.

## Pulling later changes from the US theme

The US repo is set up as the `hertz-us` remote:

```
git fetch hertz-us
git merge hertz-us/main
```

Git follows the `app/` → root move for files that weren't otherwise touched. Review the merge before pushing, because it deploys.
