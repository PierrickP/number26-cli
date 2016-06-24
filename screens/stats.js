const blessed = require('blessed');
const contrib = require('blessed-contrib');
const moment = require('moment');

const utils = require('../lib/utils.js');

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
      label: ' Statistics ',
      keys: true,
      tags: true,
      left: 'center',
      top: 'center',
      width: '90%',
      height: 'shrink',
      padding: {
        top: 1,
        right: 1,
        bottom: 1,
        left: 1
      },
      border: 'line'
    });

    var line = contrib.line({
      label: 'Balance account'
    });

    var amount = {
      x: [],
      y: []
    };

    details.append(line);

    var from = moment().subtract(2, 'w');
    var to = moment().toDate();
    n26.account.stats(from, to, 'days').then(function (stats) {

      stats.forEach(function (s) {
        amount.x.push(moment(s.from).format('DD/MM'));
        amount.y.push(s.amount);
      });

      line.setData([amount]);

      n26.screen.render();
    });

    n26.screen.key('escape', function() {
      background.destroy();
      n26.screen.render();

      cb();
    });

    n26.screen.render();
  }
}
