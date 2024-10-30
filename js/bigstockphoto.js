/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import app from './app';
import actions from './lib/actions';

/** Intercom.io */
(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src=`https://widget.intercom.io/widget/${process.env.INTERCOM_IO}`;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();

/**
 * Attach plugin nonce to any WP AJAX calls
 */
bigstockphoto.post = function(action, data) {
  data = data || {};
  data.nonce = bigstockphoto.nonce;
  return wp.media.post(action, data);
}

/**
 * Allow the WP admin to license photos in the application
 */
bigstockphoto.license = function(id) {
  app.dispatch([
    {
      type: actions.LICENSE_AND_DOWNLOAD_IMAGE_BY_ID,
      id: id
    }
  ])
}

/**
 * The title bar, containing the logo, "privacy" and "About" links
 */
wp.media.view.BigstockTitleBar = wp.media.View.extend({
  template: function(view) {
    return wp.media.template('bsp-title-bar')(view);
  },
  className: 'bsp-title-bar'
});

wp.media.view.BigstockToolbar = wp.media.View.extend({
  template: function(view) {
    return wp.media.template('bsp-toolbar')(view);
  },
  className: 'bsp-toolbar'
});

/** Main Controller */
wp.media.controller.Bigstock = wp.media.controller.State.extend({
  handlers: {
    'title:create:bsp-title-bar': 'createTitleBar',
    'content:create:bsp-content': 'createContent',
    'content:activate:bsp-content': 'activateContent',
    'toolbar:create:blank-toolbar': 'createEmptyToolbar',
  },

  turnBindings: function(method) {
    var frame = this.frame;
    _.each(this.handlers, function(handler, event) {
      this.frame[method](event, this[handler], this);
    }, this);
  },

  activate: function() {
    if(this.get('unsupported')) {
      return;
    }
    this.turnBindings('on');
    this.setMode();
  },

  setMode: function() {
    this.set('content', 'bsp-content');
    this.set('toolbar', 'blank-toolbar');
  },

  createContent: function(content) {
    content.view = new wp.media.view.Bigstock({
      controller: this
    });
  },

  activateContent: function(content) {
    this.frame.$el.removeClass('hide-toolbar');
  },

  createTitleBar: function(title) {
    title.view = new wp.media.view.BigstockTitleBar({
      controller: this
    });
  },

  createEmptyToolbar: function(toolbar) {
    if(this.get('unsupported')) {
      return;
    }

    toolbar.view = new wp.media.view.BigstockToolbar({
      controller: this
    });
  },
});

/** Main View */
wp.media.view.Bigstock = wp.media.View.extend({
  id: 'bsp-wp',
  className: 'bsp-wp',

  /**
   * React-ify me, captain!
   */
  render: function() {
    app.init(this.$el[0]);
    return this;
  }
});

/**
 * Extend both top-level media frames with an additional mode for fetching
 * and downloading images from BigstockPhoto.
 */
var BigstockPhotoFrame = function(parent) {
  return {
    createStates: function() {
      parent.prototype.createStates.apply( this, arguments );

      this.states.add([
        new wp.media.controller.Bigstock({
          id: 'bsp-controller',
          title: wp.media.view.l10n.bigstockMenuTitle,
          titleMode: 'bsp-title-bar',
          multiple: false,
          sortable: false,
          autoSelect: true,
          syncSelection: true,
          content: 'bsp-content',
          router: false,
          menu: 'default',
          edge: 120,
          gutter: 8
        })
      ]);
    }
  }
};
wp.media.view.MediaFrame.Post = wp.media.view.MediaFrame.Post.extend(BigstockPhotoFrame(wp.media.view.MediaFrame.Post));

// Bring the user directly to the Bigstock Photo screen
jQuery(document).ready(function() {
  jQuery(document.body).on('click', '.bsp-images-activate', function(e) {
    e.preventDefault();

    if(!wp.media.frames.bsp) {
      wp.media.frames.bsp = wp.media.editor.open(wpActiveEditor, {
        state: 'bsp-controller',
        frame: 'post'
      });
    } else {
      wp.media.frames.bsp.open(wpActiveEditor);
    }

    // Make sure the right tab is open
    jQuery('.media-modal .media-menu-item').removeClass('active');
    jQuery('.media-modal .media-menu-item:contains("Bigstock Images")').trigger('click');
  });

  // Do the same for the regular insert media button
  jQuery(document.body).on('click', '.insert-media.add_media', function(e) {
    jQuery('.media-modal .media-menu-item').removeClass('active');
    jQuery('.media-modal .media-menu-item:contains("Insert Media")').trigger('click');
  });
});
