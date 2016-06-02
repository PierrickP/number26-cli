const blessed = require('blessed');
const Number26 = require('number26');

module.exports = {
  show: function (n26) {
    const form = blessed.form({
      parent: n26.screen,
      keys: true,
      tags: true,
      left: 'center',
      top: 'center',
      width: 35,
      height: 16,
      content: '{center}Connexion to Number26{/center}',
      border: 'line'
    });

    const username = blessed.textbox({
      parent: form,
      keys: true,
      height: 3,
      width: 26,
      left: 'center',
      top: 3,
      border: 'line',
      label: 'Email',
      name: 'email'
    });

    const password = blessed.textbox({
      parent: form,
      keys: true,
      height: 3,
      width: 26,
      left: 'center',
      top: 6,
      border: 'line',
      label: 'Password',
      name: 'password',
      censor: '*'
    });

    const submit = blessed.button({
      parent: form,
      keys: true,
      shrink: true,
      padding: {
        top: 1,
        bottom: 1,
        left: 2,
        right: 2
      },
      left: 'center',
      top: 10,
      name: 'Login',
      content: 'submit',
      style: {
        bg: 'green',
        focus: {
          bg: 'red'
        }
      }
    });

    username.on('focus', function() {
      username.readInput();
    });

    password.on('focus', function() {
      password.readInput();
    });

    submit.on('press', function() {
      form.submit();
    });

    form.on('submit', function(data) {
      new Number26(data.email, data.password)
        .then((a) => {
          n26.account = a;

          form.destroy();
          n26.goTo('home');
        })
        .catch(n26.log);
    });

    username.focus();
    n26.screen.render();
  }
}
