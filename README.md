= ActiveadminDraggable

ActiveadminDraggable is a items reordering add on to active_admin tables.
With build in javascript and methods allows you to easily change your item index tables
in active_admin into sortable tables. With one click you will be able to enter +reorder+ mode
and drag and drop items to desired position in the list. Asynchronous javascript will update their
position for you. 

== Installation

1. Install activeadmin_draggable

  Add this line to your application's Gemfile:

      gem 'activeadmin_draggable'

  And then execute:

      $ bundle

  Or install it yourself as:

      $ gem install activeadmin_draggable

2. Install acts_as_list 

  acts_as_list adds lists functionality to your models basing on position column. 
  
  Basic setup required for this gem to work is:

  Add this line to your application's Gemfile:

      gem 'acts_as_list'

  And then execute:

      $ bundle

  Or install it yourself as:

      $ gem install acts_as_list

== Usage
  
  * the +list+ functionality

    First you need to add +acts_as_list+ to resource you want to make sortable in active_admin.

    You can find details docs at: https://github.com/swanandp/acts_as_list but for our purpouses you just need to:

    rails g migration AddPositionToResourceName position:integer
    rake db:migrate

    After that you can use acts_as_list method in the model:

    class SomeClass < ActiveRecord::Base
      acts_as_list
    end
   
  * adding +sortable_table+ in active_admin resource

    Suppose we want to make Post resource sortable

    Add +require 'activeadmin_draggable'+ to the top of your file.

    Add index action
   
    ActiveAdmin.register Post do
      config.sort_order = "position_asc"

      index :as => :sortable_table do
        config.sort_order = "posts.position ASC"

        column :name
        column :position
     
      end
    
      ...

    end

    Add reorder action which is used to change position after droping item
      
      ...

      collection_action :reorder, :method => :put do
        ActiveadminDraggable::DraggableListItem.move(Post, params[:id], params[:left_id])

        head(:ok)
      end 

      ...

    Add +reorder+ button to index page
    
      ...

      action_item :only => :index do
        link_to 'Reorder mode', reorder_admin_posts_path, :class => "reorder", "data-on_text" => "Reorder mode", "data-off_text" => "Reorder mode off"
      end 

      ...

    Texts can be of course changed. 
      * data-off_text for disabling reorder mode
      * data-on_text for enabling reorder mode 

== Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
