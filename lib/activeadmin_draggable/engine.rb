module ActiveadminDraggable
  class Engine < ::Rails::Engine
    initializer 'activeadmin_draggable.load_static_assests' do |app|
      app.middleware.use ::ActionDispatch::Static, "#{root}/vendor"
    end
  end
end
