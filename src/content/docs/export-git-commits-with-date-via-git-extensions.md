---
title: Export Git Commits with Date via Git Extensions
author: cpapas
pubDate: 2021-03-23
description: "CHSR Wiki"
categories: ["HFNY"]
topic: git
---

Open Git Extensions.  Under Plugins choose &quot;Release Notes Generator&quot;.  Put this code in &#39;git log arguments&#39; text box.

--date=local --pretty=format:&quot;%h - %ad, %ar : %s&quot;