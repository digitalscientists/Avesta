###########################
## Layouts
###########################

## default

page "*", :layout => "_templates/layouts/default"

## Assets
set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'

# Set slim-lang output style
Slim::Engine.set_default_options :pretty => true
 
# Set template languages
set :slim, :layout_engine => :slim

###########################
## Helpers
###########################

helpers do

  def render_partial( partial_name )
    partial "_templates/partials/#{partial_name}"
  end

end

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :cache_buster

  # Use relative URLs
  activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
end

activate :livereload