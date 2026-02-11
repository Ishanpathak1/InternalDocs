---
title: Report Development SOP for New Developers
author: Ishan Pathak
pubDate: 2025-02-11
description: Standard operating procedure for building reports in the HFNY app — catalog XtraReports, standalone pages, QA reports, criteria, data access.
codeLocation: HFNY/Reports/XtraReports/Lists/rptCHEERSReport.cs
categories: ["HFNY"]
topic: Technical Docs For HFNY
---

# Report Development SOP for New Developers

- **Catalog-based XtraReport**: HFNY/Reports/XtraReports/Lists/rptCHEERSReport.cs
- **Catalog listing page**: HFNY/Reports/ReportCatalog.aspx
- **Standalone report page**: HFNY/Reports/Demographics.aspx
- **QA summary report**: HFNY/Reports/QA/QASummary.aspx

---

## 1. Report Types Overview

HFNY has three main report patterns:

| Type                       | Master Page    | Location                                   | Use Case                                               |
| -------------------------- | -------------- | ------------------------------------------ | ------------------------------------------------------ |
| **Catalog XtraReport**     | Reports.Master | Reports/XtraReports/                       | DevExpress reports shown in Report Catalog (PDF/print) |
| **Standalone report page** | Site.Master    | Reports/, Reports/QA/                      | Custom UI + GridView or Excel export                   |
| **Link/Export**            | -              | Catalog entry with (link) or (expt) prefix | Redirect or Excel download                             |

---

## 2. Reports Folder Structure

```
HFNY/Reports/
├── ReportCatalog.aspx         -- Main catalog list (Repeater + ASPxWebDocumentViewer)
├── ReportCatalogViewer.aspx   -- Viewer page (query: ?reportname=CHEERSReport)
├── Demographics.aspx          -- Standalone report (Site.Master)
├── SupervisionExport.aspx     -- Standalone Excel export
├── ReportHelper.cs            -- Quarters, regions, worker lists
├── ReportPayload.cs           -- Criteria passed to IReportBase reports
├── QA/
│   ├── QASummary.aspx         -- QA summary grid
│   └── QADetails.aspx         -- QA detail view
└── XtraReports/
    ├── ReportTemplates/       -- ReportBase, IReportBase, QuarterlyReportBase
    ├── Lists/                 -- rptCHEERSReport, rptFAWMonthlyReport, etc.
    ├── Analysis/              -- Analysis reports
    ├── Quarterlies/           -- Quarterly reports
    ├── Ticklers/              -- Tickler reports
    ├── Training/              -- Training reports
    ├── DataRetrieval/         -- Typed datasets (*.xsd)
    └── Documentation/         -- PDF docs (ReportClass.pdf)
```

---

## 3. Catalog-Based XtraReport (Standard Pattern)

### 3.1 IReportBase and Report Classes

All catalog reports must:

1. Implement `IReportBase` with `void RunReport(ReportPayload payload)`
2. Inherit from `ReportBase` (or `QuarterlyReportBase`, `CredentialReportBase`)
3. Be named `rpt{ReportClass}.cs` where ReportClass is the value in `codeReportCatalog.ReportClass`

Example from rptCHEERSReport:

```csharp
public partial class rptCHEERSReport : HFNY.ReportBase, IReportBase
{
    public void RunReport(ReportPayload payload)
    {
        rptCHEERSReport report = new rptCHEERSReport();
        report.ParamProgramFK.Value = payload.ProgramFks ?? ...;
        report.ParamStartDate.Value = payload.StartDate;
        report.ParamEndDate.Value = payload.EndDate;
        // ... set parameters from payload
        report.ProgramName.Value = payload.ProgramNames ?? Utilities.GetProgram();
        report.PrintDate.Value = DateTime.Now.ToShortDateString();
        report.ReportName.Value = "CHEERS Check-In History Report";
        report.DisplayName = Utilities.GenerateCustomReportName(...);
        payload.Viewer.OpenReport(report);
    }
}
```

### 3.2 Report Invocation Flow

The master page (`Reports.Master.cs`) uses `hfReportToRun.Value` (set by JavaScript when user clicks a catalog row) to resolve the report type:

```csharp
Type rpt = Type.GetType("HFNY.rpt" + strReportName);
IReportBase report = (IReportBase)(rpt.GetConstructor(Type.EmptyTypes).Invoke(new object[] { }));
report.RunReport(reportPayload);
```

