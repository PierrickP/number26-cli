const _ = require('lodash');
const blessed = require('blessed');
const moment = require('moment');

const listGroup = require('../listGroup.js');

const utils = require('../lib/utils.js');

var transactions = [];

function renderLine(t) {
  var amount = `${t.amount} ${utils.currencyT(t.currencyCode)}`;
  amount = t.amount > 0 ? `{green-fg}${amount}{/green-fg}` : `{red-fg}${amount}{/red-fg}`;

  return (['AA', 'AE', 'PT'].indexOf(t.type) !== -1) ? `${t.merchantName}{|}${amount}` : `${t.partnerName}{|}${amount}`
}

function renderDayLine(day) {
  return `\t{bold}${moment(day, 'DD/MM/YYYY').format('ddd MMM YY')}`;
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
        }
      }
    });

    list.on('select', function (item, index) {
      n26.openModal('transaction', transactions[index], function () {
        list.focus();
      });
    });

    n26.account.transactions({})
      .then(trcts => {
        if (!trcts || !Array.isArray(trcts)) {
          n26.log('not trcts');
          n26.log(trcts);
          process.exit(1);
        }

        transactions = trcts;

        var transactionsPerDay = _.map(_.groupBy(transactions, function (t) {
          return moment(t.visibleTS).format('DD/MM/YY');
        }), function (v, k) {
          var day = {
            title: renderDayLine(k),
            data: []
          }

          v.forEach(function (t) {
            day.data.push(renderLine(t));
          });

          return day;
        });

        n26.log(require('util').inspect(transactionsPerDay, {depth: null}))

        list.setData(transactionsPerDay);

        list.focus();

        n26.screen.render();
      })
      .catch(n26.log);
  }
}
