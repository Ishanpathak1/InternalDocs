---
title: Change a case from single birth to multiple (or visa versa)
author: jrobohn
pubDate: 2019-05-08
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

/*
exec Script-To-Correct-NumberOfChildren-(TCNumber)
*/
declare @PC1ID char(13)
declare @CorrectedTCNumber int
declare @CaseProgress decimal
declare @HVCaseFK int
declare @TCDOB date
declare @IntakeDate date

-- set @PC1ID = &#39;ES8301063559&#39;
set @PC1ID = &#39;thepc1id&#39;

-- if TCNumber was set to 1 (single TC) then set corrected to 2 and CaseProgress back to 10
set @CorrectedTCNumber = 2 
set @CaseProgress = 10

--else if TCNumber was set to 2 (multiple) then set corrected to 1 and CaseProgress to 11
--set @CorrectedTCNumber = 2 
--set @CaseProgress = 10

/*
	exploratory code to view the relevant data elements
*/
select cp.HVCaseFK
	 , cp.PC1ID
	 , cp.CaseProgramPK
	 , cp.CaseProgramCreateDate
	 , cp.CaseProgramCreator
	 , cp.CaseProgramEditDate
	 , cp.CaseProgramEditor
	 , cp.CurrentLevelFK
	 , cp.CurrentLevelDate
	 , cp.ProgramFK
	 , hl.LevelFK
	 , hl.LevelAssignDate
	 , hc.CaseProgress
	 , hc.EDC
	 , hc.IntakeDate
	 , hc.TCDOB
	 , hc.TCDOD
	 , hc.TCNumber
	 , t.TCIDPK
	 , t.MultipleBirth
	 , t.NumberofChildren
	 , t.TCIDCreator
	 , t.TCIDCreateDate
	 , t.TCIDEditor
	 , t.TCIDEditDate
from CaseProgram cp
inner join HVCase hc on hc.HVCasePK = cp.HVCaseFK
inner join TCID t on t.HVCaseFK = hc.HVCasePK
inner join HVLevel hl on hl.HVCaseFK = hc.HVCasePK
where cp.PC1ID = @PC1ID

-- get the HVCaseFK, TCDOB, and IntakeDate
select @HVCaseFK = HVCasePK 
		, @TCDOB = h.TCDOB
		, @IntakeDate = h.IntakeDate
from CaseProgram cp
inner join HVCase h on h.HVCasePK = cp.HVCaseFK
inner join TCID T on T.HVCaseFK = h.HVCasePK
where PC1ID = @PC1ID

-- print it to verify
select @HVCaseFK

-- update TCNumber and CaseProgress
update HVCase 
set TCNumber = @CorrectedTCNumber
	, CaseProgress = @CaseProgress
where HVCasePK = @HVCaseFK

-- update MultipleBirth and NumberOfChildren
update TCID 
set MultipleBirth = case when @CorrectedTCNumber &gt; 1 then 1 else 0 end
	, NumberOfChildren = @CorrectedTCNumber
where HVCaseFK = @HVCaseFK

-- if the case was pre-natal, adding one TCID would have changed the case to Level 1, 
--	so we will need to do level updates
if (@TCDOB &gt; @IntakeDate)
	begin
		declare @CurrentLevelFK int
		declare @CurrentLevelDate date

		-- remove the Level 1 added 
		delete from HVLevel 
		where HVCaseFK = @HVCaseFK
				and LevelFK = 14
		
		-- get which pre-natal level/date the case was previously on from the Level table
		select @CurrentLevelFK = LevelFK, @CurrentLevelDate = hl.LevelAssignDate
		from HVLevel hl
		where hl.HVCaseFK = @HVCaseFK

		update CaseProgram
		set CurrentLevelFK = @CurrentLevelFK
			, CurrentLevelDate = @CurrentLevelDate
		where PC1ID = @PC1ID

	end