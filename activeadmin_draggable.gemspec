# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'activeadmin_draggable/version'

Gem::Specification.new do |spec|
  spec.name          = "activeadmin_draggable"
  spec.version       = ActiveadminDraggable::VERSION
  spec.authors       = ["Krzysztof Białek", "Łukasz Pełszyński"]
  spec.email         = ["krzysztofbialek@gmail.com"]
  spec.description   = %q{Active admin sortable add on}
  spec.summary       = %q{Adds sortable_table type which uses acts as list for changing order of items with nice js tool}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
  spec.add_runtime_dependency "acts_as_list"
end
