//= require jquery
//= require jquery.table_tree
//= require jquery.tablednd_0_5
$(document).ready(function(){
  //sortable tables
	$('a.reorder').click(function(event) {
		event.preventDefault();
		var url = this.href
		TableTree.toggle($('table.list'), url);
		return false;
	});

  $('#add_product_button').click(function(event) {
    event.preventDefault();
    $('div.modal').omniWindow() // create modal
      .trigger('show'); // and show it
    return false;
  });

  $('#search-attributes .layout-slider input').each(function(index, value) {
    var sb = new SliderBar();
    sb.initialize(value);
  });


  // calculate next matching value from given set of options

});

