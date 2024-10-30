/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import radium from 'radium';
import bind from 'lodash/function/bind';
import assign from 'lodash/object/assign';
import dispatcher from './../../../lib/dispatcher';
import actions from './../../../lib/actions';
import utils from './../../../lib/utils';
import colors from './../../../lib/colors';

export default radium(React.createClass({

  propTypes: {
    detail: React.PropTypes.object.isRequired,
    licenses: React.PropTypes.array,
    downloading: React.PropTypes.bool.isRequired,
    facets: React.PropTypes.object.isRequired,
    setFeatured: React.PropTypes.bool.isRequired,
  },

  contextTypes: {
    user: React.PropTypes.object,
  },

  newSearch(newQuery) {
    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH_QUERY,
      query: newQuery,
    });
    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH_FACET,
      facet: 'page',
      value: 1,
    });
    dispatcher.dispatch({
      type: actions.CLOSE_PIC_DETAIL,
    });
    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH,
      query: newQuery,
      facets: assign(this.props.facets, { page: 1 }),
    });
  },

  downloadPreview(image) {
    // Download the image
    dispatcher.dispatch({
      type: actions.UPLOAD_WORDPRESS_ASSET,
      asset: image,
      url: image.preview.url,
      preview: true,
    });
  },

  /**
   * Licenses an image
   *
   * @param {object} image
   * @param {boolean} rawDownload; If true, will force a file download instead of uploading to WordPress
   */
  licenseImage(image, rawDownload) {
    const totalCredits = this.context.user.total_credits;
    const remainingCredits = this.context.user.remaining_credits;

    // If the user doesn't have downloads, prompt them to buy a subscription
    if (totalCredits === 0) {
      dispatcher.dispatch({
        type: actions.INIT_MODAL,
        modal: {
          type: 'confirm',
          icon: 'collections',
          title: 'Purchase Subscription',
          message: (
            <span>
              In order to license this image you'll need to purchase a Bigstock Subscription.
              <p>
                It's easy!
              </p>
            </span>
          ),
          confirm: () => {
            window.open('http://www.bigstockphoto.com/subscribe/', '_blank');
          },
          hideReject: true,
          confirmText: 'Take me to Bigstock',
          level: 'info',
        },
      });
    } else if (remainingCredits === 0) {
      dispatcher.dispatch({
        type: actions.INIT_MODAL,
        modal: {
          type: 'confirm',
          icon: 'collections',
          title: 'Out of Downloads',
          message: (
            <span>
              Oh no! It looks like you're out of downloads. You can download when your tokens renew.
              <p>
                Go to <a target="_blank" href="http://www.bigstockphoto.com/account">My Account</a> to check the status of your subscription
              </p>
            </span>
          ),
          hideReject: true,
          confirmText: 'Ok',
          level: 'info',
        },
      });
    } else {
      dispatcher.dispatch({
        type: actions.INIT_MODAL,
        modal: {
          type: 'confirm',
          icon: 'file_download',
          title: 'License & Insert',
          message: (
            <span>
              {remainingCredits}/{totalCredits} images remaining today
            </span>
          ),
          checkFeatured: true,
          checkTos: !this.context.user.tos_agree,
          hasSub: this.context.user.subscriptions.length > 0,
          confirm: () => {
            // Tell the API the user has agreed to the TOS
            dispatcher.dispatch({
              type: actions.TOS_AGREEMENT_UPDATED,
            });

            dispatcher.dispatch({
              type: actions.LICENSE_ASSET,
              asset: image,
              setFeatured: this.props.setFeatured,
              rawDownload: rawDownload || false,
            });
          },
          hideReject: true,
          confirmText: 'Confirm',
          level: 'info',
        },
      });
    }
  },

  downloadImage(image, rawDownload) {
    // Download the image
    dispatcher.dispatch({
      type: actions.DOWNLOAD_ASSET,
      asset: image,
      license: this.props.licenses[0],
      rawDownload,
    });
  },

  render() {
    const styles = {
      bspInlineDetails: {
        float: 'left',
        width: '50%',
      },

      bspInlineDetailsContainer: {
        paddingLeft: '5%',
      },

      bspInlineDetailsTitle: {
        color: colors.white,
        lineHeight: '30px',
      },

      bspInlineDetailsList: {
        // Placeholder for future Styles
      },

      bspInlineDetailsListItemInlineBlock: {
        display: 'inline-block',
        marginRight: '10px',
      },

      bspInlineDetailsListItemBlock: {
        display: 'block',
        marginRight: '10px',
      },

      bspInlineDetailsListItemText: {
        color: colors.lightGray,
      },

      bspInlineDetailsLink: {
        color: colors.blue,
        textDecoration: 'none',
        ':hover': {
          opacity: 0.8,
        },
      },

      bspInlineDetailsButton: {
        display: 'inline-block',
        color: colors.white,
        padding: '14px 18px',
        borderRadius: '2px',
        borderColor: 'transparent',
        boxShadow: 'none',
        fontSize: '18px',
        marginRight: '14px',
        cursor: 'pointer',
        marginTop: '14px',
        marginBottom: '14px',
        ':hover': {
          opacity: '0.8',
        },
      },

      bspInlineDetailsButtonGrey: {
        backgroundColor: colors.gray,
      },

      bspInlineDetailsButtonBlue: {
        backgroundColor: colors.blue,
      },

      bspInlineDetailsOriginalDiv: {
        marginTop: '15px',
      },

      bspInlineDetailsOriginalLink: {
        color: colors.gray,
        textDecoration: 'none',
        fontSize: '14px',
        ':hover': {
          color: colors.blue,
        },
      },

      bspInlineDetailsOriginalLinkSpan: {
        verticalAlign: 'middle',
        display: 'inline-block',
      },

      bspInlineDetailsOriginalLinkIcon: {
        verticalAlign: 'middle',
        display: 'inline-block',
      },

      ajax: {
        display: 'inline-block',
        width: '17px',
        height: '17px',
        backgroundImage: `url(${bigstockphoto.pluginUrl}/img/loader.gif)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      },
    };

    // Apply shared styles to the different buttons
    assign(styles.bspInlineDetailsButtonGrey, styles.bspInlineDetailsButton);
    assign(styles.bspInlineDetailsButtonBlue, styles.bspInlineDetailsButton);

    // Only take the first ten keywords
    const slicedKeywords = this.props.detail.keywords.slice(0, 9);

    // Map each keyword to it's own anchor
    const keywords = utils.intersperse(slicedKeywords
      .map((keyword, i) => {
        return (
          <a key={i} onClick={bind(this.newSearch, this, keyword)} href="#keyword" style={styles.bspInlineDetailsLink}>{keyword}</a>
        );
      }), ', ');

    // The download method will be slightly different based on if we've licensed
    const downloadMethod = (this.props.licenses && this.props.licenses.length) ? this.downloadImage : this.licenseImage;
    let downloadText = (this.props.licenses && this.props.licenses.length) ? 'Re-download' : 'License & Insert';

    // Show the spinner if we're currently downloading
    if (this.props.downloading) {
      downloadText = <span style={styles.ajax}></span>;
    }

    // What type of release is it?
    let releaseText = null;
    if (this.props.detail.model_release) {
      releaseText = (
        <span>
          <strong>Release:</strong> Model Release On File
        </span>);
    } else if (this.props.detail.editorial) {
      releaseText = (
        <span>
          <strong>Release:</strong> <a style={styles.bspInlineDetailsLink} href="http://www.bigstockphoto.com/editorial-usage.html" target="_blank">For Editorial Use Only</a>
        </span>
      );
    }

    return (
      <div style={styles.bspInlineDetails}>
        <div style={styles.bspInlineDetailsContainer}>
          <h1 style={styles.bspInlineDetailsTitle}>{this.props.detail.title}</h1>
          <ul style={styles.bspInlineDetailsList}>
            <li style={styles.bspInlineDetailsListItemInlineBlock}>
              <p style={styles.bspInlineDetailsListItemText}>
                <strong>Stock Photo ID:</strong> {this.props.detail.id}
              </p>
            </li>
            <li style={styles.bspInlineDetailsListItemInlineBlock}>
              <p style={styles.bspInlineDetailsListItemText} >
                <strong>Artist:</strong> <a href="#artist" onClick={bind(this.newSearch, this, `contributor:${this.props.detail.contributor.profile_name}`)} >{this.props.detail.contributor.profile_name}</a>
              </p>
            </li>
            <li style={styles.bspInlineDetailsListItemBlock}>
              <p style={styles.bspInlineDetailsListItemText}>
                {releaseText}
              </p>
            </li>
            <li style={styles.bspInlineDetailsListItemBlock}>
              <p style={styles.bspInlineDetailsListItemText}>
                <strong>Related Keywords:</strong> {keywords}
              </p>
            </li>
          </ul>
          <button
            style={styles.bspInlineDetailsButtonGrey}
            key={`${this.props.detail.id}-preview`}
            onClick={bind(this.downloadPreview, this, this.props.detail)}
          >
              Insert Preview
          </button>
          <button
            disabled={this.props.downloading}
            style={styles.bspInlineDetailsButtonBlue}
            key={`${this.props.detail.id}-download`}
            onClick={bind(downloadMethod, this, this.props.detail, false)}
          >
            {downloadText}
          </button>
          <div style={styles.bspInlineDetailsOriginalDiv}>
            <a href="#download" key={`${this.props.detail.id}-download-original`} style={styles.bspInlineDetailsOriginalLink} onClick={bind(downloadMethod, this, this.props.detail, true)}>
              <i className="material-icons" style={styles.bspInlineDetailsOriginalLinkIcon}>file_download</i> <span style={styles.bspInlineDetailsOriginalLinkSpan}>Download to Desktop</span>
            </a>
          </div>
        </div>
      </div>
    );
  },
}));
