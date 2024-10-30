/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import Checkbox from 'material-ui/lib/checkbox';
import bind from 'lodash/function/bind';
import assign from 'lodash/object/assign';
import dispatcher from './../../lib/dispatcher';
import actions from './../../lib/actions';
import colors from './../../lib/colors';

export default React.createClass({

  propTypes: {
    query: React.PropTypes.string,
    facets: React.PropTypes.object.isRequired,
  },

  facetType(value) {
    const facets = this.props.facets;

    // Check if this value is in our facets already, if it is then remove it
    const index = facets.accepts.indexOf(value);
    if (index >= 0) {
      facets.accepts.splice(index, 1);
    } else {
      facets.accepts.push(value);
    }

    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH_FACET,
      facet: 'accepts',
      value: facets.accepts,
    });

    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH,
      query: this.props.query,
      facets: assign(this.props.facets, { page: 1 }),
    });
  },

  facetEditorial() {
    const facets = this.props.facets;

    facets.editorial = (facets.editorial === 'n') ? null : 'n';
    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH_FACET,
      facet: 'editorial',
      value: facets.editorial,
    });

    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH,
      query: this.props.query,
      facets: assign(this.props.facets, { page: 1 }),
    });
  },

  facetOrientation(value) {
    const facets = this.props.facets;

    const index = facets.orientation.indexOf(value);
    if (index >= 0) {
      facets.orientation.splice(index, 1);
    } else {
      facets.orientation.push(value);
    }

    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH_FACET,
      facet: 'orientation',
      value: facets.orientation,
    });

    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH,
      query: this.props.query,
      facets: assign(this.props.facets, { page: 1 }),
    });
  },

  render() {
    const styles = {
      searchFacets: {
        width: '100%',
        margin: '5px 15px 0 15px',
        display: 'block',
        paddingBottom: '5px',
      },

      checkBoxColor: {
        fill: colors.blue,
      },

      searchFacet: {
        display: 'inline-block',
        marginRight: '50px',
      },

      searchFacetValue: {
        verticalAlign: 'middle',
        display: 'inline-block',
        width: '100%',
      },

      checkbox: {
        display: 'inline-block',
        margin: '0 10px -8px 10px',
        width: 'auto',
      },

      label: {
        width: 'auto',
      },

      searchFacetLabel: {
        fontWeight: '700',
        marginTop: '-10px',
        display: 'inline-block',
      },
    };

    return (
      <div style={styles.searchFacets}>
        <div style={styles.searchFacet}>
          <div style={styles.searchFacetValue}>
            <p style={styles.searchFacetLabel}>Image Type: </p>
            <Checkbox
              name="type"
              value="image"
              iconStyle={styles.checkBoxColor}
              label="Images"
              labelStyle={styles.label}
              style={styles.checkbox}
              checked={this.props.facets.accepts.indexOf('photo') >= 0}
              onClick={bind(this.facetType, this, 'photo')}
            />

            <Checkbox
              name="type"
              value="vector"
              iconStyle={styles.checkBoxColor}
              label="Vectors"
              labelStyle={styles.label}
              style={styles.checkbox}
              checked={this.props.facets.accepts.indexOf('vector') >= 0}
              onClick={bind(this.facetType, this, 'vector')}
            />
            </div>
        </div>

        <div style={styles.searchFacet}>
          <div style={styles.searchFacetValue}>
            <p style={styles.searchFacetLabel}>Orientation: </p>
            <Checkbox
              name="orientation"
              value="h"
              labelStyle={styles.label}
              style={styles.checkbox}
              iconStyle={styles.checkBoxColor}
              label="Landscape"
              checked={this.props.facets.orientation.indexOf('h') >= 0}
              onClick={bind(this.facetOrientation, this, 'h')}
            />

            <Checkbox
              name="orientation"
              value="v"
              labelStyle={styles.label}
              style={styles.checkbox}
              iconStyle={styles.checkBoxColor}
              label="Portrait"
              checked={this.props.facets.orientation.indexOf('v') >= 0}
              onClick={bind(this.facetOrientation, this, 'v')}
            />
          </div>
        </div>

        <div style={styles.searchFacet}>
          <div style={styles.searchFacetValue}>
            <p style={styles.searchFacetLabel}>Editorial: </p>
            <Checkbox
              name="editorial"
              value="editorial"
              labelStyle={styles.label}
              style={styles.checkbox}
              iconStyle={styles.checkBoxColor}
              label="Exclude Editorial Images"
              checked={this.props.facets.editorial}
              onClick={bind(this.facetEditorial, this)}
            />
          </div>
        </div>
      </div>
    );
  },
});
