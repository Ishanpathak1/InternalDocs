---
title: Change Prenatal Case to Postnatal
author: dcacciotti
pubDate: 2019-03-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

Scripts to convert cases between prenatal and postnatal status. Run inside a transaction and verify before committing.

## Prenatal to Postnatal (TCID entered)

```sql
BEGIN TRANSACTION
declare @newDOB datetime = '[Put new DOB here]'
declare @newLevelDate datetime = '[Put new level date here]'
declare @HVCasePK int = [Put HVCasePK here]

--Update the TCDOB
update hvcase set tcdob = @newDOB, EDC = NULL where hvcasepk = @HVCasePK
update tcid set tcdob = @newDOB where hvcasefk = @HVCasePK

--Remove the prenatal level row
delete from HVLevel where hvlevelpk = [Put prenatal level row PK here]

--Update the level date
update caseprogram set currentleveldate = @newLevelDate where caseprogrampk = [Put CaseProgramPK here]
update HVLevel set levelassigndate = @newLevelDate where hvlevelpk = [Put Level 1 row PK here]

ROLLBACK
```

## Prenatal to Postnatal (No TCID)

```sql
BEGIN TRANSACTION;

DECLARE @PC1ID VARCHAR(13) = '[Put PC1ID here]';
DECLARE @newDOB DATETIME = '[Put new DOB here]';
DECLARE @newLevelDate DATETIME = '[Put new level date here.  Usually the intake date.]';
DECLARE @HVCasePK INT = (SELECT TOP (1) cp.HVCaseFK FROM dbo.CaseProgram cp WHERE cp.PC1ID = @PC1ID);

--Look for the prenatal level row
SELECT *
FROM dbo.HVLevel hl
WHERE hl.HVCaseFK = @HVCasePK

--Set the TCDOB
UPDATE dbo.HVCase
SET TCDOB = @newDOB,
    EDC = NULL
WHERE HVCasePK = @HVCasePK;

--Update the CaseProgram level date and the level FK
UPDATE dbo.CaseProgram
SET CurrentLevelDate = @newLevelDate, CurrentLevelFK = 14
WHERE PC1ID = @PC1ID;

--Change the prenatal level to Level 1
UPDATE dbo.HVLevel
SET LevelAssignDate = @newLevelDate, LevelFK = 14
WHERE HVLevelPK = [Put prenatal level PK here];

ROLLBACK;
```

## Postnatal to Prenatal (No TCID)

```sql
BEGIN TRANSACTION

DECLARE @newDOB datetime = '[Put new TCDOB here]'
declare @HVCasePK int = [Put HVCasePK here]
DECLARE @newLevelFK INT = (SELECT cl.codeLevelPK FROM dbo.codeLevel cl WHERE cl.ConstantName = 'LEVEL1_PRENATAL')

SELECT * FROM dbo.HVCase hc WHERE hc.HVCasePK = @HVCasePK
SELECT * FROM dbo.CaseProgram cp WHERE cp.HVCaseFK = @HVCasePK
SELECT * FROM dbo.HVLevel hl INNER JOIN dbo.codeLevel cl ON cl.codeLevelPK = hl.LevelFK WHERE hl.HVCaseFK = @HVCasePK

--Update the TCDOB
update hvcase set tcdob = NULL, EDC = @newDOB where HVCasePK = @HVCasePK

--Update the level
update HVLevel set LevelFK = @newLevelFK where hvlevelpk = [Put HVLevelPK here]
UPDATE dbo.CaseProgram SET CurrentLevelFK = @newLevelFK WHERE HVCaseFK = @HVCasePK

ROLLBACK
```