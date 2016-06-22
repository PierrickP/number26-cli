const blessed = require('blessed');
const moment = require('moment');

const utils = require('../lib/utils.js');

var transactions = [];

function getAmount(amount, currency) {
  return (amount > 0) ? `{green-fg}${amount} ${utils.currencyT(currency)}{/green-fg}` : `{red-fg}${amount} ${utils.currencyT(currency)}{/red-fg}`;
}

function getOriginalAmount(d) {
  return `${trans.originalAmount || trans.externalAmount} ${trans.originalCurrency || trans.externalCurrencyCode} → ${trans.amount}`;
}

function estimateArrival(d) {
  return `{bold}Reception Date:{/bold} ${moment(trans.externalReceiptTS).format('DD/MM/YYYY')}`;
}

function renderContent(trans) {
  var s = `{bold}${trans.merchantName || trans.partnerName}{/bold}{|}${getAmount(trans.amount, trans.currencyCode)}`;

  if (trans.externalReceiptTS) {
    s += `\n${estimateArrival(trans)}`;
  }

  if (trans.referenceText) {
    s += `\n{bold}Reference:{/bold} ${trans.referenceText}`;
  }

  if (trans.originalCurrency && trans.originalCurrency != 'EUR' || trans.externalCurrencyCode) {
    s += `\n${trans.getOriginalAmount()}`;
  }

  if (trans.partnerIban && ['WU', 'BBU', 'BUB', 'DI', 'TUB'].indexOf(trans.type) === -1) {
    s += `\n${trans.partnerIban}`;

    if (trans.partnerBic) {
      s += ` ${trans.partnerBic}`;
    }
  }

  if (trans.labels) {
    s += `\n${trans.labels.map((label) => `${label.value} ${label.label}`).join(' | ')}`;
  }

  if (trans.memo) {
    s += `\n${trans.memo}`
  }

  return s.trim();
}

function getCategory(category, categories) {
  if (category) {
    category = categories.find((c) => c.id === category);
    if (category) {
      return ` ${category.name} `;
    }
  }
}

function getLabel(n26, transaction) {
  return `{bold}{cyan-fg} Transaction{/cyan-fg}{/bold}${getCategory(transaction.category, n26.categories)}`;
}

module.exports = {
  show: function (n26, transaction, cb) {
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
      label: getLabel(n26, transaction),
      keys: true,
      tags: true,
      left: 'center',
      top: 'center',
      width: 40,
      height: 'shrink',
      padding: {
        top: 1,
        right: 1,
        bottom: 1,
        left: 1
      },
      border: 'line',
      content: renderContent(transaction)
    });

    n26.screen.key('up', function() {
      background.destroy();
      n26.screen.render();
      cb()
    });

    n26.screen.key('down', function() {
      background.destroy();
      n26.screen.render();
      cb()
    });

    n26.screen.key('escape', function() {
      background.destroy();
      n26.screen.render();
      cb()
    });

    n26.screen.render();
  }
}
