---
title: Delete All Cases Prior To Specified Date
author: dcacciotti
pubDate: 2019-03-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

--This TSQL Code deletes all cases prior to a certain time.  Best use is on demo site to keep it running fast on the slower Azure test pool

DECLARE @deletedate AS DATE 
DECLARE @AreYouSure AS VARCHAR(3)

SET @deletedate = '01/01/2015'
SET @AreYouSure = 'Yes'  --Type 'Yes' here - you better be sure

EXEC sp_MSForEachTable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'

--UPDATE WORKER TABLE FOR LATER DELETION
UPDATE worker SET workerpk_old = (SELECT TOP 1 programfk FROM workerprogram WHERE workerfk = workerpk)

If(OBJECT_ID('tempdb..#CasesToDelete') Is Not Null)
Begin
    Drop Table #CasesToDelete
END

create table #CasesToDelete
(
    HVCASEFK int, 
    PC1FK int, PC2FK int, OBPFK int, CPFK INT
)

DECLARE @rownum AS int


INSERT INTO #CasesToDelete
(hvcasefk, PC1FK, PC2FK, obpfk, cpfk)
(
SELECT DISTINCT hvcasefk, pc1fk, pc2fk, OBPFK, cpfk FROM dbo.CaseProgram
INNER JOIN dbo.HVCase ON HVCase.HVCasePK = CaseProgram.HVCaseFK
WHERE IntakeDate < @deletedate
)

Select @rownum = COUNT(*) From #CasesToDelete


BEGIN
IF @AreYouSure = 'Yes' BEGIN


If(OBJECT_ID('tempdb..#TrainingsToDelete') Is Not Null)
Begin
    Drop Table #TrainingsToDelete
END

create table #TrainingsToDelete
(
    TrainingFK int
)
DECLARE @trainingnum AS int

INSERT INTO #TrainingsToDelete
(trainingfk)
(
SELECT DISTINCT trainingpk FROM dbo.training
WHERE TrainingDate < @deletedate  
)

Select @trainingnum = COUNT(*) From #TrainingsToDelete



