---
title: Register SQL dbs for Publish
author: cpapas
pubDate: 2020-11-19
description: "CHSR Wiki"
categories: ["HFNY"]
topic: SQL
---

In SSMS under View menu, choose Registered Servers
Right-click on &#39;Local Server Groups&#39; and choose &#39;New Server Group&#39;.  Make any name you want.
Right click on the group you just created and choose &#39;New Server Registration&#39;.  In the General tab use CHSRAdmin to connect. [Use CHSRCSDA for Nebraska Midwest SQL Pool]  Under ConnectionProperties tab, choose connect to database at top, and select one database.  If you have more than one db on this SQL Server pool, repeat this step, selecting a different database under connectionproperties tab each time.
Your completed New server group should look something like the image attahed.