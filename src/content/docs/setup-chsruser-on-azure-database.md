---
title: Setup CHSRUser on Azure Database
author: dcacciotti
pubDate: 2019-03-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: azure
---

--IN MASTER *Not needed if using an existing elastic database 
CREATE LOGIN CHSRUser 
WITH PASSWORD = ''

CREATE USER [CHSRUser] 
FOR LOGIN [CHSRUser] 
WITH DEFAULT_SCHEMA = dbo;

--In Database of Choice
CREATE USER [CHSRUser] 
FOR LOGIN [CHSRUser] 
WITH DEFAULT_SCHEMA = dbo;

ALTER ROLE db_datareader ADD MEMBER [CHSRUser]; 
ALTER ROLE db_datawriter ADD MEMBER [CHSRUser]; 
ALTER ROLE db_executor ADD MEMBER [CHSRUser]; 

--ANOTHER POSSIBLE OPTION
EXEC sp_addrolemember 'db_datareader', 'CHSRUser';
EXEC sp_addrolemember 'db_datawriter', 'CHSRUser';
EXEC sp_addrolemember 'db_executor', 'CHSRUser';

GRANT CONNECT TO CHSRUser
GRANT EXECUTE TO [db_executor]