WHILE @rownum > 0
BEGIN
 declare @pk INT
 
 DECLARE @hvcasefk AS INT
 SET @hvcasefk = (SELECT TOP 1 hvcasefk FROM #CasesToDelete)
 
 --ASQ
 DECLARE del_cursor CURSOR
 FOR SELECT asqpk FROM ASQ WHERE hvcasefk = @hvcasefk;
 OPEN del_cursor 

 FETCH NEXT FROM del_cursor  
 INTO @PK
 
 While @@FETCH_STATUS = 0
 BEGIN
 EXEC spDelASQ @ASQPK=@PK 

 FETCH NEXT FROM del_cursor  
 INTO @PK

 END
 CLOSE del_cursor;
 DEALLOCATE del_cursor; 

 
 --ASQSE
 DECLARE del_cursor CURSOR
 FOR SELECT asqsepk FROM ASQse WHERE hvcasefk = @hvcasefk;
 OPEN del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelASQSE @ASQSEPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;


 --Attachment
 DECLARE del_cursor CURSOR
 FOR SELECT Attachmentpk FROM dbo.Attachment WHERE hvcasefk = @hvcasefk;
 OPEN del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelattachment @AttachmentPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;


 --CaseFilter--
 declare del_cursor cursor for
 select caseFilterPK
 from CaseFilter
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelCaseFilter @CaseFilterPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 ----CaseNote
 DECLARE del_cursor CURSOR
 FOR SELECT CaseNotepk FROM dbo.CaseNote WHERE hvcasefk = @hvcasefk;
 OPEN del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelCaseNote @CaseNotePK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 ----CaseView
 DECLARE del_cursor CURSOR
 FOR SELECT CaseViewpk FROM dbo.CaseView;
 OPEN del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelCaseView @CaseViewPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --Education
 declare del_cursor cursor for
 select Educationpk
 from Education
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelEducation @EducationPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --Employment
 declare del_cursor cursor for
 select Employmentpk
 from Employment
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelEmployment @EmploymentPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --FatherFigure
 declare del_cursor cursor for
 select FatherFigurepk
 from FatherFigure
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelFatherFigure @FatherFigurePK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;


 --Hits
 declare del_cursor cursor for
 select Hitspk
 from Hits
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHits @HitsPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;



 --HVLog
 declare del_cursor cursor for
 select HVLOGpk
 from HVLog
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHVLog @HVLogPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --HVGroupParticipants
 declare del_cursor cursor for
 select HVGroupParticipantspk
 from HVGroupParticipants
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHVGroupParticipants @HVGroupParticipantsPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor; 

 --HVGroup
 declare del_cursor cursor for
 select HVGrouppk
 from HVGroup
 where hvgroup.GroupDate < @deletedate;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHVGroup @HVGroupPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 
 --HVLevel
 declare del_cursor cursor for
 select HVLevelpk
 from HVLevel
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHVLevel @HVLevelPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 

 
 
 --HVScreen
 declare del_cursor cursor for
 select HVScreenpk
 from HVScreen
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHVScreen @HVScreenPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 
 
 --Intake
 declare del_cursor cursor for
 select Intakepk
 from Intake
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelIntake @IntakePK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 
 
 --Kempe
 declare del_cursor cursor for
 select Kempepk
 from Kempe
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelKempe @KempePK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;


 --OtherChild
 declare del_cursor cursor for
 select otherchildpk
 from OtherChild
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelOtherChild @OtherChildPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 
 
 --PC1Issues
 declare del_cursor cursor for
 select PC1Issuespk
 from PC1Issues
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPC1Issues @PC1IssuesPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor; 

 --PC1Medical
 declare del_cursor cursor for
 select PC1Medicalpk
 from PC1Medical
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPC1Medical @PC1MedicalPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 

 --PHQ9
 declare del_cursor cursor for
 select PHQ9pk
 from PHQ9
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPHQ9 @PHQ9PK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 

 --Preassessment
 declare del_cursor cursor for
 select PreassessmentPK
 from Preassessment
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPreassessment @PreassessmentPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --ServiceReferral
 declare del_cursor cursor for
 select ServiceReferralpk
 from ServiceReferral
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelServiceReferral @ServiceReferralPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --TCMEDICAL
 declare del_cursor cursor for
 select TCMedicalpk
 from TCMedical
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelTCMedical @TCMedicalPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 --end

 --PHQ9
 declare del_cursor cursor for
 select PHQ9PK
 from PHQ9 P
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPHQ9 @PHQ9PK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --TCID
 declare del_cursor cursor for
 select TCIDpk
 from TCID
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelTCID @TCIDPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --HVLEVEL
 declare del_cursor cursor for
 select HVLevelpk
 from HVLevel
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHVLevel @HVLevelPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --FollowUp
 declare del_cursor cursor for
 select FollowUppk
 from FollowUp
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelFollowUp @FollowUpPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --CommonAttributes
 declare del_cursor cursor for
 select CommonAttributespk
 from CommonAttributes
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelCommonAttributes @CommonAttributesPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --Intake
 declare del_cursor cursor for
 select Intakepk
 from Intake
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelIntake @IntakePK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --Preintake
 declare del_cursor cursor for
 select Preintakepk
 from Preintake
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPreintake @PreintakePK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --AuditC
 declare del_cursor cursor for
 select AuditCPK
 from AuditC
 where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelAuditC @AuditCPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --HITS
 declare del_cursor cursor for
 select HITSPK FROM HITS H WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHITS @HITSPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --Kempe
 declare del_cursor cursor for
 select Kempepk FROM Kempe WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelKempe @KempePK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --PC1Issues
 declare del_cursor cursor for
 select PC1Issuespk FROM PC1Issues WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPC1Issues @PC1IssuesPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --Preassessment
 declare del_cursor cursor for
 select Preassessmentpk FROM Preassessment WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPreassessment @PreassessmentPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --PSI--possible multi-records
 declare del_cursor cursor for
 select psipk FROM PSI WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelPSI @PSIPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --FatherFigure
 declare del_cursor cursor for
 select FatherFigurePK FROM FatherFigure ff WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelFatherFigure @FatherFigurePK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;


 --WorkerAssignment
 declare del_cursor cursor for
 select WorkerAssignmentpk FROM WorkerAssignment WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelWorkerAssignment @WorkerAssignmentPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;

 --HVSCREEN
 declare del_cursor cursor for
 select HVScreenpk FROM HVScreen where hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelHVScreen @HVScreenPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;


 --CaseProgram
 declare del_cursor cursor for
 select CaseProgrampk FROM CaseProgram WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelCaseProgram @CaseProgramPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 
 --HVCase

 
 -- delete hvcase record 
 DELETE from HVCase WHERE hvcasepk = @hvcasefk 

 

 --delete the PC record
 DELETE FROM PC WHERE pcpk IN (SELECT PC1FK FROM #CasesToDelete WHERE HVCaseFK = @hvcasefk)
 
 --delete the OBP record
 DELETE FROM PC WHERE pcpk IN (SELECT obpfk FROM #CasesToDelete WHERE HVCaseFK = @hvcasefk)
 
 --delete the PC2 record
 DELETE FROM PC WHERE pcpk IN (SELECT PC2FK FROM #CasesToDelete WHERE HVCaseFK = @hvcasefk)

 --delete the Emergency Contact record
 DELETE FROM PC WHERE pcpk IN (SELECT CPFK FROM #CasesToDelete WHERE HVCaseFK = @hvcasefk)

 
 --Supervision
 declare del_cursor cursor for
 select Supervisionpk FROM Supervision WHERE SupervisionDate < @deletedate;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelSupervision @SupervisionPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 
 --WorkerAssignment
 declare del_cursor cursor for
 select WorkerAssignmentpk FROM WorkerAssignment WHERE hvcasefk = @hvcasefk;
 open del_cursor

 fetch next from del_cursor into @PK

 while @@FETCH_STATUS = 0
 begin
 exec spDelWorkerAssignment @WorkerAssignmentPK = @PK

 fetch next from del_cursor into @PK

 end
 close del_cursor;
 deallocate del_cursor;
 
 SET @rownum = @rownum - 1

 DELETE FROM #CasesToDelete WHERE hvcasefk = @hvcasefk

 PRINT CONVERT(CHAR(10), @rownum) + ' Cases Left'

 
 END
 


 WHILE @trainingnum > 0
 BEGIN
 declare @pkremove INT
 declare @trainpk INT
 
 SET @trainpk = (SELECT TOP 1 trainingfk FROM #TrainingsToDelete)
 
 
 PRINT CONVERT(CHAR(10), @trainingnum) + ' Trainings Left'

 --TrainingAttendee
 DECLARE del_cursor CURSOR
 FOR SELECT TrainingAttendeepk FROM TrainingAttendee WHERE trainingfk = @trainpk;
 OPEN del_cursor 

 FETCH NEXT FROM del_cursor  
 INTO @pkremove
 
 While @@FETCH_STATUS = 0
 BEGIN
 EXEC spDelTrainingAttendee @TrainingAttendeePK=@pkremove 

 FETCH NEXT FROM del_cursor  
 INTO @pkremove

 END
 CLOSE del_cursor;
 DEALLOCATE del_cursor;

 --TrainingDetail
 DECLARE del_cursor CURSOR
 FOR SELECT TrainingDetailpk FROM TrainingDetail WHERE trainingfk = @trainpk;
 OPEN del_cursor 

 FETCH NEXT FROM del_cursor  
 INTO @pkremove
 
 While @@FETCH_STATUS = 0
 BEGIN
 EXEC spDelTrainingDetail @TrainingDetailPK=@pkremove 

 FETCH NEXT FROM del_cursor  
 INTO @pkremove

 END
 CLOSE del_cursor;
 DEALLOCATE del_cursor;

 
 SET @trainingnum = @trainingnum - 1

 DELETE FROM #TrainingsToDelete WHERE TrainingFK = @trainpk



 END

END 


END


 PRINT 'Im here'


 If(OBJECT_ID('tempdb..#temp') Is Not Null)
 Begin
 Drop Table #CasesToDelete
 END