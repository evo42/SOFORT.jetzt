$(document).ready(function ($) {
  var userSlug, txInit, userDisplayName, userName, userId, txAmount = 0,
    txCheckInt, txCheckCount = 0,
    txSendAwaiting, icon = $('.w3c-pr-btn-checkout i'),
    currentTs = Math.floor(Date.now() / 1000),
    timeoutID1, timeoutID2, sd, txCheckCount = 0,
    that, postalcodes, displayDate = formatDate(),
    txAwaiting = JSON.parse(localStorage.getItem('txAwaiting'));
  window.SEPAdigitalTxId = false;
  $('#todayDate span').text(displayDate);
  if (txAwaiting && txAwaiting.id != '') {
    if (txCheckInt) {
      clearInterval(txCheckInt)
    }
    txCheckInt = setInterval(function () {
      txAwaitingCheck(txAwaiting)
    }, 3 * 1000);
    if (txAwaiting.status == 'payment_settled' || txAwaiting.status == 'payment_signed') {
      console.log('-- tx success from localstorage');
      clearInterval(txCheckInt);
      $('#payment-section').hide();
      localStorage.removeItem('txAwaiting');
      localStorage.setItem('txLastPaid', JSON.stringify(txAwaiting))
    } else if (txAwaiting.status == 'created') {
      $('#payment-section').show();
      $('#sepa-qr-code').hide();
      $('#sepa-pay-success').show();
      $('#sepa-pay-success i').removeClass().addClass('fas fa-circle-notch fa-spin');
      $('.hide-while-txAwaitReload').hide();
      if (icon.length > 0) {
        icon.removeClass().addClass('fas fa-circle-notch fa-spin')
      }
    }
  } else {}
  let xhr = new XMLHttpRequest();
  xhr.open("GET", '/data/postalcode.at.json');
  xhr.send();
  xhr.responseType = 'json';
  xhr.onload = function () {
    var d = xhr.response,
      s = xhr.status;
    console.log('response postalcode.at', d);
    if (d && d.message == "OK") {
      postalcodes = d.data
    }
  };
  xhr.onerror = function () {
    console.log('ERROR get postalcode.at', xhr.error)
  };

  function startAboInitRequest() {
    var currentTs = Math.floor(Date.now() / 1000),
      email, phone;
    window.SEPAdigitalTxId = false;
    if (icon.length > 0) {
      icon.removeClass().addClass('fas fa-circle-notch fa-spin');
    }
    if ($('#userId').length > 0 && $('#userId').val().trim().indexOf('@')) {
      email = $('#userId').val().trim()
    } else if ($('#userId').length > 0 && $('#userId').val().trim().indexOf('+')) {
      phone = $('#userId').val().trim()
    }
    window.SEPAdigitalTxId = false;
    let amountInput = $('#amount').val() || 1;
    let amount = parseFloat(parseFloat(amountInput + ''.replace(',', '.').trim(), 10).toFixed(2), 10),
      ibanTo = window.SEPAdigital.to.iban.replace(/\s/g, '') || '',
      bicTo = window.SEPAdigital.to.bic || '',
      nameTo = window.SEPAdigital.to.recipient.alternateName || '',
      ref = window.SEPAdigital.to.reason || '';
    txAwaiting = {
      correlationId: 'SOFORT.jetzt-' + ibanTo + '-' + ref.replace(/\W+/g, '') + '-' + currentTs,
      iban: ibanTo,
      bic: bicTo,
      amount: amount,
      name: nameTo,
      customerId: '',
      reference: ref,
      userPhone: phone,
      userEmail: email,
      sender: window.SEPAdigital.from,
    };
    console.log('send awaiting tx', txAwaiting);
    localforage.setItem('txAwaiting', JSON.stringify(txAwaiting));
    if (window.txCheckInt) {
      clearInterval(window.txCheckInt)
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://api.sepa.digital/credit-transfer');
    xhr.send(JSON.stringify(txAwaiting));
    xhr.responseType = 'json';
    xhr.onload = function () {
      console.log('--- response awaiting tx', xhr.response || 'ERROR no response data');
      var pr = xhr.response;
      var that = this;
      console.log(' *** new tx data', pr['_links']);
      window.SEPAdigitalTxId = pr.uuid;
      if (pr && pr['_links'] && pr['_links'].payment) {
        this.tx = this.txSent = this.txAwaiting = pr;
        this.qrcodeUrl = pr['_links'].qrcodeUrl;
        localforage.setItem('txAwaiting', JSON.stringify(pr));
        window.txCheckInt = setInterval(function () {
          txAwaitingCheck(pr)
        }, 1500);
        var clipboard = new ClipboardJS('#txShortUrl', {
          text: function (trigger) {
            return pr['_links'].shortUrl
          }
        });
        $('#shortUrl').val(pr['_links'].shortUrl);
        $('#phonePass').val(window.SEPAdigital.from.phone);
        clipboard.on('success', function (e) {
          console.log('-- added shortUrl to the clipboard', pr['uuid'], e)
        });
        $('#SEPAdigitalPRform').hide();
        $('#SEPAdigitalPRshop').hide();
        $('#SEPAdigitalPRcheckout').show();
        $('#SEPAdigitalPRcode').show();
        $('#SEPAdigitalPRcode img').attr('src', pr['_links'].qrcode);
        $('#SEPAdigitalPRcode h2').text('🏪   ' + pr['name_to']);
        $('#SEPAdigitalPRcode h1').html('💶   &nbsp;€ ' + parseFloat(pr['amount'], 10).toFixed(2).replace('.', ',') + ' <i style="margin-left: 12px" class="fas fa-circle-notch fa-spin hide-print has-text-info"></i>');
        $('#SEPAdigitalPRcode h4').html('🧾   KOBUK Spende NoFakeNews');
        $('#SEPAdigitalPRcode h3 small').html('💳   IBAN: ' + pr['iban_to']);
        $('#SEPAdigitalPRcode h5 small').html('🌐   Transfer-ID: <a href="https://SEPA.id/' + pr['shortId'] + '" target="_blank">SEPA.id/' + pr['shortId'] + '</a>')
      } else {
        console.log('**** ERROR on create payment request ***')
      }
    };
    xhr.onerror = function () {
      console.log('ERROR init EPC QR', error);
    }
  }
  $('input, select').on('change', function (e) {
    console.log(e, $(this).attr('id'));
    let eId = $(this).attr('id'),
      aboType = null,
      phone = ($('#phone').val() && $('#phone').val().trim()) || '',
      email = ($('#email').val() && $('#email').val().trim()) || '',
      inputName = ($('#memberName').val() && $('#memberName').val().trim()) || '',
      postalCode = ($('#postalCode').val() && $('#postalCode').val().trim()) || '',
      streetAddress = ($('#streetAddress').val() && $('#streetAddress').val().trim()) || '',
      addressLocality = ($('#addressLocality').val() && $('#addressLocality').val().trim()) || '',
      postalcodes,
      amountDisplay = '0',
      displayName = '';
    if (!eId || eId.length < 1) {
      return false
    }
    $('.radioAmount').each(function () {
      if ($(this).prop('checked') === true) {
        aboType = $(this).val();
        amountDisplay = parseFloat($(this).data('amount'), 10).toFixed(2).replace('.', ',');
        console.log('--', aboType)
      }
      console.log($(this).prop('checked'))
    });
    if (eId == 'memberName') {}
    displayName = displayName.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    if (aboType && aboType.length > 1) {
      switch (aboType) {
        case "Familie":
          displayName += aboType + ' ';
          break
      }
    }
    displayName += inputName;
    if (phone && phone.length > 1 && phone.match(/^\d/) && !phone.startsWith(0)) {
      phone = '+43' + phone.replace(/\D/g, '')
    }
    if (phone && phone.length > 1 && phone.substring(0, 2) == '00') {
      phone = '+' + phone.substring(2, phone.length).replace(/\D/g, '')
    }
    if (phone && phone.length > 1 && phone.substring(0, 1) == '0') {
      phone = '+43' + phone.substring(1, phone.length).replace(/\D/g, '')
    }
    if (phone && phone.length > 1 && phone.substring(0, 1) == '+') {
      phone = '0' + phone.substring(3, phone.length).replace(/\D/g, '')
    }
    if (phone && phone.length > 1 && phone.substring(0, 2) == '00') {
      phone = '' + phone.substring(1, phone.length).replace(/\D/g, '')
    }
    if (email && email.length > 1 && email.indexOf('@') > 0) {
      email = email.trim().toLowerCase()
    }

    if (amountDisplay == '0,00' || amountDisplay == '0') {
      amountDisplay = ''
      $('.w3c-pr-btn-checkout').attr('disabled', true);
    } else if (!inputName || inputName == '' || inputName.length < 3) {
      $('.w3c-pr-btn-checkout').attr('disabled', true);
    } else if ((!phone || phone == '' || phone.length < 3) && (!email || email == '' || email.length < 3)) {
      $('.w3c-pr-btn-checkout').attr('disabled', true);
    } else {
      $('.w3c-pr-btn-checkout').removeAttr('disabled');
    }

    if (postalcodes && postalcodes.length > 3 && postalCode.length > 3) {
      let obj = postalcodes.find(obj => obj.plz == parseInt(postalCode.trim(), 10));
      addressLocality = obj.ort
    }

    $('#address [property="name"]').html(displayName);
    $('#address [property="streetAddress"]').html(streetAddress);
    $('#address [property="postalCode"]').html(postalCode);
    $('#address [property="addressLocality"]').html(addressLocality);
    $('#phone').val(phone);
    $('#amount').val(amountDisplay);

    if (aboType && aboType.length > 2) {
      $('#aboType strong').text(aboType)
    }

    window.SEPAdigital.from = {
      "amount": parseFloat(amountDisplay.replace(',', '.'), 10).toFixed(2),
      "amountDisplay": amountDisplay,
      "aboType": aboType,
      "name": displayName,
      "streetAddress": streetAddress,
      "postalCode": postalCode,
      "addressLocality": addressLocality,
      "email": email,
      "phone": phone.replace('0', '+43'),
      "displayName": displayName
    }
  });
  $('#aBuchAboType').on('change', function (e) {
    let aboType = $(this).val().trim(),
      amountDisplay = parseFloat($($(this)[0].selectedOptions).data('amount'), 10).toFixed(2).replace('.', ',');
    $('#amount').val(amountDisplay);
    if ($('#memberName').val().trim().length > 3) {
      window.SEPAdigital.to.reason = aboType + ' - ' + slugify($('#memberName').val())
    }
  });
  $('#userId').on('blur', function (e) {
    var userId = $(this).val().trim();
    var icon = $('#btn-sepa-instant-pay i');
    icon.removeClass().addClass('fas fa-chevron-circle-right');
    $('#btn-sepa-eu-pay').hide();
    $('#btn-sepa-instant-pay').show();
    $('#userName').attr('disabled', false)
  });
  $('#userName').on('keyup', function (e) {
    userSlug = slugify($(this).val());
    if (userSlug.length < 3) {
      $('#userId').val('');
      $('#eSEPA').text('')
    }
  });

  function txAwaitingCheck(tx) {
    let that = this;
    console.log('### txAwaitingCheck', tx);
    if (txCheckCount > 250) {
      clearInterval(txCheckInt);
      return
    }
    if (!tx.uuid) {
      clearInterval(txCheckInt);
      localStorage.removeItem('txAwaiting');
      return
    }
    let xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://api.sepa.digital/v1/tx/' + tx.uuid);
    xhr.send();
    xhr.responseType = 'json';
    xhr.onload = function () {
      var pr = xhr.response,
        d = pr,
        s = xhr.status;
      console.log('response awaiting tx', pr);
      console.log('- tx check', txCheckCount, s, d);
      txCheckCount += 1;
      if (d.status == 'payment_settled' || d.status == 'payment_signed') {
        console.log('-- tx success');
        clearInterval(that.txCheckInt);
        this.tx = pr;
        localforage.removeItem('txAwaiting');
        localforage.setItem('txLastPaid', JSON.stringify(txAwaiting));
        $('#SEPAdigitalPRform').hide();
        $('#SEPAdigitalPRcode').hide();
        $('#SEPAdigitalPRshop').hide();
        $('#SEPAdigitalPRcheckout').show();
        $('#SEPAdigitalPRsuccess').show();
        $('#SEPAdigitalPRcode h1 i').removeClass().addClass('far fa-check-circle has-text-success')
      } else if (d.status == 'created') {} else {}
    };
    xhr.onerror = function () {
      console.log('ERROR get TX status', xhr.error);
    };
  }
  $('.btn-tx').on('focus', function () {
    var that = this;
    var clipboard = new ClipboardJS('#' + $(this).attr('id'), {
      text: function (trigger) {
        return $(trigger).val().replace('€ ', '')
      }
    });
    clipboard.on('success', function (e) {
      var tt = tippy('#' + $(that).attr('id'), {
        content: '✓ &nbsp;"' + e.text + '" copied.'
      });
      setTimeout(() => {
        const button = document.querySelector('#' + $(that).attr('id'));
        const instance = button._tippy;
        instance.show();
        setTimeout(() => {
          instance.destroy(true)
        }, 2000)
      });
      e.clearSelection()
    })
  });
  window.prInitTx = function () {
    startAboInitRequest()
  };
  window.txSendAwaiting = txSendAwaiting
});

function slugify(string) {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
  const p = new RegExp(a.split('').join('|'), 'g');
  return string.toString().toLowerCase().replace(/\s+/g, '-').replace(p, c => b.charAt(a.indexOf(c))).replace(/&/g, '-and-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function formatDate(date) {
  if (!date) {
    date = new Date()
  }
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }
  return [day, month, year].join('.')
}