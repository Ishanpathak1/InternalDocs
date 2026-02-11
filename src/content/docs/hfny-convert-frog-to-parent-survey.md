---
title: HFNY Convert FROG to Parent Survey
author: bsimmons
pubDate: 2022-01-27
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

&lt;pre&gt;&lt;code&gt;
--FROG -&gt; Parent Survey conversion
DECLARE @PC1ID VARCHAR(13) = &#39;&#39;
DECLARE @HVCaseFK INT = (SELECT TOP(1) cp.HVCaseFK FROM dbo.CaseProgram cp WHERE cp.PC1ID = @PC1ID)
DECLARE @KempePK INT = (SELECT TOP(1) k.KempePK FROM dbo.Kempe k WHERE k.HVCaseFK = @HVCaseFK)
DECLARE @KempeResult BIT = 1

--Convert the Pre-Assessment
UPDATE dbo.Preassessment SET KempeResult = @KempeResult WHERE CaseStatus = &#39;02&#39; AND HVCaseFK = @HVCaseFK

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
				DadBondingArea = &#39;U&#39;,
                 DadChildHistoryArea = &#39;U&#39;,
                 DadCPSArea = &#39;U&#39;,
                 DadDisciplineArea = &#39;U&#39;,
                 DadExpectationArea = &#39;U&#39;,
                 DadPerceptionArea = &#39;U&#39;,
                 DadSAMICHArea = &#39;U&#39;,
                 DadScore = 0,
                 DadSelfEsteemArea = &#39;U&#39;,
                 DadStressorArea = &#39;U&#39;,
                 DadViolentArea = &#39;U&#39;,
                 MomBondingArea = &#39;U&#39;,
                 MomChildHistoryArea = &#39;U&#39;,
                 MomCPSArea = &#39;U&#39;,
                 MomDisciplineArea = &#39;U&#39;,
                 MomExpectationArea = &#39;U&#39;,
                 MomPerceptionArea = &#39;U&#39;,
                 MomSAMICHArea = &#39;U&#39;,
                 MomScore = 0,
                 MomSelfEsteemArea = &#39;U&#39;,
                 MomStressorArea = &#39;U&#39;,
                 MomViolentArea = &#39;U&#39;,
                 PartnerBondingArea = &#39;U&#39;,
                 PartnerChildHistoryArea = &#39;U&#39;,
                 PartnerCPSArea = &#39;U&#39;,
                 PartnerDisciplineArea = &#39;U&#39;,
                 PartnerExpectationArea = &#39;U&#39;,
                 PartnerPerceptionArea = &#39;U&#39;,
                 PartnerSAMICHArea = &#39;U&#39;,
                 PartnerScore = 0,
                 PartnerSelfEsteemArea = &#39;U&#39;,
                 PartnerStressorArea = &#39;U&#39;,
                 PartnerViolentArea = &#39;U&#39;
				 WHERE KempePK = @KempePK
&lt;/code&gt;&lt;/pre&gt;