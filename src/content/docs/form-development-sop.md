---
title: Form Development SOP for New Developers
author: Ishan Pathak
pubDate: 2025-02-11
description: Standard operating procedure for building forms in the HFNY app — UI patterns, design, data access, testing, step-by-step form creation, JavaScript, landing pages, and database setup.
codeLocation: HFNY/Admin/DeletedDataDashboard.aspx
categories: ["HFNY"]
topic: Technical Docs For HFNY
---

# Form Development SOP for New Developers

## Table of Contents

- [1. Page structure and master page](#1-page-structure-and-master-page)
- [2. Form panel layout (standard "form" look)](#2-form-panel-layout-standard-form-look)
- [3. Buttons – CSS classes and placement](#3-buttons--css-classes-and-placement)
- [4. Toast notifications (postback feedback)](#4-toast-notifications-postback-feedback)
- [5. Inline alerts (static or server-toggled messages)](#5-inline-alerts-static-or-server-toggled-messages)
- [6. Data tables (GridView + DataTables)](#6-data-tables-gridview-datatables)
- [7. Modals](#7-modals)
- [8. Colors and utility classes (reference)](#8-colors-and-utility-classes-reference)
- [9. Common practices summary](#9-common-practices-summary)
- [10. Design (how we design)](#10-design-how-we-design)
- [11. How we get data](#11-how-we-get-data)
- [12. How we test](#12-how-we-test)
- [13. Step-by-step: creating a new form](#13-step-by-step-creating-a-new-form)
- [14. Where and how we write JavaScript](#14-where-and-how-we-write-javascript)
- [15. How to create a landing page](#15-how-to-create-a-landing-page)
- [16. Database setup (SSMS and frontend use)](#16-database-setup-ssms-and-frontend-use)

---

## 1. Page structure and master page

- **Master page**: All forms use `MasterPageFile="~/MasterPages/Site.Master"`.
- **Content placeholders** (in order):
  - `HeadContent` – page-specific CSS/scripts in `<head>`
  - `FormName` – optional; page title shown in the master's header (styled by `.form-title` in Content/style2.css: center, 16px, bold, margin 10px)
  - `ContentPlaceHolder1` – main body
  - `ScriptContent` – page-specific JavaScript (e.g. DataTable init, modal handlers)
- **Body wrapper**: Wrap main content in `<div class="container">` (or rely on master's `container-fluid` for full width).

---

## 2. Form panel layout (standard "form" look)

Pattern used in DeletedDataDashboard and other Admin/Pages:

```html
<div class="panel panel-primary form-panel">
    <div class="panel-heading">
        <span class="panel-title">[Page Title]</span>
        <div class="clearfix"></div>
    </div>
    <div class="panel-body">
        <!-- filters, grid, form fields -->
    </div>
    <div class="panel-footer">
        <!-- Cancel left; Submit/primary right -->
    </div>
</div>
```

- **Panel classes**:
  - `panel panel-primary` – main container (Bootstrap primary border/header).
  - `form-panel` – custom background `#f2f2f2` (Content/customCSSClasses.css).
- **Optional inner panels**: Use `panel panel-info` for filter/context blocks, or nested `panel panel-primary` for the data area (e.g. grid).
- **Custom panel variants** (customCSSClasses): `custom-panel-success`, `custom-panel-warning`, `custom-panel-danger`, `custom-panel-secondary` for different header/state colors.

---

## 3. Buttons – CSS classes and placement

**Standard classes (Bootstrap + project convention):**

| Purpose                 | CSS class                     | Notes                                                                               |
| ----------------------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| Cancel / back           | `btn btn-default`             | First in footer; use `<a href="...">` or LinkButton with `CausesValidation="false"`  |
| Submit / primary action | `btn btn-primary`             | Save, Restore, Confirm, etc.                                                        |
| Delete / destructive    | `btn btn-danger`              | Use for delete actions                                                              |
| Secondary / info        | `btn btn-info`                | e.g. "Reinstate", "Unlock"                                                          |
| Small (grid/modal)      | `btn btn-sm`                  | e.g. `btn btn-default btn-sm`                                                       |
| Header actions         | `btn btn-default pull-right`   | Add, Edit, Print in panel-heading                                                   |

**Icons:** Prefer Glyphicons with `&nbsp;` before text, e.g.:

- Cancel: `<span class="glyphicon glyphicon-remove"></span>&nbsp;Cancel`
- Save/Submit: `<span class="glyphicon glyphicon-save"></span>&nbsp;Save` or `glyphicon-floppy-disk`
- Restore: `<span class="glyphicon glyphicon-repeat"></span>&nbsp;Restore`

**Footer order:** Cancel on the left, Submit (or primary action) on the right. Submit can use `pull-right` when both are in the same footer. Example (DeletedDataDashboard):

```html
<div class="panel-footer">
    <a href="AdministrationHome.aspx" class="btn btn-default">
        <span class="glyphicon glyphicon-remove"></span>&nbsp;Cancel
    </a>
</div>
```

For forms with both Cancel and Submit (e.g. Admin/AddPIExemption.aspx, Admin/ReportCatalogDetails.aspx): Cancel first, Submit second; Submit often `btn btn-primary` with `pull-right` or placed after Cancel.

---

## 4. Toast notifications (postback feedback)

- **Mechanism**: Session-based. Code-behind adds a `Notification` to session; master page's `PreRender` calls `NotificationsSys.DisplayNotifications()`; Site.Master JavaScript reads hidden fields and calls `showNotification(type, title, text, duration)` (jQuery toast plugin).
- **Code-behind pattern** (BusinessObjects/Notification.cs, Modules/Utilities.cs constants):

```csharp
NotificationsSystem.SendNotificationToSession(new Notification
{
    NotificationTitle = "Form Restored",
    NotificationType = Utilities.NotificationSuccess,  // or NotificationError, NotificationWarning, NotificationInfo
    NotificationText = "Form restored successfully!",
    NotificationDuration = 5000
});
```

- **Types and colors** (from Site.Master `showNotification()`):
  - **success**: `#5cb85c`
  - **error**: `#d9534f`
  - **warning**: `#f0ad4e`
  - **info**: `#5bc0de`
- **Durations**: 5000 ms typical; 15000 for long error messages.
- Do not invent new type strings; use `Utilities.NotificationSuccess`, `Utilities.NotificationError`, `Utilities.NotificationWarning`, `Utilities.NotificationInfo`.

---

## 5. Inline alerts (static or server-toggled messages)

For messages that are part of the page content (not toasts):

- **Classes**: `alert alert-success`, `alert alert-info`, `alert alert-warning`, `alert alert-danger`.
- **Thin variant**: `alert-thin` (customCSSClasses.css) for compact single-line messages.
- **Role**: Add `role="alert"` for accessibility where appropriate.
- **Usage**: EmptyDataTemplate, filter info, validation/error blocks (e.g. DeletedDataDashboard EmptyDataTemplate, TrainingMaterials, WorkerForm).

---

## 6. Data tables (GridView + DataTables)

- **GridView**: `CssClass="table data-display"` and `GridLines="None"`. Optional: `table-hover`, `table-striped`, `table-condensed` for non–DataTable styling when not initializing with jQuery.
- **DataTable initialization** (in `ScriptContent`): Target `.data-display`; check grid is visible and has rows; prepend `<thead>` from first row if needed; then call `.DataTable({ ... })`. Example options used in the project:
  - `pageLength: 10`, `lengthMenu: [10, 25, 50, 100]`
  - `stateSave: true`, `stateDuration: 60`
  - `responsive: { details: { type: 'column' } }`
  - `language.emptyTable`, `language.searchPlaceholder`
  - `columnDefs` for non-sortable action column and responsive priority
- **UpdatePanel**: Re-run the DataTable init in `Sys.WebForms.PageRequestManager.getInstance().add_endRequest(...)` so it works after partial postbacks.
- **Empty state**: Use `<EmptyDataTemplate>` with `<div class="alert alert-info">` and clear copy (e.g. "No deleted forms found. Select a form type from the dropdown above.").

---

## 7. Modals

- **Structure**: `modal fade` → `modal-dialog` → `modal-content` → `modal-header` (with `modal-title` and close button) → `modal-body` → `modal-footer`.
- **Buttons**:
  - Close/Cancel: `class="btn btn-default" data-dismiss="modal"` (and optionally glyphicon-remove).
  - Confirm/Primary: `class="btn btn-primary"` (e.g. `asp:LinkButton` for postback or `button` for client-only).
- **Close button in header**: `<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`.

---

## 8. Colors and utility classes (reference)

- **Toast/notification colors**: See section 4 (success/error/warning/info hex values).
- **Custom panel/table** (customCSSClasses): `custom-panel-success` (#28a745), `custom-panel-warning` (#e3ae0e), `custom-panel-danger` (#dc3545); `td-warning` (#e3ae0e), `td-danger` (#c42f3e); `text-danger` (#dc3545); `.green` / `.green-text`, `.red` / `.red-text`.
- **Spacing**: `margin-top-10`, `margin-bottom-10`, `margin-right-5`, `margin-left-5`, `padding-5`, etc. (customCSSClasses).
- **Form controls**: Use `form-control` for inputs/dropdowns; `form-group` for label + control grouping.

---

## 9. Common practices summary

- **Cancel**: Always provide a way to leave without submitting (link back to parent or Cancel button). Use `btn btn-default`, left side of footer.
- **Submit**: Primary action with `btn btn-primary`, often with ValidationGroup and OnClick. Place after Cancel; optional `pull-right`.
- **Validation**: Use `ValidationGroup` on submit buttons and validators; set `CausesValidation="false"` on Cancel.
- **Hidden fields**: Use `<asp:HiddenField>` for IDs/keys used by JavaScript and postback (e.g. delete PK, form type).
- **Delete in grid**: Use pattern `data-pk`, `data-hf` (hidden field ID suffix), `data-target` (modal selector); master page already wires `.delete-gridview` to set hidden field and show modal.
- **Confirmation for destructive actions**: Use a modal with clear message; Cancel = `btn btn-default` dismiss; Confirm = `btn btn-primary` or `btn btn-danger` as appropriate.

---

## 10. Design (how we design)

- **Requirements**: Clarify with stakeholders what the form must do (fields, filters, actions, who can see it). Decide if it is a new form, a list/dashboard, or an add/edit detail page.
- **Reference existing pages**: Use **DeletedDataDashboard.aspx** for list + filters + grid + modal confirm; use **AdministrationHome.aspx** for landing pages; use **AddPIExemption.aspx** or **ReportCatalogDetails.aspx** for form-with-Submit/Cancel.
- **Wireframes/sketches** (optional): For complex flows, sketch layout (filters, table, buttons) so markup and placeholders match.
- **Consistency**: Reuse the panel structure, button classes, and patterns in this SOP so the new form looks and behaves like the rest of the app.

---

## 11. How we get data

The app uses two main data patterns (see TechincalDocumentation.md §7):

- **Entity Framework (newer forms)**
  - **Location**: HFNY/Model/EntityFramework/ — `HealthyFamiliesContext`, entities (e.g. `HVLogDeleted`, `Worker`), and HealthyFamiliesModel.edmx.
  - **Usage**: In code-behind, create a `Model.EntityFramework.HealthyFamiliesContext` (or use existing pattern), write LINQ queries, then either bind entities to controls or build a `DataTable` and bind to a GridView.
  - **Example**: DeletedDataDashboard.aspx.cs — `GetDeletedHVLogs()`, `GetDeletedSupervisions()`, etc. use `HealthyFamiliesContext` and LINQ, then fill a `DataTable` and set `gvDeletedForms.DataSource = dt; gvDeletedForms.DataBind();`.

- **Enterprise Library + stored procedures (legacy)**
  - **Location**: HFNY/BusinessObjects/ — classes call `GetStoredProcCommand("spName")` and execute via Enterprise Library. Data often maps to BusinessEntities (e.g. `beWorker`).
  - **Usage**: When a feature already has a BusinessObject and stored proc, call that from code-behind and bind the returned data to the UI.

- **Typical flow in code-behind**
  - **Page_Load**: If `!IsPostBack`, call a method that loads data (e.g. `LoadAllDeletedForms()`) and binds to GridView/DropDownList.
  - **Events**: Dropdown `SelectedIndexChanged`, button `Click`, etc. call server methods that (optionally) reload data and rebind, then show a toast via `NotificationsSystem.SendNotificationToSession(...)`.

---

## 12. How we test

- **Manual testing**: Primary approach. Run the app (e.g. F5 or deploy to test env), log in with a role that has access, exercise the form (load, filter, submit, cancel, validation, toasts). Test with different roles if the page is role-restricted.
- **Unit tests**: The main project references `Microsoft.VisualStudio.QualityTools.UnitTestFramework` and has a Testing folder; automated unit tests are not consistently present. New developers can add unit tests for BusinessObjects or utilities if the team adopts that.
- **Checklist for a new form**: Can the page be opened? Do filters/grid load? Do Cancel and Submit behave correctly? Do toasts appear after success/error? Does the DataTable (if used) sort/search and re-init after postback? Are validators and ValidationGroup correct?

---

## 13. Step-by-step: creating a new form

1. **Create the page files**
   - Add `YourPage.aspx` under the right folder (e.g. `HFNY/Admin/` or `HFNY/Pages/`).
   - Set `MasterPageFile="~/MasterPages/Site.Master"` and fill the four content placeholders (HeadContent, FormName, ContentPlaceHolder1, ScriptContent).
   - Add `YourPage.aspx.cs` (and optionally `YourPage.aspx.designer.cs`). Inherit from `System.Web.UI.Page` and use the same namespace as the folder (e.g. `HFNY.Admin`).

2. **Markup (ContentPlaceHolder1)**
   - Wrap content in `<div class="container">`.
   - Use the standard panel: `panel panel-primary form-panel`, with `panel-heading` (title), `panel-body` (filters + grid or form fields), and `panel-footer` (Cancel, then Submit if needed).
   - Add controls (GridView with `CssClass="table data-display"` if using DataTables, DropDownList with `CssClass="form-control"`, HiddenFields for keys, etc.).
   - If you need a confirmation modal, add a `modal fade` block (see §7).

3. **Code-behind**
   - In `Page_Load`, if `!IsPostBack`, call a method to load data and bind (e.g. to GridView or DropDownList).
   - Implement event handlers (e.g. `ddlFormType_SelectedIndexChanged`, `btnConfirmRestore_Click`). Load/save using EF or BusinessObjects, then rebind and/or `SendNotificationToSession`.
   - Use `Utilities.NotificationSuccess` / `NotificationError` etc. and consistent durations (e.g. 5000 ms).

4. **JavaScript (ScriptContent)**
   - If the page has a DataTable, add a function that initializes `.data-display` (see §6) and call it on `jQuery(document).ready`. If the page uses UpdatePanel, register the same function in `Sys.WebForms.PageRequestManager.getInstance().add_endRequest(...)`.
   - Add any modal or button handlers (e.g. set hidden fields, show modal) in the same script block.

5. **Add to navigation**
   - **Landing page**: If the form is under Settings/Admin, add a link on AdministrationHome.aspx in the right section (e.g. Administration) and RoleGroup: `<a href="../Admin/YourPage.aspx" data-content="Description">Your Page Title</a>`.
   - **Top-level menu**: If it should appear in the main nav, add a node in Web.sitemap with the correct `url` and `roles`.

6. **Authorization**
   - Ensure the page is only reachable by allowed roles (same as other Admin pages, or add `<location>` in Web.config if needed). AdministrationHome uses `asp:LoginView` and RoleGroups to show/hide sections.

7. **Test**
   - Follow §12: manual test load, filters, submit, cancel, toasts, and (if applicable) DataTable behavior after postback.

---

## 14. Where and how we write JavaScript

- **Page-specific inline (most common)**
  - Put script in the **ScriptContent** placeholder of the .aspx page. The master page renders this after the bundled scripts (jQuery, Bootstrap, DataTables, etc.).
  - Use it for: DataTable initialization, modal open/close, setting HiddenFields from grid buttons, and other logic that only that page needs.
  - Example: DeletedDataDashboard.aspx — `ScriptContent` contains `initializeDeletedDataDashboardTable()`, click handler for `.btnRestore`, and `document.ready` (plus `PageRequestManager.add_endRequest` for postback).

- **Shared / site-wide**
  - Scripts used on many pages are in HFNY/Scripts/ and included via App_Start/BundleConfig.cs. The master page loads `~/bundles/SiteSpecific` (jquery.toast, bootbox, cleave, etc.).
  - Global helpers (e.g. `showNotification`) are defined in Site.Master script block.

- **Page-specific .js file**
  - For large or reusable page logic, add a new .js file under `Scripts/` (e.g. `YourFeature.js`), register a new bundle in BundleConfig (e.g. `bundles/YourFeaturePage`), and reference that bundle only on the page that needs it (e.g. via ScriptManager or an extra script reference in HeadContent). Many pages instead keep everything in ScriptContent for simplicity.

- **UpdatePanel / partial postback**
  - After a partial postback, the DOM is replaced; any jQuery plugins (e.g. DataTables) must be re-initialized. Use `Sys.WebForms.PageRequestManager.getInstance().add_endRequest(function () { ... })` and call the same init function (e.g. `initializeDeletedDataDashboardTable()`).
  - Use event delegation (e.g. `jQuery(".data-display").on("click", ".btnRestore", ...)`) so that dynamically added rows still work after rebind.

---

## 15. How to create a landing page

- **Pattern**: Use **AdministrationHome.aspx** as the template. A landing page is a single page with one or more **sections** (e.g. "Administration", "Program Management", "Self-Service"). Each section is a `panel panel-primary` with `panel-heading` (title) and `panel-body` containing **links** to child pages.
- **Markup**:
  - `<div class="panel panel-primary">`
  - `<div class="panel-heading"><h4 class="panel-title">Section Name</h4></div>`
  - `<div class="panel-body">`
  - Multiple `<a href=".../ChildPage.aspx" data-content="Tooltip">Display Text</a>`
  - Optional: add `list-group-item` class to links (AdministrationHome does this via jQuery).
- **Role-based visibility**: Use `<asp:LoginView>` and `<RoleGroups>` so only certain roles see certain sections (e.g. Admin sees "User Administration", "Restore Deleted Forms", etc.). Add new links inside the appropriate RoleGroup.
- **Adding a new child link**: Find the right panel and RoleGroup on AdministrationHome (or your landing page), then add a line: `<a href="../Admin/YourNewPage.aspx" data-content="Short description">Your New Page</a>`. No Web.sitemap change needed unless the page should also appear in the top-level menu.

---

## 16. Database setup (SSMS and frontend use)

When a new form needs **new or changed database objects**:

- **Connection configuration**
  - Connection strings live in **connections.config** (or environment-specific config). The default database is typically named **HFNY** (see TechincalDocumentation §4–5). Do not commit real connection strings; use config transforms or externalized config per environment.

- **Option A: New or changed tables (Entity Framework)**
  - Create or alter tables in **SQL Server Management Studio (SSMS)** (or run a .sql script in the project/repo if the team uses one).
  - In Visual Studio, update the **EF model**: open HFNY/Model/EntityFramework/HealthyFamiliesModel.edmx, right-click → "Update Model from Database", and add/refresh the tables. This regenerates entity classes under Model/EntityFramework.
  - In code-behind (or a BusinessObject), use `HealthyFamiliesContext` and the new entities/DbSets to query and persist. No stored proc required for simple CRUD if using EF.

- **Option B: Stored procedures (Enterprise Library)**
  - Create or alter stored procedures in SSMS (or via a .sql script).
  - In BusinessObjects (or rarely in code-behind), call `db.GetStoredProcCommand("YourSpName")`, add parameters, execute, and map results to entities or a DataTable.
  - Use this when the feature already follows the BusinessObject + stored-proc pattern or when complex logic is kept in the database.

- **Summary for new developers**
  - **New table, simple CRUD**: Create table in SSMS → Update EF model from database → use `HealthyFamiliesContext` and LINQ in the new page.
  - **New stored proc**: Create proc in SSMS → call it from a BusinessObject or code-behind via Enterprise Library.
  - **Existing tables**: Use existing EF entities or BusinessObjects; no SSMS change unless you add columns or procs.
