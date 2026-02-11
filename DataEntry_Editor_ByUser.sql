DECLARE @stdate AS DATE = '01/01/2021'
DECLARE @enddate AS DATE = '01/15/2021'
DECLARE @programlist AS INTEGER = 5

DECLARE @editortable AS TABLE (
	ProgramName VARCHAR(50)
	, LoginUser VARCHAR(50)
	, FormName VARCHAR(25)
	, [Data Entry Date Time] DATETIME
	, [LoginEditor] VARCHAR(25)
	, [Date Edit Date] DATETIME
)

INSERT INTO	@editortable
(
    ProgramName,
    LoginUser,
    FormName,
    [Data Entry Date Time],
    LoginEditor,
    [Date Edit Date]
)

SELECT ProgramName, ASQCreator AS 'LoginUser', 'ASQ' AS FormName, ASQCreateDate AS 'Data Entry Date Time'
, ASQEditor AS 'LoginEditor', ASQEditDate AS 'Data Edit Date'
FROM asq
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND ASQCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, ASQseCreator AS 'LoginUser', 'ASQSE' AS FormName, ASQSECreateDate AS 'Data Entry Date Time', ASQSEEditor AS 'LoginEditor', ASQSEEditDate AS 'Data Edit Date'
FROM asqse
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND ASQseCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, FollowUpCreator AS 'LoginUser', 'FollowUp' AS FormName, FollowUpCreateDate AS 'Data Entry Date Time', FollowUpEditor AS 'LoginEditor', FollowUpEditDate AS 'Data Edit Date'
FROM dbo.FollowUp
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND FollowUpCreateDate BETWEEN @stdate AND @enddate


UNION

SELECT ProgramName, GoalPlanCreator AS 'LoginUser', 'GoalPlan' AS FormName, GoalPlanCreateDate AS 'Data Entry Date Time', GoalPlanEditor AS 'LoginEditor', GoalPlanEditDate AS 'Data Edit Date'
FROM dbo.GoalPlan
INNER JOIN dbo.CaseProgram ON GoalPlan.HVCaseFK = caseprogram.HVCaseFK
INNER JOIN dbo.HVProgram ON CaseProgram.programfk = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND GoalPlanCreateDate BETWEEN @stdate AND @enddate


UNION

SELECT ProgramName, HITSCreator AS 'LoginUser', 'HITS' AS FormName, HITSCreateDate AS 'Data Entry Date Time', HITSEditor AS 'LoginEditor', HITSEditDate AS 'Data Edit Date'
FROM dbo.HITS
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND HITSCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, HVLevelCreator AS 'LoginUser', 'HVLevel' AS FormName, HVLevelCreateDate AS 'Data Entry Date Time', HVLevelEditor AS 'LoginEditor', HVLevelEditDate AS 'Data Edit Date'
FROM dbo.HVLevel
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND HVLevelCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, HVLogCreator AS 'LoginUser', 'HVLog' AS FormName, HVLogCreateDate AS 'Data Entry Date Time', HVLogEditor AS 'LoginEditor', HVLogEditDate AS 'Data Edit Date'
FROM dbo.HVLog
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND HVLogCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, ScreenCreator AS 'LoginUser', 'HVScreen' AS FormName, ScreenCreateDate AS 'Data Entry Date Time', ScreenEditor AS 'LoginEditor', ScreenEditDate AS 'Data Edit Date'
FROM dbo.HVScreen
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND ScreenCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, IntakeCreator AS 'LoginUser', 'Intake' AS FormName, IntakeCreateDate AS 'Data Entry Date Time', IntakeEditor AS 'LoginEditor', IntakeEditdate AS 'Data Edit Date'
FROM dbo.Intake
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND IntakeCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, KempeCreator AS 'LoginUser', 'Parent Survey' AS FormName, KempeCreateDate AS 'Data Entry Date Time', KempeEditor AS 'LoginEditor', KempeEditDate AS 'Data Edit Date'
FROM dbo.Kempe
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND KempeCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, PC1MedicalCreator AS 'LoginUser', 'PC1Medical' AS FormName, PC1MedicalCreateDate AS 'Data Entry Date Time', PC1MedicalEditor AS 'LoginEditor', PC1MedicalEditDate AS 'Data Edit Date'
FROM dbo.PC1Medical
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND PC1MedicalCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, PACreator AS 'LoginUser', 'Enrollment' AS FormName, PACreateDate AS 'Data Entry Date Time', PAEditor AS 'LoginEditor', PAEditDate AS 'Data Edit Date'
FROM dbo.Preassessment
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND PACreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, PICreator AS 'LoginUser', 'Enrollment' AS FormName, PICreateDate AS 'Data Entry Date Time', PIEditor AS 'LoginEditor', PIEditDate AS 'Data Edit Date'
FROM dbo.Preintake
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND PICreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, ServiceReferralCreator AS 'LoginUser', 'ServiceReferral' AS FormName, ServiceReferralCreateDate AS 'Data Entry Date Time', ServiceReferralEditor AS 'LoginEditor', ServiceReferralEditDate AS 'Data Edit Date'
FROM dbo.ServiceReferral
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND ServiceReferralCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, TCIDCreator AS 'LoginUser', 'TCID' AS FormName, TCIDCreateDate AS 'Data Entry Date Time', TCIDEditor AS 'LoginEditor', TCIDEditDate AS 'Data Edit Date'
FROM dbo.TCID
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND TCIDCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, TCMedicalCreator AS 'LoginUser', 'TCMedical' AS FormName, TCMedicalCreateDate AS 'Data Entry Date Time', TCMedicalEditor AS 'LoginEditor', TCMedicalEditDate AS 'Data Edit Date'
FROM dbo.TCMedical
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND TCMedicalCreateDate BETWEEN @stdate AND @enddate

UNION

SELECT ProgramName, TrainingCreator AS 'LoginUser', 'Training' AS FormName, TrainingCreateDate AS 'Data Entry Date Time', TrainingEditor AS 'LoginEditor', TrainingEditDate AS 'Data Edit Date'
FROM dbo.Training
INNER JOIN dbo.HVProgram ON ProgramFK = HVProgramPK
WHERE ProgramFK IN (@programlist)
AND TrainingCreateDate BETWEEN @stdate AND @enddate



SELECT * FROM @editortable
WHERE LoginEditor='kharris'