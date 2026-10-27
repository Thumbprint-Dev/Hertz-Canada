# Hertz Canada

The Hertz Canada Four51 storefront theme. Four51 deploys this repo with Git File Deployment.

It started as a copy of the Hertz (US) theme, [`thumb-dev/Hertz`](https://github.com/thumb-dev/Hertz), after that repo was brought up to date with the live US site (www.hertzmarket.com/shop) on 2026-10-27.

## Layout

The whole site lives in `app/`: `index.html`, `js/`, `css/`, `lib/`, `partials/`, `fonts/`, `images/`. There is no build step. AngularJS 1.2 static files are served exactly as they are in git.

This matches the US Hertz repo (`thumb-dev/Hertz`), which deploys correctly to this Four51 account with the Deployment Sub Folder left blank. With a blank sub folder, Four51 serves the site from the repo's `app/` folder. A differently named folder (`HertzCanada/` was tried) deploys, but the site comes up empty. Every asset path in `index.html` is relative (`js/…`, `css/…`), so the assets have to stay right beside `index.html` inside `app/`.

`index.html` keeps Four51's `<!--baseTagToken-->` and `<!--headscriptToken-->` placeholders. Four51 replaces them when it serves the page (base path, sign-in state, analytics). Don't paste in a copy of the live page source in their place.

## Four51 Git File Deployment

In Four51 admin, go to **Git File Deployment** and choose **New Git Repository**:

| Field | Value |
|---|---|
| Repository URL | `https://github.com/Thumbprint-Dev/Hertz-Canada` |
| App code folder | `HertzCanada` (the name the app shows under in Four51) |
| Deployment sub folder in repository | *(blank, same as the US Hertz entry)* |

Then **Pull Repository**, **Deploy Commit** on the newest commit, and assign the app to the Hertz Canada site.

- **A merge to `master` is a live deploy.** There's no staging step in between.
- If a change doesn't show up, clear `localStorage` before assuming the deploy failed. The category tree is cached there with no expiry. Check the live file with `curl` and a cache-busting query string.

## Pulling later changes from the US theme

The US repo is set up as the `hertz-us` remote:

```
git fetch hertz-us
git merge hertz-us/main
```

Both repos keep the site in `app/`, so US changes line up file for file. Review the merge before pushing, because it deploys.
