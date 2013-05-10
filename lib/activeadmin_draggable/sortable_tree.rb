require 'activeadmin'

module ActiveAdmin
  module Views
    # An index page component, which allows both list and tree reordering
    # It has full interface-wise compatibility with IndexAsTable component
    # Example usage:
    #   index :as => :sortable_table, :tree => true

    class IndexAsSortableTable < IndexAsTable
      def build(page_presenter, collection)
        table_options = {

          :id => active_admin_config.resource_name.plural,
          :sortable => false,
          :class => "index_table list",
          :i18n => active_admin_config.resource_class,
          :paginator => false
        }

        if is_tree = page_presenter.options[:tree]
          table_options[:class] += " tree"
        end

        table_for collection, table_options do |t|
          table_config_block = page_presenter.block || default_table
          instance_exec(t, &table_config_block)
        end
      end

      def table_for(*args, &block)
        insert_tag IndexSortableTableFor, *args, &block
      end

      class IndexSortableTableFor < IndexTableFor
        def sortable?
          false
        end

        protected

        def build_table_body
          @tbody = tbody do
            # Build enough rows for our collection
            @collection.each{|_| tr(:class => "level_#{_.level rescue 0}", :id => dom_id(_)) }
          end
        end
      end

    end
  end

  # This form helper allows us to create form for nested belongs_to association.

  class FormBuilder
    def has_one_nested(association, options = {}, &block)
      options = { :for => association }.merge(options)
      options[:class] ||= ""
      options[:class] << "inputs has_one_field"

      #looks dirty...but works (still better than active admin's way)
      if object.new_record?
        content = inputs_for_nested_attributes :for => [association, object.class.reflect_on_association(association).klass.new],
                    &block
        form_buffers.last << content.html_safe
      else
        content = inputs options, &block
      end
    end
  end

end
