module ActiveadminDraggable
  class DraggableListItem
       
    #method that given any resource class changes possition
    #of an item according to params passed by javascript sorting action

    def self.move(klass, id, left_id)
      left_id = left_id.to_i 
      dropped_item = klass.find(id)

      if left_id != 0
        item_to_insert_at = klass.find(left_id)
      else
        item_to_insert_at = nil 
      end 

      item = DraggableListItem.new(dropped_item)
      item.move_to(item_to_insert_at)

    end
    
    def initialize(dropped_item)
      @dropped_item = dropped_item
    end

    def move_to(item_to_insert_at)
      if item_to_insert_at
        @item_to_insert_at = item_to_insert_at
        if moving_up?
          @dropped_item.insert_at(@item_to_insert_at.position)
          @dropped_item.increment_position
        else
          @dropped_item.insert_at(@item_to_insert_at.position)
        end
      else
        @dropped_item.move_to_top
      end
    end

    private

    def moving_up?
      @item_to_insert_at.position < @dropped_item.position
    end
  end
end
