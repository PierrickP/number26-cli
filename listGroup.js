const blessed = require('blessed');
const Node = blessed.Node;
const List = blessed.List;
const ScrollableBox = blessed.ScrollableBox;

function ListGroup(options) {
  const self = this;

  if (!(this instanceof Node)) {
    return new ListGroup(options);
  }

  options = options || {};

  this.options = options;
  this.scrollable = true;

  this.alwaysScroll = true;

  this.scrollbar = {
    bg: 'white',
    ch: ' '
  };
  this.style = {
    scrollbar: {
      inverse: true
    }
  };

  ScrollableBox.call(this, options);

  this.on('keypress', function(ch, key) {
    if (key.name === 'up' || (options.vi && key.name === 'k')) {
      self.scroll(-1);
      self.up();
      self.screen.render();
      return;
    }
    if (key.name === 'down' || (options.vi && key.name === 'j')) {
      self.scroll(1);
      self.down();
      self.screen.render();
      return;
    }
    if (key.name === 'enter' || (options.vi && key.name === 'l' && !key.shift)) {
      self.enterSelected();
      return;
    }
  });
}

ListGroup.prototype.setData = function(data) {
  const self = this;
  var offset = 0;

  self.lists = [];
  self.selected = 0;

  data.forEach(function (group, idx) {
    var list = blessed.list({
      parent: self,
      label: '{bold}{cyan-fg}' + group.title + '{/cyan-fg}{/bold}',
      keys: true,
      tags: true,
      top: offset,
      // left: 'center',
      height: group.data.length + 2,
      // width: '100%',
      border: 'line',
      interactive: (!idx),
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

    self.lists.push(list);

    group.data.forEach(function (item) {
      list.add(item);
    });

    offset += group.data.length + 2;
  });
};

ListGroup.prototype.up = function(offset) {
  const self = this;
  offset = offset || 1;

  if (self.lists[self.selected].selected - offset < 0 && self.selected > 0) {
    self.lists[self.selected].interactive = false;
    self.selected--;
    self.lists[self.selected].interactive = true;
    offset = 0;
  }

  this.lists[this.selected].move(offset * -1);
};

ListGroup.prototype.down = function(offset) {
  const self = this;
  offset = offset || 1;

  if (self.lists[self.selected].selected + offset >= self.lists[self.selected].items.length && self.selected < self.lists.length - 1) {
    self.lists[self.selected].interactive = false;
    self.selected += 1;
    self.lists[self.selected].interactive = true;
    offset = 0;
  }

  self.lists[self.selected].move(offset);
};

ListGroup.prototype.enterSelected = function() {
  this.emit('select', this.lists[this.selected].items[this.selected], this.lists[this.selected].selected, this.selected);
};

ListGroup.prototype.__proto__ = ScrollableBox.prototype;

ListGroup.prototype.type = 'listGroup';

module.exports = ListGroup;
