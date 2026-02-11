---
title: Register SQL dbs for Publish
author: cpapas
pubDate: 2020-11-19
description: "CHSR Wiki"
categories: ["HFNY"]
topic: SQL
---

In SSMS under View menu, choose Registered Servers
Right-click on 'Local Server Groups' and choose 'New Server Group'.  Make any name you want.
Right click on the group you just created and choose 'New Server Registration'.  In the General tab use CHSRAdmin to connect. [Use CHSRCSDA for Nebraska Midwest SQL Pool]  Under ConnectionProperties tab, choose connect to database at top, and select one database.  If you have more than one db on this SQL Server pool, repeat this step, selecting a different database under connectionproperties tab each time.
Your completed New server group should look something like the image attahed.