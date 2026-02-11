---
title: How to add a doc
author: Internal Team
pubDate: 2025-02-11
description: Step-by-step guide to adding or updating documentation. Includes updating the docs directory and where developers keep code.
codeLocation: src/content/docs/
categories: ["Need help"]
---

# How to add a doc

This guide explains how to add or update a doc so it appears on the CHSR docs site.

**Repo:** [CHSR Docs on GitHub](https://github.com/Ishanpathak1/InternalDocs)

---

## Steps (clone → add doc → open PR)

1. **Clone the repo** (if you don’t have it yet):
   ```bash
   git clone https://github.com/Ishanpathak1/InternalDocs.git
   cd InternalDocs
   ```

2. **Create a branch** named after your doc (e.g. `doc-my-feature` or `add-sop-forms`):
   ```bash
   git checkout -b doc-your-doc-name
   ```

3. **Add or edit the doc** in `src/content/docs/` (see sections below for frontmatter and content).

4. **Commit and push**, then **open a Pull Request** on GitHub. Use a clear PR title, e.g.:
   - `Add doc: My Feature Guide`
   - `Add doc: SOP for XYZ`
   - `Update doc: Form Development SOP`

5. After the PR is merged, the site will rebuild and your doc will appear in the chosen category/categories.

---

## 1. Create or edit the file in the docs directory

**The docs directory is:** `src/content/docs/`

- **Adding a new doc:** Create a new `.md` file in `src/content/docs/` (e.g. `src/content/docs/my-feature.md`).
- **Editing:** Open the existing `.md` file and edit it.

There is no separate “directory list” to update. The site builds from every `.md` file in `src/content/docs/`. Adding or renaming a file there is enough — the next build will pick it up.

## 2. Add frontmatter at the top

Every doc must have **YAML frontmatter** between the first two `---` lines. Include at least:

```yaml
---
title: Your Doc Title
author: Your Name
pubDate: 2025-02-11
categories: [HFNY]
---
```

**Required:**

| Field         | Description |
|---------------|-------------|
| `title`       | Display title of the doc. |
| `author`      | Your name (or team name). |
| `pubDate`     | Date written (YYYY-MM-DD). |
| `categories`  | One or more category names (strings). The site derives its category list from all docs, so use the same names as other docs in that category (e.g. from CHSR Wiki or existing docs). |

**Optional:**

| Field          | Description |
|----------------|-------------|
| `description`  | Short summary; shown in doc lists. |
| `codeLocation`| Where the related code lives (folder path or repo link). Developers use this to know where to write or find code. |

## 3. Write the content

Below the closing `---`, write your content in Markdown (headings, lists, code blocks, tables, etc.).

## 4. Where developers keep code

- Use the **`codeLocation`** field in frontmatter to point to the repo path or folder where the feature/code lives (e.g. `HFNY/Admin/MyPage.aspx` or a GitHub path).
- That way everyone knows where to find or add code for a given doc. Keep this updated when you move or add code.

## 5. Deploy

- **Local:** Run `npm run dev` to see the doc locally.
- **Production:** Open a PR, get it merged. The site (e.g. on Vercel) will rebuild and the new or updated doc will appear in the right category.

## Summary

1. **Clone** the [repo](https://github.com/Ishanpathak1/InternalDocs), create a branch (e.g. `doc-your-doc-name`).
2. Add or edit a `.md` file in **`src/content/docs/`** (that *is* the directory — no extra list to update).
3. Set **frontmatter**: `title`, `author`, `pubDate`, and `categories` (one or more of HFNY, Kinship, OCFS Prevention, PICHC, IT Dept Management).
4. Use **`codeLocation`** so developers know where the code lives.
5. **Open a PR** with a title like “Add doc: Your Doc Title”; after merge, the doc shows in the right category.
