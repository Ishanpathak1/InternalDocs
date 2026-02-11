---
title: HFNY Convert FROG to Parent Survey
author: bsimmons
pubDate: 2022-01-27
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

<pre><code>
--FROG -> Parent Survey conversion
DECLARE @PC1ID VARCHAR(13) = ''
DECLARE @HVCaseFK INT = (SELECT TOP(1) cp.HVCaseFK FROM dbo.CaseProgram cp WHERE cp.PC1ID = @PC1ID)
DECLARE @KempePK INT = (SELECT TOP(1) k.KempePK FROM dbo.Kempe k WHERE k.HVCaseFK = @HVCaseFK)
DECLARE @KempeResult BIT = 1

--Convert the Pre-Assessment
UPDATE dbo.Preassessment SET KempeResult = @KempeResult WHERE CaseStatus = '02' AND HVCaseFK = @HVCaseFK

--Convert the Kempe (they need to re-enter scores)
UPDATE dbo.Kempe SET 
                 FROG_BH_PC1Score = NULL,
                FROG_BH_PC1Comments = NULL,
                FROG_BH_P2Score = NULL,
                FROG_BH_P2Comments = NULL,
                FROG_CPS_PC1Score = NULL,
                FROG_CPS_PC1Comments = NULL,
                FROG_CPS_P2Score = NULL,
                FROG_CPS_P2Comments = NULL,
                FROG_CSS_PC1Score = NULL,
                FROG_CSS_PC1Comments = NULL,
                FROG_CSS_P2Score = NULL,
                FROG_CSS_P2Comments = NULL,
                FROG_FE_PC1Score = NULL,
                FROG_FE_PC1Comments = NULL,
                FROG_FE_P2Score = NULL,
                FROG_FE_P2Comments = NULL,
                FROG_GSL_PC1Score = NULL,
                FROG_GSL_PC1Comments = NULL,
                FROG_GSL_P2Score = NULL,
                FROG_GSL_P2Comments = NULL,
                FROG_ICD_PC1Score = NULL,
                FROG_ICD_PC1Comments = NULL,
                FROG_ICD_P2Score = NULL,
                FROG_ICD_P2Comments = NULL,
                FROG_Introduction = NULL,
                FROG_IPCM_PC1Score = NULL,
                FROG_IPCM_PC1Comments = NULL,
                FROG_IPCM_P2Score = NULL,
                FROG_IPCM_P2Comments = NULL,
                FROG_IPS_PC1Score = NULL,
                FROG_IPS_PC1Comments = NULL,
                FROG_IPS_P2Score = NULL,
                FROG_IPS_P2Comments = NULL,
                FROG_IsFormFrog = 0,
                FROG_MH_PC1Score = NULL,
                FROG_MH_PC1Comments = NULL,
                FROG_MH_P2Score = NULL,
                FROG_MH_P2Comments = NULL,
                FROG_PC_PC1Score = NULL,
                FROG_PC_PC1Comments = NULL,
                FROG_PC_P2Score = NULL,
                FROG_PC_P2Comments = NULL,
                FROG_PCE_PC1Score = NULL,
                FROG_PCE_PC1Comments = NULL,
                FROG_PCE_P2Score = NULL,
                FROG_PCE_P2Comments = NULL,
                FROG_PD_PC1Score = NULL,
                FROG_PD_PC1Comments = NULL,
                FROG_PD_P2Score = NULL,
                FROG_PD_P2Comments = NULL,
                FROG_P2IdentificationCode = NULL,
                FROG_P2Present = 0,
                FROG_Referrals = NULL,
                FROG_SC_PC1Score = NULL,
                FROG_SC_PC1Comments = NULL,
                FROG_SC_P2Score = NULL,
                FROG_SC_P2Comments = NULL,
                FROG_SCE_PC1Score = NULL,
                FROG_SCE_PC1Comments = NULL,
                FROG_SCE_P2Score = NULL,
                FROG_SCE_P2Comments = NULL,
				NegativeReferral = CASE WHEN @KempeResult = 1 THEN 0 ELSE 1 END,
				KempeResult = @KempeResult,
				DadBondingArea = 'U',
                 DadChildHistoryArea = 'U',
                 DadCPSArea = 'U',
                 DadDisciplineArea = 'U',
                 DadExpectationArea = 'U',
                 DadPerceptionArea = 'U',
                 DadSAMICHArea = 'U',
                 DadScore = 0,
                 DadSelfEsteemArea = 'U',
                 DadStressorArea = 'U',
                 DadViolentArea = 'U',
                 MomBondingArea = 'U',
                 MomChildHistoryArea = 'U',
                 MomCPSArea = 'U',
                 MomDisciplineArea = 'U',
                 MomExpectationArea = 'U',
                 MomPerceptionArea = 'U',
                 MomSAMICHArea = 'U',
                 MomScore = 0,
                 MomSelfEsteemArea = 'U',
                 MomStressorArea = 'U',
                 MomViolentArea = 'U',
                 PartnerBondingArea = 'U',
                 PartnerChildHistoryArea = 'U',
                 PartnerCPSArea = 'U',
                 PartnerDisciplineArea = 'U',
                 PartnerExpectationArea = 'U',
                 PartnerPerceptionArea = 'U',
                 PartnerSAMICHArea = 'U',
                 PartnerScore = 0,
                 PartnerSelfEsteemArea = 'U',
                 PartnerStressorArea = 'U',
                 PartnerViolentArea = 'U'
				 WHERE KempePK = @KempePK
</code></pre>