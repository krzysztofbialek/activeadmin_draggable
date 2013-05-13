class Item < ActiveRecord::Base
  require 'acts_as_list'
  attr_accessible :name, :position


  acts_as_list

end
