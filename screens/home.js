const _ = require('lodash');
const blessed = require('blessed');
const moment = require('moment');

const listGroup = require('../listGroup.js');

const utils = require('../lib/utils.js');

var transactionsPerDay = [];

function renderLine(t) {
  var amount = `${t.amount} ${utils.currencyT(t.currencyCode)}`;
  amount = t.amount > 0 ? `{green-fg}${amount}{/green-fg}` : `{red-fg}${amount}{/red-fg}`;

  return (['AA', 'AE', 'PT'].indexOf(t.type) !== -1) ? `${utils.cat2emoji(t.category)}${t.merchantName}{|}${amount}` : `${t.partnerName}{|}${amount}`
}

function renderDayLine(day) {
  return ` {bold}${moment(day, 'DD/MM/YYYY').format('ddd MMM YY')} `;
}

module.exports = {
  show: function (n26) {
    var list = listGroup({
      parent: n26.screen,
      label: ' {bold}{cyan-fg}Transactions{/cyan-fg}{/bold}',
      keys: true,
      tags: true,
      left: 'center',
      top: 0,
      width: '100%',
      height: '100%',
      border: 'line',
      style: {
        item: {
          hover: {
            bg: 'blue'
          }
        },
        selected: {
          bg: 'blue',
          bold: true
        }
      }
    });

    var bar = blessed.listbar({
      parent: n26.screen,
      bottom: 0,
      left: 0,
      right: 0,
      height: 'shrink',
      keys: true,
      autoCommandKeys: true,
      border: 'line',
      commands: {
        'Exit': {
          keys: ['q'],
          callback: function () {

          }
        },
        'Stats': {
          keys: ['s'],
          callback: function () {
            n26.openModal('stats', function () {
              // list.focus();
            });
          }
        }
      }
    });

    list.on('select', function (item, index, list) {
      n26.openModal('transaction', transactionsPerDay[list].transactions[index], function () {
        // list.focus();
      });
    });

    n26.account.transactions({})
      .then(trcts => {
        if (!trcts || !Array.isArray(trcts)) {
          n26.log('not trcts');
          n26.log(trcts);
          process.exit(1);
        }

        transactionsPerDay = _.map(_.groupBy(trcts, function (t) {
          return moment(t.visibleTS).format('DD/MM/YY');
        }), function (v, k) {
          var day = {
            title: renderDayLine(k),
            data: [],
            transactions: []
          }

          v.forEach(function (t) {
            day.data.push(renderLine(t));
            day.transactions.push(t);
          });

          return day;
        });

        list.setData(transactionsPerDay);

        list.focus();

        n26.screen.render();
      })
      .catch(n26.log);
  }
}
