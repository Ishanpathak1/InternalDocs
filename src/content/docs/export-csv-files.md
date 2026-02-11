---
title: Export CSV Files
author: cpapas
pubDate: 2023-09-07
description: "CHSR Wiki"
categories: ["HFNY"]
topic: SQL
---

Using SQL Data Compare to do this.  Set the tables you want to export into CSV by checking them and compare the same database to itself.  Make sure to check the setting that shows identical results, and press Tools>ExportToCSV, including identical rows.  If you export to UTF-8 it'll all be in separated columns, if you export to UNICODE it'll be actually comma delineated when opened in excel.