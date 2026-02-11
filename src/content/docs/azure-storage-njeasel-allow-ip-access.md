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

&lt;p&gt;
1. Go to a storage account.  In this case I&#39;m using HFONLINESTORE - Containers. &lt;p&gt;

&lt;p&gt;
2. Click on Containers in the left hand menu and click the + Container at the top.  NJEasels container is already created and is called &quot;njeasel&quot;, so you can just click on it.&lt;p&gt;
&lt;p&gt;

3. In the container, upload any documents you want to share using the &#39;Upload&#39; link at the top.&lt;p&gt;


4. Click the three dots &quot;...&quot; at the very right of the file row (after &#39;Lease state&#39; column).&lt;p&gt;

5. Choose &#39;Generate SAS&#39;&lt;p&gt;

6. Under Permissions, allow READ and WRITE.  Type in IP address in &#39;Allowed IP addresses&#39;.&lt;p&gt;

7. Save and click on &quot;Generate blob SAS token and URL&quot;&lt;p&gt;

8. Copy the https URL generated and send to the client.&lt;p&gt;