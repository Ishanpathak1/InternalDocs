---
title: Fixing Choices.js Duplicate Options in Dynamic ASP.NET WebForms Dropdowns
author: Ishan Pathak
pubDate: 2025-03-18
description: How to fix duplicate dropdown options when combining server-rendered ASP.NET ListBox items with client-side Choices.js dynamic repopulation, discovered during a legacy race data migration in the NewFRC application.
codeLocation: NewFRC/Controls/ChoicesDropdown.ascx, NewFRC/Registration.aspx
categories: ["Kinship"]
topic: Technical Docs For Kinship
---

# Fixing Choices.js Duplicate Options in Dynamic ASP.NET WebForms Dropdowns

When using Choices.js with ASP.NET WebForms, dynamically repopulated dropdowns can render duplicate `<option>` elements. This post documents the root cause, the debugging process, and the one-line fix that resolved it in the NewFRC Registration page.

---

## The Problem

### What Was Happening

The Registration page uses a two-level race dropdown system:

1. **RacePrimary** — top-level categories (White, Asian, Black or African American, etc.)
2. **RaceDetail** — subcategories that appear dynamically based on the primary selection (e.g., selecting "Black or African American" shows Caribbean, Haitian, Native African, etc.)

When editing an existing registration with `RaceList = '1'` (Black or African/American-Not Specified), the detail dropdown rendered "Black or African/American-Not Specified" **twice** — once as a selected pill and again as a selectable option in the list.

Inspecting the rendered HTML confirmed two `<option>` elements with the same value:

```html
<option value="1" selected="">Black or African/American-Not Specified</option>
<option value="1">Black or African/American-Not Specified</option>
```

### Why It Happens

The duplicate is caused by a three-step initialization sequence where the same value gets added to the Choices.js internal store twice:

**Step 1 — Server renders all options:**
`AddRaceDetailDynamicItems()` in `ChoicesDropdown.ascx.vb` pre-renders all 43 detail race options as `<option>` elements in the `<select>`. This is required so ASP.NET recognizes the values on postback.

**Step 2 — Choices.js captures the DOM:**
`new Choices(el, opts)` initializes and reads those 43 server-rendered `<option>` elements into its internal store. PK `1` is now in the Choices.js store.

**Step 3 — JavaScript dynamically repopulates:**
`UpdateRaceDetailDropdown()` runs via `setTimeout`, determines that category "101" (Black) is selected in the primary dropdown, and calls:

```javascript
window.raceDetailChoices.setChoices(merged, 'value', 'label', true);
```

The `true` parameter means "replace choices." It replaces the visible dropdown list with just the 5 Black subcategory items — but the original option element for PK `1` that was captured in Step 2 is not fully purged from the internal store. Then `setChoiceByValue(['1'])` selects the value, creating a second `<option>` element.

### The Core Issue

`setChoices(..., true)` in Choices.js replaces the visible choice list but does not fully clean the internal store of previously captured DOM options. When the same value appears in both the pre-captured store and the newly set choices, Choices.js renders it twice.

This is specific to the pattern of "pre-render server options for postback, then dynamically replace them via JavaScript" — a pattern common in ASP.NET WebForms but not anticipated by Choices.js.

---

## The Solution

### Core Fix

Add `clearStore()` before `setChoices()` to wipe the internal store clean. This ensures no ghost references from server-rendered options survive the dynamic repopulation.

In `Registration.aspx`, inside the `UpdateRaceDetailDropdown()` function:

```javascript
// Before (duplicate)
if (window.raceDetailChoices) {
    var preserveVals = window.raceDetailInitialValues || 
        (window.raceDetailChoices.getValue ? window.raceDetailChoices.getValue(true) : null);
    if (!Array.isArray(preserveVals)) 
        preserveVals = preserveVals ? [String(preserveVals)] : [];
    window.raceDetailChoices.setChoices(merged, 'value', 'label', true);
    // ...
}

// After (fixed)
if (window.raceDetailChoices) {
    var preserveVals = window.raceDetailInitialValues || 
        (window.raceDetailChoices.getValue ? window.raceDetailChoices.getValue(true) : null);
    if (!Array.isArray(preserveVals)) 
        preserveVals = preserveVals ? [String(preserveVals)] : [];
    window.raceDetailChoices.clearStore();  // <-- one-line fix
    window.raceDetailChoices.setChoices(merged, 'value', 'label', true);
    // ...
}
```

