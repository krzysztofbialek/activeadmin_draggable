// Test string

TableTree = {
  tableDnDOptions: {
    onDragClass: 'drag',
    onDragStart: function(table, row) {
      TableTree.startOffset = jQuery.tableDnD.mouseOffset.x;
      $(row).mousemove(TableTree.mousemove);
      if (node = $(row).ttnode()) node.dragStart();
    },
    onDrag: function(table, row) {
      TableTree.current_table.dirty = true;
      if (node = $(row).ttnode()) node.update_children();
    },
    onDrop: function(table, row) {
      $(row).unbind('mousemove', TableTree.mousemove);
      if (node = $(row).ttnode()) node.drop();
      TableTree.current_table.rebuild();
      TableTree.current_table.update_remote(row);
    },
    onAllowDrop: function(draggedRow, row, movingDown) {
      var node = $(row).ttnode();
      next = movingDown ? $(node.next_row_sibling()).ttnode() : node;
      if (next && (next.parent.level >= $(draggedRow).ttnode().level)) return false;
      return $(row).ttnode() ? true : false;
    }
  },
  toggle: function(table, remote_url) {
    TableTree.current_table ? TableTree.teardown(table) : TableTree.setup(table, remote_url);
  },
  setup: function(table, remote_url) {
    $('tbody', table).tableDnD(TableTree.tableDnDOptions);
    TableTree.current_table = new TableTree.Table($(table).get(0), remote_url);
    TableTree.current_table.setSortable();
  },
  teardown: function(table) {
    // TableTree.current_table.update_remote();
    jQuery.tableDnD.teardown(table);
    TableTree.current_table.setUnsortable();
    TableTree.current_table = null;
  },
  level: function(element) {
    var match = element.className.match(/level_([\d]+)/);
    return match ? parseInt(match[1]) : 0;
  },
  mousemove: function(event) {
    if (!TableTree.current_table.is_tree) return;

    var offset = jQuery.tableDnD.getMouseOffset(this, event).x - TableTree.startOffset;
    if(offset > 25) {
      TableTree.current_table.dirty = true;
      $(this).ttnode().increment_level(event);
    } else if(offset < -25) {
      TableTree.current_table.dirty = true;
      $(this).ttnode().decrement_level(event);
    }
  },
  Base: function() {},
  Table: function(table, remote_url) {
    this.is_tree = $(table).hasClass('tree')
    // If table has batch actions, show second column
    if ($("th:first input", table).length == 0) {
      this.shown_column_id = 0;
    } else {
      this.shown_column_id = 1;
    }
    this.table = table; //$('tbody', table)
    this.level = -1;
    this.remote_url = remote_url;
    this.rebuild();
  },
  Node: function(parent, element, level) {
    var _this = this;
    this.parent = parent;
    this.element = element;
    this.level = level;

    this.children = this.find_children().map(function() {
      var level = TableTree.level(this);
      if(level == _this.level + 1) { return new TableTree.Node(_this, this, level); }
    });
  }
}

TableTree.Base.prototype = {
  find_node: function(element) {
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      if (this.children[i].element == element) {
        return this.children[i];
      } else {
        var result = this.children[i].find_node(element);
        if (result) return result;
      }
    }
  }
}
TableTree.Table.prototype = jQuery.extend(new TableTree.Base(), {
  rebuild: function() {
    var _this = this;
    this.children = $('tr', this.table).map(function() {
      if(TableTree.level(this) == 0) { return new TableTree.Node(_this, this, TableTree.level(this)); }
    });
  },
  setSortable: function() {
    var self = this;
    $('tr', this.table).each(function() {
      // thead
      cells = $('th', this);
      cells.each(function(ix) {
        if(ix == self.shown_column_id) {
          this.setAttribute('colspan', cells.length - self.shown_column_id);
        } else {
          $(this).hide();
        }
      });

      // tbody
      cells = $('td', this);
      cells.each(function(ix) {
        if (ix == self.shown_column_id) {
          element = this;
          this.setAttribute('colspan', cells.length);
          $('a', this).click(function(event) {
            event.preventDefault();
            return false;
          })
        } else {
          $(this).hide();
        }
      });
    });
  },
  setUnsortable: function() {
    var self = this;
    $('tr', this.table).each(function(ix) {
      // thead
      cells = $('th', this);
      cells.each(function(ix) {
        if(ix == self.shown_column_id) {
          this.setAttribute('colspan', 1);
        } else {
          $(this).show();
        }
      });

      // tbody
      $('td', this).each(function(ix) {
        if(ix == self.shown_column_id) {
          $('img.spinner', this).remove();
          $('a', this).unbind("click")
          this.setAttribute('colspan', 1);
        } else {
          $(this).show();
        }
      });
    });
  },
  update_remote: function(row) {
    if(!this.dirty) return;
    this.dirty = false;
    _this = this;

    this.show_spinner(row);

    var dataArray = jQuery.extend(this.serialize(row), { '_method': 'put' });
    var csrfParam = $('meta[name=csrf-param]').attr('content');
    dataArray[csrfParam] = $('meta[name=csrf-token]').attr('content');
    $.ajax({
      type: "POST",
      url: this.remote_url,
      dataType: 'json',
      data: dataArray,
      success: function(msg) { _this.hide_spinner(row); },
      error:   function(msg) { _this.hide_spinner(row); }
    });
  },
  serialize: function(row) {
    var row = $(row).ttnode();
    var data = {};
    data['id'] = row.id() || '';
    data['parent_id'] = row.parent_id() || '0';
    data['left_id'] = row.left_id() || '0';
    return data;
  },
  show_spinner: function(row) {
    img = document.createElement('img');
    img.src = '/assets/indicator.gif';
    img.className = 'spinner';
    $('td', row)[0].appendChild(img);
  },
  hide_spinner: function(row) {
    cell = $('td', row)[0];
    cell.removeChild(cell.lastChild);
  }
});

