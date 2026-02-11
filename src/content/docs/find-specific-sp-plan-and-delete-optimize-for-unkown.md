---
title: Find Specific SP Plan and Delete & Optimize for Unknown
author: dcacciotti
pubDate: 2019-03-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

To find and delete a specific Stored Procedure cached query execution plan:

## Step 1: Run the select to find the plan

```sql
use HFNY;

select [text], cp.size_in_bytes, plan_handle
FROM sys.dm_exec_cached_plans AS cp
CROSS APPLY sys.dm_exec_sql_text(plan_handle)
WHERE cp.cacheobjtype = N'Compiled Plan'
AND cp.objtype = N'Adhoc'
AND cp.usecounts = 1
and  [text] like '%ctePC1AgeAtIntake%'  --This is unique text inside the specific Stored Procedure you want to find
ORDER BY cp.size_in_bytes DESC;
```

## Step 2: Clear the specific plan

```sql
use hfny;
dbcc freeproccache(Insert plan name from above - its a really long number)
```

## Or clear everything on the database

```sql
DBCC FREEPROCCACHE
DBCC DROPCLEANBUFFERS
```

## Optimize for Unknown

To speed up stored procedures, add `OPTION (OPTIMIZE FOR (@parameter1 UNKNOWN, @parameter UNKNOWN, etc))` to your query.

The most efficient query plan depends on the actual value of the date parameter being supplied. When compiling the SP, SQL Server has to guess what values will be supplied and may choose the wrong plan. `OPTIMIZE FOR UNKNOWN` addresses this.