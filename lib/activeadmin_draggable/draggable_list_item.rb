module ActiveAdmin
  class DraggableListItem
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