### 3.3 ReportPayload

`ReportPayload` carries all criteria from Reports.Master: dates, program FKs, worker/supervisor/site filters, case filters, tickler options, etc. Use the properties needed for your report and ignore the rest.

### 3.4 Criteria Options and Defaults

Report behavior is driven by `codeReportCatalog`:

- **ReportClass**: Class name without `rpt` prefix (e.g. `CHEERSReport`)
- **CriteriaOptions**: Comma-separated codes (e.g. `SED,WKL,SIT,CFI`) — controls which criteria divs show in Reports.Master
- **Defaults**: Date default code (e.g. `SD03`, `LFQ`) — used by ReportCatalogCommon.js to prefill dates

Common CriteriaOptions: `SED` (start/end dates), `QTR` (quarters), `WKL` (worker/supervisor/PC1), `SIT` (sites), `CFI` (case filters), `PIP` (performance indicator period). Full list is in Admin/ReportCatalogDetails.aspx `ddlCriteriaOptions`.

---

## 4. Adding a New Catalog Report (Step-by-Step)

1. **Create the report class**
   - Add `rptYourReport.cs`, `rptYourReport.Designer.cs`, `rptYourReport.resx` under `Reports/XtraReports/Lists/` (or Analysis, Quarterlies, etc.)
   - Inherit from `ReportBase` (or appropriate base) and implement `IReportBase`
   - Design layout in Visual Studio DevExpress Report Designer (bands, labels, data bindings)
2. **Implement RunReport**
   - Extract needed values from `payload` (ProgramFks, StartDate, EndDate, WorkerFK, etc.)
   - Set report parameters (e.g. `ParamProgramFK`, `ParamStartDate`)
   - Set display labels (ProgramName, ReportName, PrintDate, CohortDescription)
   - Call `payload.Viewer.OpenReport(report)`
3. **Register in catalog**
   - Insert row in `codeReportCatalog` (or use Admin/ReportCatalogDetails.aspx)
   - Set ReportClass = `YourReport` (no `rpt` prefix)
   - Set CriteriaOptions (e.g. `SED,WKL`)
   - Set Defaults (e.g. `SD03`)
4. **Documentation**
   - Place PDF in `Reports/XtraReports/Documentation/YourReport.pdf`
5. **Data**
   - Use SqlDataSource in designer bound to stored proc, or fill datasets in code before `OpenReport`

---

## 5. Standalone Report Pages (Demographics, SupervisionExport)

These use `Site.Master` and follow form patterns from the Form SOP:

- **Master**: `Site.Master`
- **Structure**: `panel panel-primary`, `panel-body` with filters (form-control), GridView or export button
- **Code-behind**: Load data in `Page_Load` (!IsPostBack), handle button click for run/export
- **Data**: EF, Enterprise Library stored procs, or direct SqlConnection

Example layout (Demographics.aspx): left column filters + Run Report / Export, right column GridView.

---

## 6. QA Reports (QASummary, QADetails)

- Use `Site.Master`
- GridView bound to `rspQAReport*` stored procedures
- Print-friendly mode via `?printerfriendly=1` (hide nav, show Print/Close)
- Links from summary to detail (`QADetails.aspx?reportId=...`)

---

## 7. Master Page Differences

| Page Type      | Master         | ContentPlaceHolders                                       |
| -------------- | -------------- | --------------------------------------------------------- |
| Catalog/Viewer | Reports.Master | HeadContent, ScriptContent, ContentPlaceHolder1           |
| Standalone/QA  | Site.Master    | HeadContent, FormName, ContentPlaceHolder1, ScriptContent |

Reports.Master nests inside Site.Master and provides the criteria sidebar (`divCriteria`) and ASPxWebDocumentViewer integration.

---

## 8. Report Summary Patterns (from Reporting summary methods.md)

- **Precomputed in code-behind**: Calculate totals in report class, assign to XRLabels in ReportHeader
- **Header context**: ProgramName, ReportName, PrintDate, CohortDescription, SiteName, CaseFilters
- **Subreports**: Top-level report embeds subreports for summary sections
- **Custom summaries**: DevExpress SummaryReset / SummaryRowChanged / SummaryGetResult for ratios, time totals
- **Stored-proc summaries**: Report parameters drive dataset; layout shows aggregates

---

## 9. Special Report Types

