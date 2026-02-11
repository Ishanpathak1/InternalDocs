---
title: Setting up access to HFNY Research database
author: dcacciotti
pubDate: 2019-03-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

Setting up access to HFNY Research database

HFNY_Research database is on the CHSRSQL server on port 64700 (169.226.105.134,64700)
Control Panel, Administrative Tools, Data Sources (ODBC)
User DSN, Add
Choose SQL Server as the driver
Name: HFNY_Research
Description: HFNY Research data
Server: 169.226.105.134,64700
Next
Choose "With Windows NT authentication using the network login ID"
Check "Connect to SQL Server to obtain default settings..."
Next
Check "Change the default database to:"
Select HFNY_Research database
All other options stay the same
Next
All options stay the same
Finish
A Confirmation dialog pops up. Click "Test Data Source..." button to test settings
If successful, you're done.