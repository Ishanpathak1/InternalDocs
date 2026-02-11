---
title: "Adding user 'Developer' to new database"
author: cpapas
pubDate: 2019-03-08
description: "CHSR Wiki"
categories: ["HFNY"]
topic: azure
---

Since we don't want to be able to accidentally delete Azure databases from SSMS, we need a user other than CHSRAdmin.  The Developer user will allow us to do that.

If the Developer login does not exist, fill in the password section and run this code:

CREATE LOGIN Developer WITH PASSWORD = ''
ALTER ROLE loginmanager ADD MEMBER Developer

To create the Developer user on a database, just run this code:

CREATE USER Developer FOR LOGIN Developer
EXEC sp_addrolemember 'db_owner', 'Developer'

That user will be able to perform any action on a local database, but will not be able to delete an Azure database.