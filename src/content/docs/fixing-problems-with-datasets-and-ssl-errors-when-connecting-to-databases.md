---
title: Fixing problems with DataSets and SSL errors when connecting to databases
author: bsimmons
pubDate: 2019-04-17
description: "CHSR Wiki"
categories: ["HFNY"]
topic: Visual Studio
---

If you are unable to create TableAdapters in your DataSets because of an error about SSL, you have to modify your connection string.

Follow the steps below:

1. Find out which connection string you want to use for your TableAdapter.
2. Go to the connection string's location (probably in connections.config).
3. If the connection string has the TrustServerCertificate property already, ensure it is set to true.
  3a. If the connection doesn't have the property, update the connection string with the following text: TrustServerCertificate=True;
4. Check to see if you are using project settings for your TableAdapter connection string (you can tell this by looking at the TableAdapter wizard; if it says 'Settings' next to the connection string name then you are using project settings connection strings).
  4a. If you are using project settings, right-click on your project and click the Properties option.
  4b. Click the Settings option in the project properties.
  4c. Visual Studio should ask you if you want to update the .settings file, you want to choose Yes.
  4d. Visual Studio may ask you if you want to reload the location of your connection strings; choose Yes.

That should fix the SSL issue.  If it doesn't, ensure that updating your connection string is updating in the TableAdapter Configuration Wizard by showing the connection string in the wizard (see attached document).