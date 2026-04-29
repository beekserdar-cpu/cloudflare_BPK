# Cloudflare publicatie en contactformulier

Deze site gebruikt een Cloudflare Pages Function op `/contact` om het contactformulier per e-mail door te sturen naar `drrahim@live.be`.

## Benodigd in Cloudflare

1. Publiceer de map als Cloudflare Pages project.
2. Zorg dat `beekpsychokliniek.com` in Cloudflare DNS staat.
3. Activeer Cloudflare Email Routing of Email Sending voor het domein.
4. Verifieer `drrahim@live.be` als bestemming.
5. Zorg dat de `send_email` binding uit `wrangler.toml` beschikbaar is:

```toml
[[send_email]]
name = "CONTACT_EMAIL"
destination_address = "drrahim@live.be"
```

## Belangrijk

De afzender in `functions/contact.js` is `contact@beekpsychokliniek.com`. Cloudflare vereist dat de afzender bij het domein hoort waarvoor e-mail is geactiveerd.

Na een succesvolle inzending stuurt de functie de bezoeker door naar `bedankt.html`.
