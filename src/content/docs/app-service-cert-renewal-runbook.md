---
title: Renewing an Azure App Service Certificate
author: Derek
pubDate: 2026-06-15
categories: [Azure, Infrastructure]
description: How to renew an Azure-managed App Service Certificate when it shows as expired, using Rekey and Sync.
---

# Renewing an Azure App Service Certificate

> ⚠️ **When an Azure-managed cert shows "expired," the fix is almost always `Rekey and Sync` — not placing a new order.**

## Overview

An Azure App Service Certificate is a certificate purchased and managed through the Azure Portal (issued by GoDaddy on Azure's behalf), stored in Azure Key Vault, and bound to one or more App Service web apps.

Because the cert is managed by Azure, the underlying order auto-renews on its own — Azure places the renewal and reissues the certificate automatically. When a cert shows as "expired" in the portal, the usual cause is **not** a failed order. It is that the newly issued cert hasn't propagated to Key Vault and the app binding yet. The fix is `Rekey and Sync`.

## Before You Start

Gather these details before making changes.

| Field | Where to find it |
|-------|------------------|
| Certificate name | App Service Certificates list |
| Resource Group | Certificate Overview blade |
| Subscription | Certificate Overview blade |
| Issuer | Certificate Details |
| Subject / host names | Certificate Details |
| Key Vault Secret Name | Certificate Details (Key Vault binding) |
| Bound web app(s) | App Service → TLS/SSL settings → Bindings |

## The Fix: Rekey and Sync

1. In the Azure Portal, search the top bar for `App Service Certificates` and open the certificate. Use the certificate *order* resource, not the per-app Certificate Details panel.
2. Open the `Rekey and Sync` blade.
3. Click `Sync`. This pushes the current Azure-issued cert into Key Vault and updates the app binding. In most cases this alone clears the "expired" state.
4. If `Sync` alone doesn't resolve it, click `Rekey` to generate a new key pair, wait for it to complete, then `Sync` again.
5. Verify the binding (next section).

## Verify the Binding on the Web App

1. Go to the App Service (web app) resource that uses the cert.
2. Open `Settings → Certificates`, or `TLS/SSL settings → Bindings` in the older UI.
3. Confirm a TLS/SSL binding exists for each host name pointing at the renewed cert. App Service Certificates usually update the binding automatically after sync. If a binding still shows the old or expired thumbprint, delete it and re-add it pointing at the new cert.
4. Browse to the site over HTTPS and confirm the browser shows a valid cert with the new expiration date.
5. Repeat for any other web apps bound to the same cert.

## Keeping It Healthy

- `Auto Renew` should stay **ON** on the App Service Certificate. Azure attempts renewal roughly 30 days before expiry, and because these are Azure-managed, this is what keeps the order itself current.
- Keep billing on the subscription healthy. A failed payment method can silently block auto-renewal.
- Keep Key Vault access intact for the App Service resource provider so auto-renewals can write the new cert. The App Service service principal needs Get/List on Key Vault secrets and certificates.
- Set a calendar reminder about 45 days before the next expiration. If the cert shows expired again, the fix is the same: `Rekey and Sync`.

## Troubleshooting

- **"Certificate has expired" persists after Sync.** Try `Rekey`, then `Sync` again.
- **Key Vault secret status is not "Succeeded".** App Service can't read the cert. Re-check the Key Vault access policy or RBAC for the Microsoft Azure App Service principal, then `Sync` again.
- **Binding still serves the old cert after Sync.** Clear it manually in TLS/SSL Bindings and re-bind to the new thumbprint.

## Important Notes

- An expired Azure-managed cert is usually a sync problem, not a failed order.
- The fix is `Rekey and Sync`, with `Rekey` as the fallback if `Sync` alone doesn't work.
- Always verify the TLS/SSL binding on each bound web app after syncing.
- Keep `Auto Renew` on and the subscription billing current to prevent recurrence.
- Key Vault access for the App Service principal must stay intact for auto-renewal to succeed.
