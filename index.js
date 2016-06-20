#!/usr/bin/env node

'use strict';

const fs = require('fs');
const blessed = require('blessed');

const n26 = {
  previous: '',
  current: '',
  goTo: function (screen, details) {
    n26.previous = n26.current;
    n26.current = screen;

    require(`${__dirname}/screens/${screen}.js`).show(n26, details);
  },
  openModal(screen, details, cb) {
    require(`${__dirname}/screens/${screen}.js`).show(n26, details, cb || function(){});
  },
  screen: blessed.screen({
    warnings: true,
    debug: true
  }),
  log: (err) => {
    if (process.env.DEBUG === 'number26') {
      fs.appendFileSync('./debug.log', err + '\n');
    }
  }
};

n26.screen.key('q', function() {
  return n26.screen.destroy();
});

n26.goTo('auth');
