---
title: HFNY Convert Parent Survey to FROG
author: bsimmons
pubDate: 2022-01-27
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

&lt;pre&gt;&lt;code&gt;
--Parent Survey -&gt; FROG conversion
DECLARE @PC1ID VARCHAR(13) = &#39;&#39;
DECLARE @HVCaseFK INT = (SELECT TOP(1) cp.HVCaseFK FROM dbo.CaseProgram cp WHERE cp.PC1ID = @PC1ID)
DECLARE @KempePK INT = (SELECT TOP(1) k.KempePK FROM dbo.Kempe k WHERE k.HVCaseFK = @HVCaseFK)

--Convert the Pre-Assessment
UPDATE dbo.Preassessment SET KempeResult = NULL WHERE CaseStatus = &#39;02&#39; AND HVCaseFK = @HVCaseFK

--Convert the Kempe (they need to re-enter scores)
UPDATE dbo.Kempe SET 
                 DadBondingArea = NULL,
                 DadChildHistoryArea = NULL,
                 DadCPSArea = NULL,
                 DadDisciplineArea = NULL,
                 DadExpectationArea = NULL,
                 DadPerceptionArea = NULL,
                 DadSAMICHArea = NULL,
                 DadScore = 0,
                 DadSelfEsteemArea = NULL,
                 DadStressorArea = NULL,
                 DadViolentArea = NULL,
                 KempeResult = 0,
				 NegativeReferral = 0,
                 MomBondingArea = NULL,
                 MomChildHistoryArea = NULL,
                 MomCPSArea = NULL,
                 MomDisciplineArea = NULL,
                 MomExpectationArea = NULL,
                 MomPerceptionArea = NULL,
                 MomSAMICHArea = NULL,
                 MomScore = 0,
                 MomSelfEsteemArea = NULL,
                 MomStressorArea = NULL,
                 MomViolentArea = NULL,
                 PartnerBondingArea = NULL,
                 PartnerChildHistoryArea = NULL,
                 PartnerCPSArea = NULL,
                 PartnerDisciplineArea = NULL,
                 PartnerExpectationArea = NULL,
                 PartnerPerceptionArea = NULL,
                 PartnerSAMICHArea = NULL,
                 PartnerScore = 0,
                 PartnerSelfEsteemArea = NULL,
                 PartnerStressorArea = NULL,
                 PartnerViolentArea = NULL,
				 FROG_IsFormFrog = 1
				 WHERE KempePK = @KempePK
&lt;/code&gt;&lt;/pre&gt;