- **(link)reportpath**: Redirects instead of running XtraReport (e.g. `(link)../QA/QASummary.aspx`)
- **(expt)ReportName**: Shows "Run Report" but triggers Excel export (`lbExcelExport_Click`) — e.g. AddressList, PersonProfile

---

## 10. How We Design Reports

- **Requirements**: Clarify with stakeholders what the report must show (metrics, filters, date ranges, audience). Decide if it belongs in the catalog (XtraReport), is a standalone page (Demographics-style), or is a link/export.
- **Reference existing reports**: Use **rptCHEERSReport** for catalog XtraReports (RunReport pattern, parameter binding); **Demographics.aspx** for standalone filter + grid + export; **QASummary.aspx** for summary/detail drill-down.
- **Criteria mapping**: For catalog reports, map requirements to CriteriaOptions (SED, QTR, WKL, etc.) and Defaults (SD03, LFQ). ReportCatalogDetails.aspx lists all options.
- **Layout**: For XtraReports, sketch bands (ReportHeader, Detail, GroupHeader, PageFooter) and data sources. ReportBase provides standard header (ProgramName, ReportName, PrintDate) and footer.
- **Consistency**: Reuse ReportBase/QuarterlyReportBase for header/footer; use same parameter naming (ParamProgramFK, ParamStartDate) so payload mapping is predictable.

---

## 11. Where and How We Write JavaScript (Reports)

### 11.1 Script Bundles and Loading

| Bundle                         | Scripts                                                          | Used By                          |
| ------------------------------ | ---------------------------------------------------------------- | -------------------------------- |
| `~/bundles/ReportCatalogPage` | ReportCatalogNew.js                                              | ReportCatalog.aspx (new catalog) |
| `~/bundles/OldReportCatalogPage` | ReportCatalog.js, ReportCatalogCommon.js, ReportCatalogViewer.js | Legacy catalog flow              |

- Bundles are registered in App_Start/BundleConfig.cs
- ReportCatalog.aspx.cs adds `~/bundles/ReportCatalogPage` to ScriptManager if not already present
- Reports.Master loads Site.Master's bundles (jQuery, Bootstrap, toast, cleave, etc.) and adds its own report-master-bundle

### 11.2 Where Report JavaScript Lives

- **ReportCatalog.js**: Report catalog page (DataTable init, filter/column label clicks, popovers, row click → navigate to ReportCatalogViewer)
- **ReportCatalogCommon.js**: Shared logic for criteria toggling (`ToggleCriteriaBoxes`, `CalculateDefaultDates`, `ToggleByWhom`, `ToggleBreakdown`), validation, `PersistCriteria`/`RestoreCriteria` via sessionStorage
- **ReportCatalogViewer.js**: Viewer page (restore criteria from sessionStorage, ToggleCriteriaBoxes, ByWhom/ServRefBreakdown handlers, `chkIncludeClosedCases` PC1ID toggle)
- **ReportCatalogNew.js**: New catalog page (consolidated criteria handlers, row click navigation, DataTable setup)

### 11.3 Patterns

- **jQuery with ASP.NET**: Use `jQuery('[ID$="controlId"]')` for server controls (avoids client ID changes)
- **sessionStorage**: Criteria and defaults passed catalog → viewer via `sessionStorage.criteria`, `sessionStorage.defaults` (JSON)
- **Row click flow**: Catalog row click → read ReportClass, CriteriaOptions, Defaults from table cells → store in sessionStorage → redirect to `ReportCatalogViewer.aspx?reportname={ReportClass}`
- **Criteria divs**: JavaScript shows/hides divs in Reports.Master based on CriteriaOptions (SED → divStartDate/divEndDate, WKL → divByWhom, etc.)
- **Validation**: Client-side validation before Run Report; `hfIsValid` hidden field set by JS
- **Toast notifications**: `showNotification(type, title, text, duration)` (from Site.Master) for no-data, errors

### 11.4 Page-Specific Inline Script

- ReportCatalog.aspx: ScriptContent is empty; all JS from bundles
- ReportCatalogViewer.aspx: ScriptContent has `init()` for Chrome print helper
- Standalone reports (Demographics): No report-specific JS; use form patterns from Form SOP
- QA reports (QASummary): ScriptContent for print-friendly mode (hide nav, Print/Close buttons)

---

## 12. C# Classes and Practices (Reports)

### 12.1 Report Class Structure

