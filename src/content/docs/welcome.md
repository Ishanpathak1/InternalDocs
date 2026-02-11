---
title: Welcome to Internal Docs
description: Get started with the internal documentation site.
author: Internal Team
codeLocation: src/content/docs/
pubDate: 2025-02-11
---

# Welcome

This is the internal documentation site. Content is stored as Markdown in `src/content/docs/`.

- Add or edit `.md` files in the repo and open a PR; after merge, the site will show the new docs.
- Or use **Upload** on the Docs page (when logged in) to add a doc directly.

No database — everything is file-based.

## How to format your .md files

Use **frontmatter** at the top of the file so we can show author, date, and code location:

```yaml
---
title: Your Doc Title
author: Your Name          # Required
pubDate: 2025-02-11        # Date when written (required)
description: Short summary # Optional
codeLocation: repo/path    # Optional – path or link to code
---
```

Then write your content below the closing `---`.
