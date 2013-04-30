//= require jquery
//= require activeadmin_draggable/jquery.table_tree
//= require activeadmin_draggable/jquery.tablednd_0_5

$(document).ready(function(){
  //enabling and disaabling reorder mode of resources table
	$('a.reorder').click(function(event) {
		event.preventDefault();
    var link = $(this)
		var url = this.href
		TableTree.toggle($('table.list'), url);
    if (link.text() == link.data('on_text')){
      link.text(link.data('off_text'));
    } else {
      link.text(link.data('on_text'));
    }

		return false;
	});

});

