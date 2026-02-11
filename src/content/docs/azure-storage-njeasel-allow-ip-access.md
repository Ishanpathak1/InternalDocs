---
title: Azure Storage - NJEasel - Allow IP Access
author: cpapas
pubDate: 2019-10-24
description: "CHSR Wiki"
categories: ["HFNY"]
topic: azure
---

For the NJ Easel project we are using Azure Blob Storage to allow them to download the databases in bacpac format.
To do this, follow these procedures.

<p>
1. Go to a storage account.  In this case I'm using HFONLINESTORE - Containers. <p>

<p>
2. Click on Containers in the left hand menu and click the + Container at the top.  NJEasels container is already created and is called "njeasel", so you can just click on it.<p>
<p>

3. In the container, upload any documents you want to share using the 'Upload' link at the top.<p>


4. Click the three dots "..." at the very right of the file row (after 'Lease state' column).<p>

5. Choose 'Generate SAS'<p>

6. Under Permissions, allow READ and WRITE.  Type in IP address in 'Allowed IP addresses'.<p>

7. Save and click on "Generate blob SAS token and URL"<p>

8. Copy the https URL generated and send to the client.<p>