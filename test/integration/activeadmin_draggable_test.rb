require 'test_helper'

describe "activeadmin_draggable integration" do

  it "provides our_awesome js on asset pipeline" do
    visit '/assets/activeadmin_draggable.js'
    page.text.must_include "Test string"
    
    visit '/assets/jquery.tablednd_0_5.js'
    page.text.must_include "Test string"
    
    visit '/assets/jquery.table_tree.js'
    page.text.must_include "Test string"
  end

end