- **Partial classes**: All XtraReports are partial — `.cs` (logic + RunReport), `.Designer.cs` (generated layout), `.resx` (resources)
- **Inheritance**: `rpt* : ReportBase, IReportBase` (or `QuarterlyReportBase`, `CredentialReportBase`)
- **RunReport**: Create new instance, set parameters from payload, assign display labels, call `payload.Viewer.OpenReport(report)`
- **Do not modify Designer.cs manually** — use DevExpress Report Designer; changes will overwrite

### 12.2 Naming and Conventions

- Report class: `rpt{ReportClass}` (e.g. `rptCHEERSReport`)
- Parameters for stored procs: `Param{Name}` (e.g. `ParamProgramFK`, `ParamStartDate`)
- Display parameters: `ProgramName`, `ReportName`, `PrintDate`, `CohortDescription`, `SiteName`, `CaseFilters`
- Use `Utilities.GenerateCustomReportName()` for DisplayName when worker/supervisor filter applies

### 12.3 Code-Behind Patterns

**Standalone reports (Demographics):**

- `Page_Load`: If `!IsPostBack`, load filter data (e.g. programs). Use `Session["User"]` for current user.
- Button handlers: Validate (`Page.IsValid`), build DbCommand with stored proc, execute, bind to GridView
- Export: Build Excel (OfficeOpenXml or ClosedXML), write to Response, `Response.End()`

**Report catalog code-behind:**

- ReportCatalog.aspx.cs: Bind repeater from SqlDataSource; add script bundle; set `Master.reportViewer`
- ReportCatalogDetails.aspx.cs: Load `codeReportCatalog` by PK; use EF `HealthyFamiliesContext`; `Type.GetType("HFNY.rpt" + ReportClass)` to verify class exists

### 12.4 Data Access

- **XtraReports**: SqlDataSource in designer bound to stored proc with `Parameters`; or fill DataSet/DataTable in RunReport and assign to report's DataSource
- **Standalone**: Enterprise Library `GetStoredProcCommand`, `AddInParameter`, `ExecuteDataSet`; or EF for lookups
- **Model usage**: `Model.HVProgram.GetAllPrograms()`, `Model.State.GetAllStates()`, `Utilities.GetProgram()`, `Utilities.GetStateFK()`

### 12.5 ReportHelper and Utilities

- **ReportHelper**: `GetQuarters(ProgramFK)`, `getRawQuarterData`, `SetQuarterDDL`, `FillRegions(CheckBoxList)`
- **Utilities**: `GetProgram()`, `GetAppNameForReports()`, `GetStateFK()`, `FillPIPeriodList()`, `GenerateCustomReportName()`
- **ReportPayload**: Use existing properties; add new criteria only if Reports.Master and btnRunReport_Click are updated to populate them

---

## 13. Database and Configuration

- **codeReportCatalog**: Report metadata (ReportClass, CriteriaOptions, Defaults, ReportCategory, etc.)
- **spGetAllReports**: Returns catalog rows for ReportCatalog (includes ReportClass, CriteriaOptions, Defaults)
- **ReportHistory**: Written on Run Report to track usage
- Connection: `HFNY` connection string; stored procs in SQL Server

---

## 14. Checklist for a New Catalog Report

- Report class in correct XtraReports subfolder (Lists/Analysis/etc.)
- Implements `IReportBase`, inherits `ReportBase` (or Quarterly/Credential base)
- `RunReport` populates parameters and calls `payload.Viewer.OpenReport`
- `codeReportCatalog` row with correct ReportClass, CriteriaOptions, Defaults
- PDF in Documentation/ if documentation exists
- Test: Catalog row click shows correct criteria, Run Report displays report
- ReportBase sets system title via `lblSystemTitle_BeforePrint`; hide parameters via `ReportBase_ParametersRequestBeforeShow`

---

## 15. How We Test Reports

- **Manual testing**: Primary approach. Run app, open Report Catalog (or standalone page), select report/criteria, Run Report. Verify output, filters, export.
- **Catalog reports**: Test row click shows correct criteria divs; default dates apply; Run Report displays; role/program filtering if applicable.
- **Standalone reports**: Test filters, validation, grid bind, Excel export.
- **Checklist**: Can the report be opened? Do criteria load and apply? Does Run Report produce correct output? Do toasts appear for no-data/errors? Does ReportCatalogDetails class check pass?
