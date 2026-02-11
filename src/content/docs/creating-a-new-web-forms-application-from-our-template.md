---
title: Creating a new Web Forms application from our template
author: bsimmons
pubDate: 2019-05-14
description: "CHSR Wiki"
categories: ["HFNY"]
topic: Visual Studio
---

CLONING:
1. Create a new Repository on GitHub.com  -   for this example I will call the new repository MYProject.sql
2. Open Git Bash on your desktop computer.
3. Create a bare clone of the repository: $ git clone --bare https://github.com/chsr/NewApplicationTemplate.sql.git
4. Go to the cloned template repository: $ cd NewApplicationTemplate.sql.git
5. Push the cloned template to the your new repository - $ git push --mirror https://github.com/chsr/MYProject.sql.git

Database:
  1.	SEE 'CLONING' Above
  2.	Create a new database and link it to that repository.
  3.	Get the latest and add rows to the Program and ProgramRole tables.
  4.	After step #12 in the Application section, add a row to the UserProgramRole table with the username for the created user.

Application:
ONLY COMPLETE STEPS 1-4 IF YOU DO NOT HAVE THE TEMPLATE ALREADY
  1.	Clone NewApplicationTemplate from GitHub to your GitHub Desktop
  2.	Copy the NewApplicationTemplate.zip file from the VSTemplate folder that is located at the same level as the NewApplicationTemplate.sln file in the repository folder.
  3.	Paste the .zip folder into your Visual Studio project templates folder.  (Usually Documents > Visual Studio 2017 > Templates > ProjectTemplates)
  4.	If Visual Studio is open, close it.
  5.	Open Visual Studio and create a new project.
  6.	The NewApplicationTemplate should be an option for project type; select it.
  7.	Change the connection strings in the connections.config file to point to the correct databases. (The Identity database will auto-generate when you run the app, just change the Identity connection string to the name of the database that you want to be generated)
  8.	Add the necessary values to the appSettings.config file.
  9.	Run this code in the NuGet package manager console: Update-Package Microsoft.CodeDom.Providers.DotNetCompilerPlatform –r
  10.	Change the web.config in the Account folder to allow unauthenticated users to access Register.aspx.
  11.	Run the application and navigate to the Register.aspx page.
  12.	Create a user using this page.
  13.	Go to step #4 in the Database section.
  14.	You should now be able to log in to the new app.
  15.	Update the JavaScript and CSS if necessary.