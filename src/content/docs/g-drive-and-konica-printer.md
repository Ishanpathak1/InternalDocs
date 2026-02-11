---
title: G Drive and Konica Printer
author: bsimmons
pubDate: 2019-05-13
description: "CHSR Wiki"
categories: ["HFNY"]
topic: Computer Set Up
---

G Drive:

1. Add a network drive that points to \\lincoln.univ.albany.edu\SSW\CHSR_Research.

Konica:

1. Go to G:\DDISS\KonicaDriver.

2. Copy the entire Win_x64 folder to your computer

3. Go to Printers & scanners and click the "Add device" button

4. Wait while the list populates until you see the "The printer that I want isn't listed" line.  Click the "Add manually" link.

5. Choose the "Add a printer using an IP address or hostname" option and click Next.

6. Change the device type to "Autodetect", enter 10.200.104.11 as the IP address, and ignore the port name field.  Uncheck the "Query the printer and automatically select the driver to use" checkbox.

7. Click the "Have Disk" option, click the "Browse..." button, and select the KOAYQW_.INF file that is contained in the Win_x64 file you copied in step #2.  Click "OK".

8. That should be it!  Print a test sheet to ensure that it worked.