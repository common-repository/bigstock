tinymce.PluginManager.add('bigstockphoto', function(editor) {
  var toolbar,
      bigstockImage;

  // Add a button that opens a window
  editor.addButton('bsp_license', {
    tooltip: 'License Bigstock Image ',
    icon: 'bigstock-icon',
    onclick: function(e) {
      // Get the Bigstock Image ID
      var bigstockSrc = bigstockImage.split('/');
      var bigstockFile = bigstockSrc[bigstockSrc.length - 1];
      var bigstockRegEx = bigstockFile.replace('preview_bigstock_', '');
      bigstockRegEx = /.+?(?=\_)/.exec(bigstockRegEx);
      var bigstockId = bigstockRegEx[0];

      // Kick off the Download
      bigstockphoto.license(bigstockId);
  }});

  editor.once( 'preinit', function() {
    // @todo
    // we need a way to load these dynamically as I don't think this is the
    // right way to "extend" the toolbar
    toolbar = editor.wp._createToolbar([
      'bsp_license',
      'wp_img_alignleft',
      'wp_img_aligncenter',
      'wp_img_alignright',
      'wp_img_alignnone',
      'wp_img_edit',
      'wp_img_remove'
    ]);
  });

  editor.on( 'wptoolbar', function( event ) {
    // If we're a Bigstock preview image, make sure we display the BIG button
    if (event.element.nodeName === 'IMG' && event.element.src.indexOf('preview_bigstock') >= 0) {
      bigstockImage = event.element.src;
      event.toolbar = toolbar;
    }
  });

});
