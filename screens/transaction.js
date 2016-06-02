const blessed = require('blessed');
const moment = require('moment');

const utils = require('../lib/utils.js');

var transactions = [];

function renderContent(d) {
  var s;

  if (d.type === 'PT') {
    s =
`{bold}${d.merchantName}{/bold}{|}{red-fg}${d.amount} ${utils.currencyT(d.currencyCode)}{/red-fg}
{bold}${utils.categoryT(d.category)}{/bold}
${d.amount} ${utils.currencyT(d.currencyCode)}`;
  } else if (d.type === 'CT') {
    s =
`{bold}${d.partnerName}{/bold}{|}{green-fg}${d.amount} ${utils.currencyT(d.currencyCode)}{/green-fg}
{bold}${utils.categoryT(d.category)}{/bold}
${moment(d.visibleTS).format('ddd MMM YYYY HH:mm')}

{bold}iban{/bold} ${d.partnerIban}
{bold}bic{/bold} ${d.partnerBic}
{bold}ref{/bold} ${d.referenceText}`;
  } else if (d.type === 'DT') {
    s =
`{bold}${d.partnerName}{/bold}{|}{red-fg}${d.amount} ${utils.currencyT(d.currencyCode)}{/red-fg}
{bold}${utils.categoryT(d.category)}{/bold}
${moment(d.visibleTS).format('ddd MMM YYYY HH:mm')}

{bold}Message{/bold} ${d.referenceText}
{bold}IBAN{/bold} ${d.partnerIban}`;
  } else {
    s = JSON.stringify(s, 2)
  }

  return s; // JSON.stringify(d, 2)
}

module.exports = {
  show: function (n26, transaction, cb) {
    n26.log(transaction)
    var background = blessed.box({
      parent: n26.screen,
      keys: true,
      width: '100%',
      height: '100%',
      style: {
        transparent: true,
        bg: 'back'
      }
    });

    var details = blessed.box({
      parent: background,
      label: '{bold}{cyan-fg} Transaction {/cyan-fg}{/bold}',
      keys: true,
      tags: true,
      left: 'center',
      top: 'center',
      width: 40,
      height: 20,
      padding: {
        top: 1,
        right: 1,
        bottom: 1,
        left: 1
      },
      border: 'line',
      content: renderContent(transaction)
    });

    n26.screen.key('escape', function() {
      background.destroy();
      n26.screen.render();
      cb()
    });

    n26.screen.render();
  }
}
