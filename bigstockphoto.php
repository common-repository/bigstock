<?php
/*
Plugin name: Bigstock
Plugin URI: http://www.bigstockphoto.com/wordpress-plugin/
Description: Bigstock’s Official Wordpress Plugin. Instantly search millions of royalty-free photos and vectors to license and embed into any blog post.
Author: Bigstock
Author URI: http://www.bigstockphoto.com/
Version: 1.0.0
*/

/*  Copyright 2015 Bigstock

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

// Create view templates used by the Bigstockphoto media manager
add_action( 'print_media_templates', 'bsp_print_media_templates' );

// Enqueue essential assets
add_action( 'admin_enqueue_scripts', 'bsp_enqueue' );

// Add the Bigstock Images media button
add_action( 'media_buttons', 'bsp_media_buttons', 20 );

// Warn about publishing posts with preview images
add_action( 'admin_notices', 'bsp_admin_notices' );

// Get file uploads do not work locally, because Wordpress
add_filter( 'http_request_host_is_external', '__return_true' );

// Allow Bigstock to download an image via ajax
add_action( 'wp_ajax_bigstockphoto_images_download', 'bigstockphoto_ajax_download' );

// @todo - Assess if we actually need this
add_filter('media_view_strings', 'bsp_custom_media_string', 10, 2);

// Load the TinyMCE plugin : editor_plugin.js (wp2.5)
add_filter('mce_external_plugins', 'bsp_register_tinymce_javascript');

function bsp_enqueue() {
  wp_enqueue_style( 'bigstockphoto', plugins_url( '/bigstockphoto.css', __FILE__ ) );
  $query_args = array('family' => 'Material+Icons');
  wp_enqueue_style( 'google_fonts', add_query_arg( $query_args, "//fonts.googleapis.com/icon" ), array(), null );

  wp_enqueue_script( 'bigstockphoto', plugins_url( '/js/dist/bundle.min.js', __FILE__ ), array( 'media-views' ), 1.1, true );
  wp_localize_script( 'bigstockphoto', 'bigstockphoto', array(
    'nonce' => wp_create_nonce( 'bigstockphoto' ),
    'pluginUrl' => plugins_url('', __FILE__)
  ));
}

function bsp_custom_media_string($strings,  $post) {
  $strings['bigstockMenuTitle'] = __('Bigstock Images', 'bigstockphoto');
  $strings['bigstockButton'] = __('License Image', 'bigstockphoto');
  return $strings;
}


/**
* Check if the post has Bigstock preview images
*/
function bsp_contains_comp( $post_content ) {
  return preg_match( '.preview\_bigstock\_.', $post_content );
}

/**
* Notify the user if they tried to save an image with a comp
* @action admin_notices
*/
function bsp_admin_notices() {
  global $pagenow;

  if( $pagenow != 'post.php' || !isset( $_GET['post'] ) ) {
    return;
  }

  $post = get_post( (int) $_GET['post'] );

  if( !$post ) {
    return;
  }

  if( bsp_contains_comp( $post->post_content ) && $post->post_status == 'publish' ) {
    // can't use esc_html__ since it would break the HTML tags in the string to be translated.
    echo '<div class="error bsp-images-message"><p>' . wp_kses_post(
    __("<strong>NOTE</strong>: You have one or more watermarked images in your post. To remove the watermark, select the image and click the Bigstock icon.", 'bigstock-images' ) )
    . '</p></div>';
  }
}

/**
* Include all of the templates used by Backbone views
*/
function bsp_print_media_templates() {
  include( __DIR__ . '/bigstockphoto-templates.php' );
}

/**
* Add "Bigstock" button to edit screen
*/
function bsp_media_buttons( $editor_id = 'content' ) { ?>
  <a href="#" id="insert-bsp-button" class="button bsp-images-activate add_media"
  data-editor="<?php echo esc_attr( $editor_id ); ?>"
  title="<?php esc_attr_e( "Bigstock", 'bigstockphoto' ); ?>"><span class="bsp-media-buttons-icon"></span><?php esc_html_e( "Images", 'bigstock-images' ); ?></a>
  <?php
}

/** Add MCE buttons */
function bsp_register_tinymce_javascript($plugin_array) {
  $plugin_array['bigstockphoto'] = plugins_url('/js/dist/bsp.tinymce.plugin.js', __FILE__);
  return $plugin_array;
}

// Convenience methods for adding 'message' data to standard
// WP JSON responses
function bigstockphoto_ajax_error( $message = null, $data = array() ) {
  if( !is_null( $message ) ) {
    $data['message'] = $message;
  }

  wp_send_json_error( $data );
}

