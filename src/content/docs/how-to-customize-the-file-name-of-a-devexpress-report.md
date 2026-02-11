---
title: How to customize the file name of a DevExpress Report
author: dcacciotti
pubDate: 2019-08-23
description: "CHSR Wiki"
categories: ["HFNY"]
topic: DevExpress
---

To customize the file name of an exported report in DevExpress, please add the following to the code behind:
<pre><code>XtraReport1 rep = new XtraReport1();  
            rep.Name = "1234";  
            ReportViewer1.Report = rep;</code></pre>