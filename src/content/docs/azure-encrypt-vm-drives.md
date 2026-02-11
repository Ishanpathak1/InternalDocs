---
title: Azure - Encrypt VM Drives
author: dcacciotti
pubDate: 2019-03-05
description: "CHSR Wiki"
categories: ["HFNY"]
topic: azure
---

To encrypt all the hard drives on a Virtual Machine, follow these instructions,
https://docs.microsoft.com/en-us/azure/security/azure-security-disk-encryption-prerequisites

then, using Power Shell Run
$sequenceVersion = [Guid]::NewGuid();
 $rgName = 'MySecureRg';
 $vmName = 'MySecureVM';
 $KeyVaultName = 'MySecureVault';
 $KeyVault = Get-AzureRmKeyVault -VaultName $KeyVaultName -ResourceGroupName $rgname;
 $diskEncryptionKeyVaultUrl = $KeyVault.VaultUri;
 $KeyVaultResourceId = $KeyVault.ResourceId;

 Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $rgname -VMName $vmName -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId -VolumeType All –SequenceVersion $sequenceVersion;




If you've already set the OS drive to Encryption, but not the volume drives, change VolumeType All to VolumeType Data

--This lets you know the status of the encryption on your VM Machine
Get-AzureRmVMDiskEncryptionStatus -ResourceGroupName CSDA -VMName Framingham


--This disables all encryption
Disable-AzureRmVMDiskEncryption -ResourceGroupName 'CSDA' -VMName 'Framingham' -VolumeType "all"