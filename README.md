### TLDR

An open standards based payment network.

  > 📖 Open Source 💥 Experiment with ✱R.E.A.L. MONEY✱ 💶 
  
  > 🔥 S€PA.digital — Institut für Zahlungsverkehr
  
  > ☎️ [+43 27 4244 303](tel:+43274244303) 📮 [inbox@SEPA.digital](mailto:inbox+github@SEPA.digital?cc=rene.kapusta@gmail.com&subject=%F0%9F%93%A8%20Aloha%20via%20Github&body=%E2%9A%A1%20%23SEPAdigital%20%E2%80%94%20SOFORT.jetzt%20%E2%80%94%20%23hackSEPA%0D%0A%0D%0A%5B_%5D%20Beschwerde%20%E2%9C%B1%20%5B_%5D%20Feedback%20%E2%9C%B1%20%5B_%5D%20Frage%0D%0A%0D%0A-%20-%20-%20%E2%9C%82%EF%B8%8F%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%20-%0D%0A%0D%0A)
  
  > 📯 [S€PA.digital](https://SEPA.digital) c/o K42 Ventures OÜ, Europaplatz 42, 3100 Sankt Pölten 🇪🇺
  
  > 👩‍💻 Fork it, Fix it, Push it ✱ [#hackSEPA](https://twitter.com/search?q=hackSEPA&f=live) ✱ [#SCTInst](https://twitter.com/search?q=SCTInst&f=live) ✱ [2142+ supported PAN-EU-banks 🇪🇺](https://www.europeanpaymentscouncil.eu/sites/default/files/participants_export/sct_inst/sct_inst.pdf)

# [SOFORT.jetzt/spenden](https://SOFORT.jetzt/spenden) 

 * EU QR Code Format: [@European Payments Council (EPC)](https://www.europeanpaymentscouncil.eu/document-library/guidance-documents/quick-response-code-guidelines-enable-data-capture-initiation)
 * Raiffeisen ELBA-App Scan & Transfer: [@YouTube](https://youtu.be/FU_lcNUGza8)
 * EPC Code Scan @ bunq, holvi, VIMpay etc. [@Vimeo](https://vimeo.com/397164742)
 * Apple iOS Scan & Pay [@LinkedIn](https://linkedin.com/feed/update/urn:li:activity:6633873557892005888)

 * 🌐 [Ärzte ohne Grenzen @ Github](https://github.com/SEPAdigital/SOFORT.jetzt/tree/master/spenden/%C3%A4rzte-ohne-grenzen) 
 * 👩🏾‍⚕️ [JSON Linked Data Source Code](https://github.com/SEPAdigital/SOFORT.jetzt/blob/master/spenden/%C3%A4rzte-ohne-grenzen/index.html#L4) 

## HTML

Add the following HTML-Tags to any web page to accept SEPA credit transfers via SEPA.digital

```javascript
    <!--  ✱ ✱ ✱  Enable the S€PA.digital Payment Method in the browser ✱ ✱ ✱  -->
    <link href="https://SEPA.digital/pay/instant.json" rel="manifest" />

    <!--  ✱ ✱ ✱  Describe the recipient with https://schema.org/BankAccount ✱ ✱ ✱  -->
    <script id="SEPAdigital" data-type="application/ld+json">
        window.SEPAdigital.to = {
            "@context": "https://schema.org",
            "@type": "BankAccount",
            "iban": "AT43 2011 1289 2684 7600",
            "bic": "GIBAATWWXXX",
            "recipient": {
                "@type": "Organization",
                "legalName": "Ärzte ohne Grenzen - Médecins Sans Frontières österreichische Sektion",
                "alternateName": "Ärzte ohne Grenzen",
                "url": "https://aerzte-ohne-grenzen.at",
                "telephone": "+43 1 267 51 00",
                "seeAlso": "https://aerzte-ohne-grenzen.at/spenderservice",
                },
            },
            "bankAccountType": "SEPA.digital",
            "cashBack": 0,
            "contactlessPayment": true,
            "currency": "EUR",
            "itentifier": "https://citizen.bmi.gv.at/at.gv.bmi.fnsweb-p/zvn/public/Registerauszug/#517860631",
        }
    </script>
    
    <!--  ✱ ✱ ✱  Add an amount form field ✱ ✱ ✱  -->
    <input class="w3c-pr-amount-checkout" type="number" placeholder="Betrag in EUR" />

    <!--  ✱ ✱ ✱  Add the Payment Request API checkout button to the <body> ✱ ✱ ✱  -->
    <a class="w3c-pr-btn-checkout" href="#SEPAdigital/pay">
      Jetzt spenden
    </a>
    <div id="w3c-pr-msg" class="hide"></div>

    <!--  ✱ ✱ ✱  Add the S€PA.digital Payment Request API before </body> ✱ ✱ ✱  -->
    <script src="https://SEPA.digital/pay/cash.min.js"></script>
    <script src="https://SEPA.digital/pay/w3c-pr-api.js"></script>
    <script src="https://SEPA.digital/donate.js"></script>
 
    <!--  ✱ ✱ ✱  ✔️ S€PA.digital Pay is now ready #ZeroFees to accespt SCT TX ✱ ✱ ✱  -->
```

 > 👩🏾‍⚕️ HTML / JS @ [Ärzte ohne Grenzen](https://github.com/SEPAdigital/SOFORT.jetzt/blob/master/spenden/%C3%A4rzte-ohne-grenzen/index.html#L4) 🇦🇹 Spendenseite Sourcecode auf Github.

## API
 
 {tbd}
