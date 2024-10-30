import assign from 'lodash/object/assign';
import storeMixin from './../lib/store-mixin';
import dispatcher from './../lib/dispatcher';
import actions from './../lib/actions';

// Private
let detail = {};
let similar = [];
let licenses = [];
let swapped = null;
let downloading = false;
let activeStyle = true;
let setFeatured = false;

function setSwapped(newSwapped) {
  swapped = newSwapped;
}

function setFeaturedImage() {
  setFeatured = !setFeatured;
}

function setLicenses(newLicenses) {
  licenses = newLicenses;
}

function setDetail(newDetail) {
  detail = newDetail;
}

function setSimilar(newSimilar) {
  similar = newSimilar;
}

function setDownloading(newDownloading) {
  downloading = newDownloading;
}

function setActiveStyle(bool) {
  activeStyle = bool;
}

// Public
const ResultStore = assign({}, storeMixin, {
  changeEvent: actions.RESULT_UPDATED,

  getDetail() {
    return detail;
  },

  getSimilar() {
    return similar;
  },

  getFeaturedImage() {
    return setFeatured;
  },

  getLicenses() {
    return licenses;
  },

  getSwapped() {
    return swapped;
  },

  getDownloading() {
    return downloading;
  },

  isActiveStyle() {
    return activeStyle;
  },
});

ResultStore.dispatcherId = dispatcher.register((event) => {
  switch (event.type) {
    case actions.PIC_DETAIL_REFRESHED:
      setDetail(event.collection);
      ResultStore.emitChange();
      break;
    case actions.LICENSES_REFRESHED:
      setLicenses(event.collection);
      ResultStore.emitChange();
      break;
    case actions.CLOSE_PIC_DETAIL:
      setDetail({});
      ResultStore.emitChange();
      break;
    case actions.SIMILAR_IMAGES_REFRESHED:
      setSimilar(event.collection);
      ResultStore.emitChange();
      break;
    case actions.SEARCH_REFRESHED:
      setDetail({});
      ResultStore.emitChange();
      break;
    case actions.IMAGE_DETAILS_SWAPPED:
      setSwapped(event.collection);
      ResultStore.emitChange();
      break;
    case actions.CLEAR_SWAPPED_IMAGE:
      setSwapped(null);
      ResultStore.emitChange();
      break;
    case actions.ASSET_DOWNLOADED:
      setDownloading(false);
      ResultStore.emitChange();
      break;
    case actions.SET_FEATURED_IMAGE:
      setFeaturedImage();
      ResultStore.emitChange();
      break;
    case actions.LICENSE_ASSET:
    case actions.DOWNLOAD_ASSET:
    case actions.UPLOAD_WORDPRESS_ASSET:
      setDownloading(true);
      ResultStore.emitChange();
      break;
    case actions.DISPLAY_ACTIVE_STYLE:
      setActiveStyle(event.display);
      ResultStore.emitChange();
      break;
    default:
      // Nothing to do
      break;
  }
});

export default ResultStore;
