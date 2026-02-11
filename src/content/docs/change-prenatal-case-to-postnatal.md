---
title: Change Prenatal Case to Postnatal
author: dcacciotti
pubDate: 2019-03-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

&lt;pre&gt;&lt;code&gt;Prenatal to Postnatal (TCID entered)
BEGIN TRANSACTION
declare @newDOB datetime = &#39;[Put new DOB here]&#39;
declare @newLevelDate datetime = &#39;[Put new level date here]&#39;
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

----------------------------------------------------------------------------------------------------------------------------------------------
--Prenatal to Postnatal (No TCID)
BEGIN TRANSACTION;

DECLARE @PC1ID VARCHAR(13) = &#39;[Put PC1ID here]&#39;;
DECLARE @newDOB DATETIME = &#39;[Put new DOB here]&#39;;
DECLARE @newLevelDate DATETIME = &#39;[Put new level date here.  Usually the intake date.]&#39;;
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
-----------------------------------------------------------------------------------------------------------------------------------------------------------
--Postnatal to Prenatal (No TCID)
BEGIN TRANSACTION

DECLARE @newDOB datetime = &#39;[Put new TCDOB here]&#39;
declare @HVCasePK int =  [Put HVCasePK here]
DECLARE @newLevelFK INT = (SELECT cl.codeLevelPK FROM dbo.codeLevel cl WHERE cl.ConstantName = &#39;LEVEL1_PRENATAL&#39;) 

SELECT * FROM dbo.HVCase hc WHERE hc.HVCasePK =  @HVCasePK
SELECT * FROM dbo.CaseProgram cp WHERE cp.HVCaseFK =  @HVCasePK
SELECT * FROM dbo.HVLevel hl INNER JOIN dbo.codeLevel cl ON cl.codeLevelPK = hl.LevelFK WHERE hl.HVCaseFK =  @HVCasePK

--Update the TCDOB
update hvcase set tcdob = NULL, EDC = @newDOB where HVCasePK = @HVCasePK

--Update the level
update HVLevel set LevelFK = @newLevelFK where hvlevelpk = [Put HVLevelPK here]
UPDATE dbo.CaseProgram SET CurrentLevelFK = @newLevelFK WHERE HVCaseFK = @HVCasePK

ROLLBACK &lt;/code&gt;&lt;/pre&gt;