function bigstockphoto_ajax_success( $message = null, $data = array() ) {
  if( !is_null( $message ) ) {
    $data['message'] = $message;
  }

  wp_send_json_success( $data );
}

/**
* Check against a nonce to limit exposure, all AJAX handlers must use this
*/
function bigstockphoto_ajax_check() {
  if( !isset( $_POST['nonce'] ) || !wp_verify_nonce( $_POST['nonce'], 'bigstockphoto' ) ) {
    bigstockphoto_ajax_error( __( "Invalid nonce", 'bigstockphoto' ) );
  }
}

/**
* Download an image from a URL
*/
function bigstockphoto_ajax_download() {

  $bigstockphoto_details_meta_key = 'bigstockphoto_images_image_details';
  $bigstockphoto_imageid_meta_key = 'bigstockphoto_images_image_id';

  bigstockphoto_ajax_check();

  $bigstock_id = sanitize_text_field( $_POST['meta']['BigstockImageId'] );

  // Sanity check inputs
  if( !isset( $_POST['url'] ) ) {
    bigstockphoto_ajax_error( __( "Missing image URL", 'bigstockphoto' ) );
  }

  $url = $_POST['url'];

  if( empty( $url ) ) {
    bigstockphoto_ajax_error( __( "Invalid image URL", 'bigstockphoto' ) );
  }

  // Download the image, but don't necessarily attach it to this post.
  $tmp = download_url( $url );

  // Womp, there it isn't
  if( is_wp_error( $tmp ) ) {
    bigstockphoto_ajax_error( __( "Failed to download image", 'bigstockphoto' ) );
  }

  // Check that the URL component is correct:
  // @todo - This is a lame check, we should be more specific when we add download.bigstockphoto.com
  if( strpos( $url, 'download' ) === false && strpos( $url, 'thumbs' ) === false ) {
    bigstockphoto_ajax_error( "Invalid URL" );
  }

  // Filename
  $filename = 'bigstock_' . $bigstock_id . '_' . str_replace(' ', '-', $_POST['meta']['BigstockTitle']) . '.jpg';

  // If we're not licensed, we're going to save this as a preview image
  if ( !$_POST['meta']['BigstockLicenseId'] ) {
    $filename = 'preview_' . $filename;
  }

  $file_array['name'] = $filename;
  $file_array['tmp_name'] = $tmp;

  $attachment_id = media_handle_sideload( $file_array, 0 );

  if( is_wp_error( $attachment_id ) ) {
    bigstockphoto_ajax_error( __( "Failed to sideload image", 'bigstockphoto' ) );
  }

  // Get the attachment
  $attachment = get_post( $attachment_id );

  if( !$attachment ) {
    bigstockphoto_ajax_error( __( "Attachment not found", 'bigstockphoto' ) );
  }

  $post_parent = isset( $_POST['post_id'] ) ? (int) $_POST['post_id'] : 0;
  $contributor = sanitize_text_field( $_POST['meta']['BigstockContributor'] );
  $attribution_link = sprintf(
    __( '<a href="%s">%s</a>/<a href="%s">Bigstock.com</a>', 'bigstockphoto' ),
    esc_url('http://www.bigstockphoto.com/search?contributor=' . $contributor),
    $contributor,
    esc_url('http://www.bigstockphoto.com/')
  );

  wp_update_post( array(
    'ID' => $attachment->ID,
    'post_content' => '',
    'post_excerpt' => $attribution_link,
    'post_parent' => $post_parent
  ) );

  // Delete existing attachments for this Bigstock image
  $existing_image_ids = get_posts( array(
    'post_type' => 'attachment',
    'post_status' => 'any',
    'meta_key' => $bigstockphoto_imageid_meta_key,
    'meta_value' => $bigstock_id,
    'fields' => 'ids'
  ) );

  foreach( $existing_image_ids as $existing_image_id ) {
    wp_delete_post( $existing_image_id );
  }

  // Save the bigstock details in post meta
  // string values
  update_post_meta( $attachment->ID, $bigstockphoto_details_meta_key, array_map( 'sanitize_text_field', array_filter( $_POST['meta'], 'is_string' ) ) );

  // Save the image ID in a separate meta key for serchability
  update_post_meta( $attachment->ID, $bigstockphoto_imageid_meta_key, $bigstock_id );

  // Get the attachment one last time to serve
  $attachment = get_post( $attachment_id );

  // Also set featured if applicable
  if (!empty($_POST['featured']) && $_POST['featured'] === 1) {
    set_post_thumbnail( $post_parent, $attachment->ID );
  }

  // Success! Forward new attachment_id back
  bigstockphoto_ajax_success( __( "Image downloaded", 'bigstockphoto' ), wp_prepare_attachment_for_js( $attachment ) );
}
