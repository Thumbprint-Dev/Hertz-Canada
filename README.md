# Hertz Canada

The Hertz Canada Four51 storefront theme. Four51 deploys this repo with Git File Deployment.

It started as a copy of the Hertz (US) theme, [`thumb-dev/Hertz`](https://github.com/thumb-dev/Hertz), after that repo was brought up to date with the live US site (www.hertzmarket.com/shop) on 2026-10-27.

## Layout

The whole site lives in `HertzCanada/`: `index.html`, `js/`, `css/`, `lib/`, `partials/`, `fonts/`, `images/`. There is no build step. AngularJS 1.2 static files are served exactly as they are in git.

Four51 requires a deployment sub folder, so the site lives in a folder named after the app, `HertzCanada/`, and that's the sub folder. Four51 then deploys the *contents* of `HertzCanada/` to the site root. Every asset path in `index.html` is relative (`js/…`, `css/…`), so the assets have to stay right beside `index.html` inside `HertzCanada/`.

When Hertz-Reformed tried an `app/` folder with the sub folder left blank, Four51 published the files one level too deep and every asset 404'd. The sub folder setting is what prevents that.

`index.html` keeps Four51's `<!--baseTagToken-->` and `<!--headscriptToken-->` placeholders. Four51 replaces them when it serves the page (base path, sign-in state, analytics). Don't paste in a copy of the live page source in their place.

## Four51 Git File Deployment

In Four51 admin, go to **Git File Deployment** and choose **New Git Repository**:

| Field | Value |
|---|---|
| Repository URL | `https://github.com/Thumbprint-Dev/Hertz-Canada` |
| App code folder | `HertzCanada` (the name the app shows under in Four51's dropdown) |
| Deployment sub folder in repository | `HertzCanada` |

Then **Pull Repository**, **Deploy Commit** on the newest commit, and assign the app to the Hertz Canada site.

- **A merge to `master` is a live deploy.** There's no staging step in between.
- If a change doesn't show up, clear `localStorage` before assuming the deploy failed. The category tree is cached there with no expiry. Check the live file with `curl` and a cache-busting query string.

## Pulling later changes from the US theme

The US repo is set up as the `hertz-us` remote:

```
git fetch hertz-us
git merge hertz-us/main
```

The US repo keeps its site in `app/`, and this one keeps it in `HertzCanada/`. Git usually follows the rename when merging, but check that US changes landed in `HertzCanada/`. Review the merge before pushing, because it deploys.
