---
title: Clear Stored Procedure Cache on Azure Sql Database
author: bsimmons
pubDate: 2019-03-20
description: "CHSR Wiki"
categories: ["HFNY"]
topic: azure
---

This command will clear the stored procedure caches for all stored procedures:

ALTER DATABASE SCOPED CONFIGURATION CLEAR PROCEDURE_CACHE