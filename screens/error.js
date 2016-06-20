const blessed = require('blessed');
const moment = require('moment');

const utils = require('../lib/utils.js');

function renderContent(err) {
  if (err.error_description) {
    return `{bold}${err.error_description}{/bold}`;
  }

  return JSON.stringify(err);
}

module.exports = {
  show: function (n26, error, cb) {
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
      keys: true,
      tags: true,
      left: 'center',
      top: 'center',
      padding: {
        top: 2,
        right: 2,
        bottom: 2,
        left: 1
      },
      style: {
        bg: 'red',
        fg: 'white'
      },
      width: 'shrink',
      height: 'shrink',
      border: 'line',
      content: renderContent(error)
    });

    n26.screen.key('escape', function() {
      background.destroy();
      n26.screen.render();
      cb()
    });

    n26.screen.render();
  }
};