### What `clearStore()` Does

`clearStore()` resets the Choices.js internal item and choice collections to empty. After calling it, `setChoices()` starts from a clean slate, so each value only exists once. The subsequent `setChoiceByValue(valid)` call then correctly selects the value without creating a duplicate.

---

## How We Found It

### Debugging Steps

1. **Visual inspection** — noticed the same label appearing twice in the dropdown on edit
2. **DOM inspection** — confirmed two `<option value="1">` elements in the rendered `<select>`
3. **Console verification** — ran diagnostics in the browser console:

```javascript
// Check what Choices.js thinks is selected
console.log(window.raceDetailChoices.getValue(true));
// → ['1']

// Check actual DOM options
var el = document.getElementById('ctl00_MainContent_ucRaceDetail_ddlChoices');
var opts = [];
for (var i = 0; i < el.options.length; i++) {
    opts.push(el.options[i].value + ' - ' + el.options[i].selected);
}
console.log(opts);
// → ['1 - false', '1 - true', '19 - false', '20 - false', '21 - false', '22 - false']
```

4. **Isolation test** — ran `clearStore()` manually in the console, then repopulated:

```javascript
window.raceDetailChoices.clearStore();
var merged = raceCategoryChoices['101'];
window.raceDetailChoices.setChoices(merged, 'value', 'label', true);
window.raceDetailChoices.setChoiceByValue(['1']);
```

After `clearStore()`, the DOM showed only one `<option value="1">`. That confirmed the fix.

### What Did NOT Work

- **Removing server-rendered options before `new Choices()`** — Choices.js had already captured them during construction
- **Clearing DOM `<option>` elements before init** — the internal store is separate from the DOM after initialization
- **Skipping `setChoiceByValue` for the dynamic dropdown** — the duplicate came from the store, not from the selection call

---

## Context: Why the Dropdown Was Dynamic

This bug surfaced during a larger migration project: moving legacy race data from individual bit columns (`RaceBlack`, `RaceWhite`, `RaceAsian`, etc.) to a normalized `RaceList` column backed by a `dbo.listRace` lookup table.

Before it was hardcoded all race values in the VB.NET frontend instead of reading from `listRace`, and the hardcoded values didn't match the lookup table PKs. Fixing this required:

1. Migrating ~25,000 rows of legacy bit-flag data to comma-separated `listRace` PKs
2. Adding missing rows to `listRace` (Other, Unknown, Race info not provided)
3. Refactoring `ChoicesDropdown.ascx.vb` to load race options from the DB
4. Updating `Registration.aspx.vb` to use correct `listRace` PKs in all business logic
5. Fixing this Choices.js duplicate bug — which only appeared after the above changes made the dynamic detail dropdown functional with real data

---

## Best Practices

1. **Always `clearStore()` before `setChoices()` when repopulating** — if your Choices.js instance was initialized with server-rendered options and you later replace them dynamically, call `clearStore()` first to prevent ghost duplicates.

2. **Verify with DOM inspection, not just visual** — the duplicate may look like a Choices.js rendering quirk, but checking `<option>` elements in the inspector confirms whether it's a data issue or a display issue.

3. **Console-test your fix before code changes** — running the fix in the browser console (`clearStore()` → `setChoices()` → `setChoiceByValue()`) gives immediate confirmation without a rebuild cycle.

4. **Server-side items are still needed** — don't remove `AddRaceDetailDynamicItems()`. ASP.NET WebForms requires the `<option>` elements to exist server-side for postback validation. The fix is client-side only.

---

## References

- [Choices.js API: clearStore()](https://github.com/Choices-js/Choices#clearstore)
- [Choices.js API: setChoices()](https://github.com/Choices-js/Choices#setchoiceschoices-value-label-replacechoices)
- [ASP.NET ListBox postback validation](https://learn.microsoft.com/en-us/dotnet/api/system.web.ui.webcontrols.listbox)
