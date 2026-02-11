---
title: Welcome to Internal Docs
description: Get started with the internal documentation site.
author: Internal Team
codeLocation: src/content/docs/
pubDate: 2025-02-11
categories: ["HFNY", "Kinship", "OCFS", "PICHC"]
---

# Welcome

This is the **CHSR** documentation site. Docs are organized into four categories: **HFNY**, **Kinship**, **OCFS**, and **PICHC**. The Welcome doc appears in all categories.

Content is stored as Markdown in **`src/content/docs/`**. That folder *is* the docs directory — add or edit `.md` files there; there is no separate directory list to update. After you push, the site rebuilds and new docs show up in the right category.

- Add or edit `.md` files in `src/content/docs/` and push (or open a PR). The build picks up all files in that folder.
- Each doc must have **frontmatter** with at least `title`, `author`, `pubDate`, and **`categories`** (one or more of HFNY, Kinship, OCFS, PICHC).
- Use **`codeLocation`** in frontmatter so developers know where the related code lives (folder or repo path).

For step-by-step instructions, see **[How to add a doc](/docs/how-to-add-a-doc)**.
