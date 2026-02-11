---
title: Export Git Commits with Date via Git Extensions
author: cpapas
pubDate: 2021-03-23
description: "CHSR Wiki"
categories: ["HFNY"]
topic: git
---

Open Git Extensions.  Under Plugins choose "Release Notes Generator".  Put this code in 'git log arguments' text box.

--date=local --pretty=format:"%h - %ad, %ar : %s"