---
title: How to customize the file name of a DevExpress Report
author: dcacciotti
pubDate: 2019-08-23
description: "CHSR Wiki"
categories: ["HFNY"]
topic: DevExpress
---

To customize the file name of an exported report in DevExpress, please add the following to the code behind:
&lt;pre&gt;&lt;code&gt;XtraReport1 rep = new XtraReport1();  
            rep.Name = &quot;1234&quot;;  
            ReportViewer1.Report = rep;&lt;/code&gt;&lt;/pre&gt;