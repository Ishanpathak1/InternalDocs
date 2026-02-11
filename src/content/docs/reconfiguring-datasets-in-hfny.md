---
title: Reconfiguring DataSets in HFNY
author: wobrien
pubDate: 2019-03-12
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

Problem: Open DataSet, configure TableAdapter then POOF! Report Breaks!
Solution: 
1. Go to dataset designer file. Need to change two namespaces.
	a. namespace HFNY.Reports.XtraReports.DataRetrieval => namespace HFNY
	b. namespace HFNY.Reports.XtraReports.DataRetrieval.dataset table adapter class> => namespace HFNY.dataset table adapter class
2. Go to dataset codebehind file. Need to change one namespace
	a. namespace HFNY.Reports.XtraReports.DataRetrieval => namespace HFNY


Problem 2: When Creating New Report Error "public partial class Reports namespace already exists"
1. Make sure IReportBase is in codebehind of new report
2. Make sure namespace is just "namespace HFNY"