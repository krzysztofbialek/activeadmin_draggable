require 'test_helper'
include ActiveadminDraggable


describe ActiveadminDraggable do
  
  describe 'draggable list item' do
    before do
      @item1 = Item.create(:name => 'test', :position => 1)
      @item2 = Item.create(:name => 'test2', :position => 2)
    end
    
    it 'changes position with move method'  do
      assert_equal 1, @item1.position

      DraggableListItem.move(Item, @item2.id, 0)    

      assert_equal 2, @item1.reload.position

    end
  end
end
  

