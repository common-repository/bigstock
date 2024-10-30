/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import cookie from 'react-cookie';
import assign from 'lodash/object/assign';
import moment from 'moment';

// Private

// Expand the Inline Details window and then call a function
function expand(cb) {
  // Animate inline expansion
  const inline = jQuery('.bspInline');
  inline.css('padding', '30px');
  inline.css('max-height', '10000px');
  inline.css('margin', '15px 5px');

  // Return callback
  return cb();
}

// Animate scroll to location specified
function scroll(distance, animationTime) {
  const frame = jQuery('#bsp-results');
  // Check for distance param
  if (distance) {
    const calcDistance = distance + frame.scrollTop();
    // Check for animation time
    if (animationTime) {
      frame.animate({
        scrollTop: calcDistance,
      }, animationTime);
    } else {
      frame.scrollTop(calcDistance);
    }
  }
}

// Evaluate Inline Details window position and call scroll
function evaluateScroll() {
  const inline = jQuery('.bspInline');

  // Ensure window is open
  if (wp.media.frames.bsp && inline.length) {
    // Set configuration
    const scrollParams = {
      buffer: 150,
      animationTime: 200,
    };

    scrollParams.distanceFromTop = inline.position().top ? inline.position().top : 0;

    // Calculate scrolling distance
    const scrollDistance = scrollParams.distanceFromTop - scrollParams.buffer;

    // Tail calls are fun
    return scroll(scrollDistance, scrollParams.animationTime);
  }
}

function getRenewalSubscriptions(user) {
  // Check for subscriptions array
  if (user.subscriptions) {
    return user.subscriptions.filter(sub => {
      // Only grab image subscriptions that have an active status (pending, processed and convert)
      return (sub.type === 'image' && (sub.renewal.status === 'pending' || sub.renewal.status === 'processed' || sub.renewal.status === 'convert'));
    });
  }
}

// Public
const utils = {

  /**
   * Save a new token
   * @param {String} token
   * @return {boolean}
   */
  setToken(token) {
    return cookie.save('bigstock-wp', token);
  },

  /**
   * Gets the saved token, if any
   * @return {String|null}
   */
  getToken() {
    const token = cookie.load('bigstock-wp');
    if (!token) {
      return null;
    }

    return token;
  },

  removeToken() {
    cookie.remove('bigstock-wp');
  },

  formatUser(updatedUser) {
    // Filter out non-image subs
    const imageSubscriptions = updatedUser.subscriptions.filter((subscription) => {
      return subscription.type === 'image';
    });

    // Figure out the total number of credits remaining/total over all
    // subscriptions and add it to the user object
    let totalCredits = 0;
    let remainingCredits = 0;
    let renewsAt = null;
    if (imageSubscriptions.length) {
      const subscriptionCredits = imageSubscriptions.reduce((previous, current) => {
        const prevRenewsAt = moment(previous.renews_at, moment.ISO_8601);
        const curRenewsAt = moment(current.renews_at, moment.ISO_8601);
        return {
          renews_at: (prevRenewsAt > curRenewsAt) ? prevRenewsAt : curRenewsAt,
          credits: previous.credits + current.credits,
          total_credits: previous.total_credits + current.total_credits,
        };
      });
      totalCredits = subscriptionCredits.total_credits;
      remainingCredits = subscriptionCredits.credits;
      renewsAt = subscriptionCredits.renews_at;
    }

    return assign(updatedUser, {
      first_name: updatedUser.first_name || `Ol' Chap`,
      remaining_credits: remainingCredits,
      total_credits: totalCredits,
      renews_at: moment(renewsAt, moment.ISO_8601),
    });
  },

  removeImageFromWYSIWYG(selector) {
    const elems = tinyMCE.activeEditor.dom.select(`img[${selector}]`);
    elems.map((elem) => {
      tinyMCE.activeEditor.dom.getParent(
        elem,
        (e) => {
          // If we hit the top-most elem for the image, stop removing elems
          if (e.className === 'mceTemp') {
            tinyMCE.activeEditor.dom.remove(e);
          }
        }
      );
    });
  },

  insertImageToWYSIWYG(image) {
    // Build image tag with those options
    const $img = jQuery('<img>');
    const align = image.align || 'none';
    const size = image.sizeCode || 'full';
    const width = image.width || 'auto';
    const height = image.height || 'auto';
    $img.attr('src', image.url);
    $img.addClass('align' + align);
    $img.addClass('size-' + size);
    $img.attr('width', width);
    $img.attr('height', height);
    const $container = jQuery('<div>').append($img);
    if (image.caption) {
      // $img.attr('alt', asset.caption);
      $container.html(`[caption align="align${size}" width="${width}"]${$container.html()}${image.caption}[/caption]`);
    }
    // Insert into Wordpress
    wp.media.editor.insert($container.html());
  },

  /**
   * Return an array with the separator placed between each element of the array
   * @param {array} arr; An array of react elements
   * @param {string} sep; The seperator (e.g. ', ')
   */
  intersperse(arr, sep) {
    if (arr.length === 0) {
      return [];
    }

    return arr.slice(1).reduce((xs, x) => {
      return xs.concat([sep, x]);
    }, [arr[0]]);
  },

  /**
   * Capitalize the first letter of a String
   * @param {string} string
   * @returns {string}
   */
  capitalizeFirstLetter(string) {
    return (string) ? string.charAt(0).toUpperCase() + string.slice(1) : string;
  },

  getResultsHeight() {
    let frame = jQuery('.media-frame-content').height();
    let searchBar = jQuery('.bsp-search-bar').height();

    // This is an adjustment for when users close the plugin window and then reopen it after a refresh
    if (frame === null) {
      frame = jQuery(window).height() - 200; // This is a bad estimation that subtracts the modal margins plus the header and footer of the WP modal
    }

    if (searchBar === null) {
      searchBar = 116; // @todo this should be determined dynamically, but until we make the plugin completely responsive it's not worth doing
    }

    return frame - searchBar;
  },

  openBigstockWindow() {
    // Open the actual WP Modal
    if (!wp.media.frames.bsp) {
      // Instantiate Plugin
      wp.media.frames.bsp = wp.media.editor.open(wpActiveEditor, {
        state: 'bsp-controller',
        frame: 'post',
      });
    } else {
      // It's already open, just show the window
      wp.media.frames.bsp.open(wpActiveEditor);
    }

    // Make sure the BSP tab is open
    jQuery('.media-modal .media-menu-item').removeClass('active');
    jQuery('.media-modal .media-menu-item:contains("Bigstock Images")').trigger('click');
  },

  expandInline() {
    expand(evaluateScroll);
  },

  scrollInline() {
    evaluateScroll();
  },

  hasRenewal(user) {
    // If the user's array of renewal subs is not empty, they have a renewal
    return getRenewalSubscriptions(user).length > 0;
  },
};

export default utils;
