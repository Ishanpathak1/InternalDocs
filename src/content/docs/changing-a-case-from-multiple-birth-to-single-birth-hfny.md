---
title: Changing a case from multiple birth to single birth (HFNY)
author: bsimmons
pubDate: 2019-04-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

To change a case from multiple birth to single birth, run the script below with the proper values.

> **Note:** Depending on the level history you may have to delete a level.

```sql
DECLARE @pc1id VARCHAR(13) = ''
DECLARE @hvcasefk INT = 0

SET @hvcasefk = (SELECT TOP(1) cp.HVCaseFK FROM dbo.CaseProgram cp WHERE cp.PC1ID = @pc1id ORDER BY cp.CaseStartDate DESC)
SELECT * FROM dbo.CaseProgram cp WHERE cp.PC1ID = @pc1id
SELECT * FROM dbo.HVCase hc INNER JOIN dbo.TCID t ON t.HVCaseFK = hc.HVCasePK WHERE hc.HVCasePK = @hvcasefk
SELECT * FROM dbo.codeLevel cl
SELECT * FROM dbo.HVLevel hl WHERE hl.HVCaseFK = @hvcasefk

--UPDATE dbo.HVCase SET TCNumber = 1, CaseProgress = 11.0, HVCaseEditDate = GETDATE(), HVCaseEditor = 'bsimmons' WHERE HVCasePK = @hvcasefk
--UPDATE dbo.TCID SET MultipleBirth = 0, TCIDEditDate = GETDATE(), TCIDEditor = 'bsimmons' WHERE TCIDPK = 
--UPDATE dbo.CaseProgram SET CurrentLevelFK = 14, CaseProgramEditor = 'bsimmons', CaseProgramEditDate = GETDATE() WHERE CaseProgramPK = 
--UPDATE dbo.HVLevel SET LevelFK = 14, HVLevelEditor = 'bsimmons', HVLevelEditDate = GETDATE() WHERE HVLevelPK =
```