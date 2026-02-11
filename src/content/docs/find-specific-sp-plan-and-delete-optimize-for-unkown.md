---
title: Find Specific SP Plan and Delete & Optimize for Unkown
author: dcacciotti
pubDate: 2019-03-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: HFNY
---

To find and delete a specific Stored Procedure cached query execution plan, do the following:

Run the Select:
use HFNY;

select [text], cp.size_in_bytes, plan_handle
FROM sys.dm_exec_cached_plans AS cp
CROSS APPLY sys.dm_exec_sql_text(plan_handle)
WHERE cp.cacheobjtype = N'Compiled Plan'
AND cp.objtype = N'Adhoc'
AND cp.usecounts = 1
and  [text] like '%ctePC1AgeAtIntake%'  --This is unique text inside the specific Stored Procedure you want to find
ORDER BY cp.size_in_bytes DESC;

Next run this code
use hfny;
dbcc freeproccache(Insert plan name from above - its a really long number)

OR TO JUST CLEAR EVERYTHING ON THE DBASE
DBCC FREEPROCCACHE
DBCC DROPCLEANBUFFERS

Also, to speed up stored procedures, use this code OPTION (OPTIMIZE FOR (@parameter1 UNKNOWN, @parameter UNKNOWN, etc))
The problem is that, the most efficient query plan depends on the actual value of the date paramter being supplied. When compiling the SP, sql server has to make a guess on what actual values will be supplied, and it is likely making the wrong guess here. OPTIMIZE FOR UNKNOWN is meant for this exact problem.