TableTree.Node.prototype = jQuery.extend(new TableTree.Base(), {
  find_children: function() {
    var lvl = this.level;
    var stop = false;
    return this.row_siblings().slice(this.row_index() + 1).filter(function() {
      var level = TableTree.level(this);
      if(lvl == level) stop = true; // how to break from a jquery iterator?
      return !stop && lvl + 1 == level;
    });
  },
  depth: function() {
    if (this.children.length > 0) {
      return Math.max.apply(Math, this.children.map(function() { return this.depth() }).get());
    } else {
      return this.level;
    }
  },
  siblings: function() {
    return this.parent.children;
  },
  id: function() {
    return this.element ? this.to_int(this.element.id) : '0';
  },
  parent_id: function() {
    return this.parent.element ? this.to_int(this.parent.element.id) : '0';
  },
  left_id: function() {
    left = this.left()
    return left ? this.to_int(left.element.id) : '0';
  },
  left: function() {
    siblings = this.siblings().get();
    ix = siblings.indexOf(this);
    if(ix > 0) return siblings[ix - 1];
  },
  to_int: function(str) {
    if(str) return str.replace(/[\D]+/, '')
  },
  next_row_sibling: function () {
    return this.row_siblings()[this.row_index() + 1];
  },
  row_siblings: function() {
    if(!this._row_siblings) { this._row_siblings = $(this.element).parent().children(); }
    return this._row_siblings;
  },
  row_index: function() {
    return this.row_siblings().get().indexOf(this.element);
  },
  dragStart: function() {
    $(this.element).addClass('drag');
    this.children.each(function() { this.dragStart(); })
  },
  drop: function() {
    $(this.element).removeClass('drag');
    this.children.each(function() { this.drop(); })
    this.adjust_level();
  },
  increment_level: function(event) {
    var prev = $(this.element).prev().ttnode();
    if(!prev || prev.level < this.level || this.depth() >= 5) return;
    this.update_level(event, this.level + 1);
  },
  decrement_level: function(event) {
    if(this.level == 0) return;
    this.update_level(event, this.level - 1);
  },
  update_level: function(event, level) {
    if (event) TableTree.startOffset = jQuery.tableDnD.getMouseOffset(this.element, event).x;

    $(this.element).removeClass('level_' + this.level);
    $(this.element).addClass('level_' + level);

    this.level = level;
    this.children.each(function() { this.update_level(event, level + 1); });

    TableTree.current_table.dirty = true;
  },
  adjust_level: function() {
    var prev = $(this.element).prev().ttnode();
    if(!prev) {
      this.update_level(null, 0);
    } else if(prev.level + 1 < this.level) {
    // } else {
      this.update_level(null, prev.level + 1);
    }
  },
  update_children: function() {
    this.children.each(function() { this.element.parentNode.removeChild(this.element); });
    var _this = this;
    var _next = _this.element.nextSibling;
    this.children.each(function() { _this.element.parentNode.insertBefore(this.element, _next); });
    this.children.each(function() { this.update_children() });
  }
});

jQuery.fn.extend({
  ttnode: function() {
    var subject = this.push ? this[0] : this;
    return TableTree.current_table.find_node(subject);
  }
});

jQuery.extend(jQuery.tableDnD, {
  teardown: function(table) {
    jQuery('tr', table).each(function() { $(this).unbind('mousedown'); }).css('cursor', 'auto');
    jQuery.tableDnD.dragObject = null;
    jQuery.tableDnD.currentTable = null;
    jQuery.tableDnD.mouseOffset = null;
  }
});
