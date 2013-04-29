module ActiveAdmin
  class DraggableListItem
    def initialize(dropped_item)
      @dropped_item = dropped_item
    end

    def move_to(item_to_insert_at)
      if item_to_insert_at
        @item_to_insert_at = item_to_insert_at
        if moving_up?
          @item_image.insert_at(@item_to_insert_at.position)
          @item_image.increment_position
        else
          @item_image.insert_at(@item_to_insert_at.position)
        end
      else
        @dropped_image.move_to_top
      end
    end

    private

    def moving_up?
      @image_to_insert_at.position < @dropped_image.position
    end
  end
end
