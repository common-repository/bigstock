/**
* @package Bigstock
* @version 1.0.0
* @author BigstockPhoto
* @copyright Shutterstock, Inc.
*/
import React from 'react';
import dispatcher from './dispatcher';
import apiClient from './api-client';
import actions from './actions';
import utils from './utils';

let intercomBoot = false;

module.exports.register = () => {
  dispatcher.register((event) => {
    let token = utils.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
    };
    let query = {};

    switch (event.type) {
      /** Get Pic Details */
      case actions.REFRESH_PIC_DETAIL :
        apiClient
          .get(`/images/${event.id}`, {}, headers)
          .then((response) => {
            const collection = response.body;

            // Get the licenses
            dispatcher.dispatch({
              type: actions.REFRESH_LICENSES,
              id: event.id,
            });

            if (event.swap === true) {
              dispatcher.dispatch({
                type: actions.IMAGE_DETAILS_SWAPPED,
                collection,
              });

              dispatcher.dispatch({
                type: actions.DISPLAY_ACTIVE_STYLE,
                display: false,
              });
            } else {
              dispatcher.dispatch({
                type: actions.PIC_DETAIL_REFRESHED,
                collection,
              });

              // Ensure new image has active styles
              dispatcher.dispatch({
                type: actions.DISPLAY_ACTIVE_STYLE,
                display: true,
              });

              // If inline is not in focus, scroll to it
              utils.scrollInline();

              // Clear the cached swap images
              dispatcher.dispatch({
                type: actions.CLEAR_SWAPPED_IMAGE,
              });
            }
          })
          .catch((err) => {
            dispatcher.dispatch({
              type: actions.INIT_MODAL,
              error: err,
              modal: {
                type: 'confirm',
                icon: 'sync_problem',
                title: 'Oh no!',
                message: (
                  <span>
                    We encountered an error trying to fetch that asset. Please try again.
                  </span>
                ),
                hideReject: true,
                confirmText: 'Ok',
                level: 'error',
              },
            });
          });
        break;

      case actions.REFRESH_LICENSES :
        apiClient
          .get(`/licenses`, { asset_id: event.id }, headers)
          .then((response) => {
            const collection = response.body;
            dispatcher.dispatch({
              type: actions.LICENSES_REFRESHED,
              collection,
            });
          })
          .catch((err) => {
            dispatcher.dispatch({
              type: actions.INIT_MODAL,
              error: err,
              modal: {
                type: 'confirm',
                icon: 'sync_problem',
                title: 'Oh no!',
                message: (
                  <span>We encountered an error trying to fetch licenses for this asset.
                  </span>
                ),
                hideReject: true,
                confirmText: 'Ok',
                level: 'error',
              },
            });
          });
        break;

      /** Login User */
      case actions.REFRESH_USER_LOGIN :
        const basicToken = new Buffer(`${process.env.API_CLIENT_ID}:`).toString('base64');
        const loginHeaders = {
          'Authorization': basicToken,
        };
        const loginParams = {
          username: event.email,
          password: event.password,
        };
        apiClient
          .post('/login', loginParams, {}, loginHeaders)
          .then((response) => {
            const collection = response.body;
            token = collection.access_token;
            headers.Authorization = `Bearer ${token}`;
            utils.setToken(token);
            dispatcher.dispatch({
              type: actions.REFRESH_USER_SESSION,
            });
            dispatcher.dispatch({
              type: actions.USER_TOKEN_REFRESHED,
              collection: token,
            });
          })
          .catch((err) => {
            dispatcher.dispatch({
              type: actions.USER_LOGIN_ERROR_REFRESHED,
              collection: err.toString(),
            });
          });
        break;

      /** Logout User **/
      case actions.LOGOUT_USER :
        apiClient
          .delete('/oauth/token', {}, headers)
          .then(() => {
            // Display a modal telling the user of successful logout
            dispatcher.dispatch({
              type: actions.INIT_MODAL,
              modal: {
                type: 'confirm',
                icon: 'account_circle',
                title: 'Logged Out!',
                message: 'You have successfully logged out',
                hideReject: true,
                confirmText: 'Continue',
                level: 'info',
              },
            });

            // Clear the token and cookie from the WP application
            dispatcher.dispatch({
              type: actions.REMOVE_USER_SESSION,
            });
          })
          .catch(err => {
            dispatcher.dispatch({
              type: actions.INIT_MODAL,
              error: err,
              modal: {
                type: 'confirm',
                icon: 'sync_problem',
                title: 'Error Logging Out',
                message: (
                  <span>
                    An error has occured while trying to log you out. Please try again.
                  </span>
                ),
                hideReject: true,
                confirmText: 'Ok',
                level: 'error',
              },
            });
          });
        break;

      /** Refresh User Session */
      case actions.REFRESH_USER_SESSION :
        if (token) {
          apiClient
            .get('/me', {}, headers)
            .then((response) => {
              const collection = response.body;
              dispatcher.dispatch({
                type: actions.USER_SESSION_REFRESHED,
                collection,
              });

              // Let intercom.io know we're ready
              if (!intercomBoot) {
                jQuery('#IntercomBigstock').fadeIn();
                window.Intercom('boot', { //eslint-disable-line
                  app_id: `${process.env.INTERCOM_IO}`,
                  name: (collection.first_name || collection.last_name) ?
                    `${collection.first_name} ${collection.last_name}` :
                    collection.id,
                  email: collection.email,
                  created_at: 1312182000,
                });
                intercomBoot = true;
              }
            })
            .catch((err) => {
              dispatcher.dispatch({
                type: actions.INIT_MODAL,
                error: err,
                modal: {
                  type: 'confirm',
                  icon: 'sync_problem',
                  title: 'Please sign in',
                  message: (
                    <span>
                      It looks like your session has expired, please sign in again to continue.
                    </span>
                  ),
                  hideReject: true,
                  confirmText: 'Sign In',
                  level: 'error',
                },
              });

              dispatcher.dispatch({
                type: actions.REMOVE_USER_SESSION,
              });
            });
        }
        break;

      case actions.REFRESH_SEARCH:
        query = {
          q: event.query,
        };
        for (const f in event.facets) {
          if (event.facets[f]) {
            if (Object.prototype.toString.call(event.facets[f]) !== '[object Array]') {
              query[f] = event.facets[f];
            } else if (event.facets[f].length) {
              // Orientation is a special snowflake
              if (!(f === 'orientation' && event.facets[f].length === 2)) {
                query[f] = event.facets[f].join(',');
              }
            }
          }
        }
        apiClient
        .get('/images', query, headers)
        .then((response) => {
          const links = response.header.link;
          const collection = response.body;
          const data = {
            query: event.query,
            data: collection,
          };
          dispatcher.dispatch({
            type: actions.SEARCH_REFRESHED,
            collection: data,
            links,
          });
        })
        .catch((err) => {
          dispatcher.dispatch({
            type: actions.INIT_MODAL,
            error: err,
            modal: {
              type: 'confirm',
              icon: 'sync_problem',
              title: 'Oh no!',
              message: (
                <span>
                  We had a problem searching for images. Please try again
                </span>
              ),
              hideReject: true,
              confirm: () => {
                dispatcher.dispatch({
                  type: actions.REFRESH_SEARCH,
                  query: event.query,
                  facets: event.facets,
                });

                dispatcher.dispatch({
                  type: actions.SEARCH_LOADING,
                  loading: true,
                });
              },
              confirmText: 'Try Again',
              level: 'error',
            },
          });

          dispatcher.dispatch({
            type: actions.SEARCH_LOADING,
            loading: false,
          });
        });
        break;

      case actions.REFRESH_SIMILAR_IMAGES:
        apiClient
        .get(`/images/${event.id}/related`, {}, headers)
        .then((response) => {
          const collection = response.body;
          dispatcher.dispatch({
            type: actions.SIMILAR_IMAGES_REFRESHED,
            collection,
          });
        })
        .catch((err) => {
          dispatcher.dispatch({
            type: actions.SIMILAR_IMAGES_REFRESHED,
            error: err,
          });
        });
        break;

      /**
       * Uploads an asset to Wordpress by sending an ajax event
       * to process the upload
       */
      case actions.UPLOAD_WORDPRESS_ASSET :
        const assetToUpload = event.asset;
        const isPreview = event.preview;
        const bs = bigstockphoto || {};
        bs.post('bigstockphoto_images_download', {
          url: event.url,
          post_id: jQuery('#post_ID').val(),
          featured: event.setFeatured ? 1 : 0,
          meta: {
            'BigstockLicenseId': !isPreview && event.license ? event.license : null,
            'BigstockImageId': assetToUpload.id,
            'BigstockTitle': assetToUpload.title,
            'BigstockDescription': assetToUpload.description,
            'BigstockContributor': assetToUpload.contributor.profile_name,
          },
        })
        .done((wpresponse) => {
          // Kill modals
          dispatcher.dispatch({
            type: actions.DISMISS_ALL_MODALS,
          });

          // Let the application know this has been downloaded
          dispatcher.dispatch({
            type: actions.ASSET_DOWNLOADED,
            collection: wpresponse,
          });
          // Insert into wordpress
          const attachment = new wp.media.model.Attachment(wpresponse);
          utils.insertImageToWYSIWYG(attachment.attributes);

          // Actually refresh featured image box in Backbone
          if (event.setFeatured) {
            wp.media.featuredImage.set(attachment.attributes.id);
          }

          // Update wordpress with the attachment so it's available right away
          // @todo

          // If we're not a preview image, remove the previews
          if (!event.preview) {
            utils.removeImageFromWYSIWYG(`src*="preview_bigstock_${assetToUpload.id}"`);
          }
        });
        break;

      /** Action: Download Asset */
      case actions.DOWNLOAD_ASSET :
        const assetToDownload = event.asset;
        apiClient
          .get(`/licenses/${event.license.id}/download`, {}, headers)
          .then((response) => {
            const collection = response.body;
            // Set downloading modals
            dispatcher.dispatch({
              type: actions.INIT_MODAL,
              modal: {
                type: 'alert',
                icon: 'file_download',
                title: 'Downloading asset',
                message: (
                  <span>
                    Please wait while your asset is downloaded.
                  </span>
                ),
                level: 'info',
              },
            });
            if (!event.rawDownload) {
              dispatcher.dispatch({
                type: actions.UPLOAD_WORDPRESS_ASSET,
                asset: assetToDownload,
                url: collection.url,
                license: event.license,
                setFeatured: event.setFeatured,
              });
            } else {
              // Process a raw download
              window.open(collection.url, '_blank');

              // Kill modals
              dispatcher.dispatch({
                type: actions.DISMISS_ALL_MODALS,
              });
              dispatcher.dispatch({
                type: actions.ASSET_DOWNLOADED,
              });
            }
          })
          .catch((err) => {
            dispatcher.dispatch({
              type: actions.INIT_MODAL,
              error: err,
              modal: {
                type: 'confirm',
                icon: 'sync_problem',
                title: 'Oh no!',
                message: (
                  <span>
                    There was a problem downloading your asset. Please try again.
                  </span>
                ),
                hideReject: true,
                confirmText: 'Ok',
                level: 'error',
              },
            });
            // Kill the loader
            dispatcher.dispatch({
              type: actions.ASSET_DOWNLOADED,
            });
          });
        break;

      /**
       * Licenses, downloads, and inserts an asset into Wordpress
       * This is called when the 'BIG' button is pressed within the WYSIWYG editor
       */
      case actions.LICENSE_AND_DOWNLOAD_IMAGE_BY_ID :
        if (token) {
          apiClient
            .get('/me', {}, headers)
            .then((responseUser) => {
              // Open the modal
              utils.openBigstockWindow();

              dispatcher.dispatch({
                type: actions.USER_SESSION_REFRESHED,
                collection: responseUser.body,
              });

              const user = utils.formatUser(responseUser.body);

              // Make a call to image detail
              apiClient
                .get(`/images/${event.id}`, {}, headers)
                .then((imageResponse) => {
                  const responseAsset = imageResponse.body;

                  // Get the licenses for this image
                  apiClient
                    .get(`/licenses`, { asset_id: event.id }, headers)
                    .then((response) => {
                      const availableLicenses = response.body;

                      if (availableLicenses.length) {
                        // Download the image
                        dispatcher.dispatch({
                          type: actions.DOWNLOAD_ASSET,
                          license: availableLicenses[0],
                          asset: responseAsset,
                        });
                      } else if (user.total_credits === 0) {
                        // Ask the user to purchase a subscription
                        dispatcher.dispatch({
                          type: actions.INIT_MODAL,
                          modal: {
                            type: 'confirm',
                            icon: 'collections',
                            title: 'Purchase Subscription',
                            message: (
                              <span>
                                In order to license this image you'll need to purchase a Bigstock Subscription.\n It's easy!
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
                      } else if (user.remaining_credits === 0) {
                        dispatcher.dispatch({
                          type: actions.INIT_MODAL,
                          modal: {
                            type: 'confirm',
                            icon: 'collections',
                            title: 'Out of Downloads',
                            message: (
                              <span>
                                Oh no! It looks like you're out of downloads. You can download when your tokens renew.
                                Go to <a target="_blank" href="http://www.bigstockphoto.com/account">My Account</a> to check the status of your subscription
                              </span>
                            ),
                            hideReject: true,
                            confirmText: 'Ok',
                            level: 'info',
                          },
                        });
                      } else {
                        // License the image
                        dispatcher.dispatch({
                          type: actions.INIT_MODAL,
                          modal: {
                            type: 'confirm',
                            icon: 'file_download',
                            title: 'License & Insert',
                            checkFeatured: true,
                            message: (
                              <span>
                                {user.remaining_credits}/{user.total_credits} images remaining today
                              </span>
                            ),
                            checkTos: !user.tos_agree,
                            confirm: () => {
                              dispatcher.dispatch({
                                type: actions.LICENSE_ASSET,
                                asset: responseAsset,
                              });

                              // Tell the API the user has agreed to the TOS
                              dispatcher.dispatch({
                                type: actions.TOS_AGREEMENT_UPDATED,
                              });
                            },
                            hideReject: true,
                            confirmText: 'Confirm',
                            level: 'info',
                          },
                        });
                      }
                    })
                    .catch((err) => {
                      dispatcher.dispatch({
                        type: actions.INIT_MODAL,
                        error: err,
                        modal: {
                          type: 'confirm',
                          icon: 'sync_problem',
                          title: 'Oh no!',
                          message: (
                            <span>
                              We encountered an error trying to fetch licenses for this asset.
                            </span>
                          ),
                          hideReject: true,
                          confirmText: 'Ok',
                          level: 'error',
                        },
                      });
                    });
                })
                .catch((err) => {
                  if (!user.id) {
                    dispatcher.dispatch({
                      type: actions.INIT_MODAL,
                      error: err,
                      modal: {
                        type: 'confirm',
                        icon: 'sync_problem',
                        title: 'Please sign in',
                        message: (
                          <span>
                            Woah there! In order to license this image you'll need to sign in first.
                          </span>
                        ),
                        hideReject: true,
                        confirmText: 'Ok',
                        level: 'error',
                      },
                    });
                  } else {
                    dispatcher.dispatch({
                      type: actions.INIT_MODAL,
                      error: err,
                      modal: {
                        type: 'confirm',
                        icon: 'sync_problem',
                        title: 'Oh no!',
                        message: (
                          <span>
                            We encountered an error trying to fetch that asset. Please try again.
                          </span>
                        ),
                        hideReject: true,
                        confirmText: 'Ok',
                        level: 'error',
                      },
                    });
                  }
                });
            })
            .catch((err) => {
              // Open the modal
              utils.openBigstockWindow();

              dispatcher.dispatch({
                type: actions.INIT_MODAL,
                error: err,
                modal: {
                  type: 'confirm',
                  icon: 'sync_problem',
                  title: 'Please sign in',
                  message: (
                    <span>
                      Woah there! In order to license this image you'll need to sign in first.
                    </span>
                  ),
                  hideReject: true,
                  confirmText: 'Ok',
                  level: 'error',
                },
              });

              dispatcher.dispatch({
                type: actions.REMOVE_USER_SESSION,
              });
            });
        } else {
          // Open the modal
          // We need a timeout here because we can't dispatch in the middle of dispatch
          setTimeout(() => {
            utils.openBigstockWindow();

            dispatcher.dispatch({
              type: actions.INIT_MODAL,
              modal: {
                type: 'confirm',
                icon: 'sync_problem',
                title: 'Please sign in',
                message: (
                  <span>
                    Woah there! In order to license this image you'll need to sign in first.
                  </span>
                ),
                hideReject: true,
                confirmText: 'Ok',
                level: 'error',
              },
            });
          }, 1);
        }
        break;

      // Update TOS Agreement
      case actions.TOS_AGREEMENT_UPDATED :
        apiClient.
        get(`/me`, {}, headers)
        .then(userResponse => {
          const user = utils.formatUser(userResponse.body);
          if (!user.tos_agree) {
            apiClient
            .post(`/me/tos`, {
              tos_agree: true,
            }, {}, headers)
            .catch(err => {
              dispatcher.dispatch({
                type: actions.INIT_MODAL,
                error: err,
                modal: {
                  type: 'confirm',
                  icon: 'sync_problem',
                  title: 'Oh no!',
                  message: `Failed to fetch user object.`,
                  hideReject: true,
                  confirmText: 'Ok',
                  level: 'error',
                },
              });
            });
          }
        })
        .catch(err => {
          dispatcher.dispatch({
            type: actions.INIT_MODAL,
            error: err,
            modal: {
              type: 'confirm',
              icon: 'sync_problem',
              title: 'Oh no!',
              message: `There was a problem updating your Terms of Service Agreement.`,
              hideReject: true,
              confirmText: 'Ok',
              level: 'error',
            },
          });
        });
        break;

      /** Action: License Asset */
      case actions.LICENSE_ASSET :
        const assetToLicense = event.asset;
        apiClient
        .post(`/licenses`, {
          id: assetToLicense.id,
          size_code: 'm', // @todo - Medium for now
        }, {}, headers)
        .then((response) => {
          const collection = response.body;
          // Download the asset
          dispatcher.dispatch({
            type: actions.DOWNLOAD_ASSET,
            asset: assetToLicense,
            license: { id: collection.id },
            rawDownload: event.rawDownload || false,
            setFeatured: event.setFeatured || false,
          });
          // Update the user subscription
          dispatcher.dispatch({
            type: actions.REFRESH_USER_SESSION,
          });
          // Refresh the inline pic page
          dispatcher.dispatch({
            type: actions.REFRESH_PIC_DETAIL,
            id: assetToLicense.id,
          });
        })
        .catch((err) => {
          dispatcher.dispatch({
            type: actions.INIT_MODAL,
            error: err,
            modal: {
              type: 'confirm',
              icon: 'sync_problem',
              title: 'Oh no!',
              message: (
                <span>
                  There was a problem licensing your asset. Please try again.
                </span>
              ),
              hideReject: true,
              confirmText: 'Ok',
              level: 'error',
            },
          });
          // Kill the loader
          dispatcher.dispatch({
            type: actions.ASSET_DOWNLOADED,
          });
        });
        break;
      default:
        // Nothing to do
        break;
    }
  });
};
