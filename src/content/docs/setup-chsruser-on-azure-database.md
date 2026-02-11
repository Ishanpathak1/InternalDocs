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
WITH PASSWORD = &#39;&#39;

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
EXEC sp_addrolemember &#39;db_datareader&#39;, &#39;CHSRUser&#39;;
EXEC sp_addrolemember &#39;db_datawriter&#39;, &#39;CHSRUser&#39;;
EXEC sp_addrolemember &#39;db_executor&#39;, &#39;CHSRUser&#39;;

GRANT CONNECT TO CHSRUser
GRANT EXECUTE TO [db_executor]