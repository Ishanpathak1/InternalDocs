---
title: 502 Login Error - All Applications
author: cpapas
pubDate: 2022-04-01
description: "CHSR Wiki"
categories: ["HFNY"]
topic: Tech Support
---

All our apps use the CHSR Membership system.  If a users login in the users table has a program that does NOT exist in the userinroles table (e.g. someone deleted it), the user will get an error 502 and not be able to login to the app.  Nothing wrong with their username or password, but that program # NEEDS to be changed to one that exists in the UsersInRoles table.