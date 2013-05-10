require 'test_helper'

describe "activeadmin_draggable integration" do

  it "provides our_awesome js on asset pipeline" do
    visit '/assets/activeadmin_draggable.js'
    page.text.must_include "TableTree.toggle($('table.list'), url);"
  end

end
