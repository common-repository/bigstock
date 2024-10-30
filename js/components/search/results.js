/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import debounce from 'lodash/function/debounce';
import bind from 'lodash/function/bind';
import ResultStore from './../../stores/result';
import ResultRow from './result/row';
import Mosaic from './../../dist/mosaic';
import colors from './../../lib/colors';
import dispatcher from './../../lib/dispatcher';
import actions from './../../lib/actions';

export default React.createClass({

  propTypes: {
    results: React.PropTypes.array.isRequired,
    facets: React.PropTypes.object.isRequired,
    hasNext: React.PropTypes.bool.isRequired,
    query: React.PropTypes.string,
    height: React.PropTypes.number.isRequired,
    vw: React.PropTypes.number.isRequired,
  },

  getInitialState() {
    return {
      containerWidth: 0,
      downloading: ResultStore.getDownloading(),
      swapped: ResultStore.getSwapped(),
      inline: ResultStore.getDetail(),
      similar: ResultStore.getSimilar(),
      activeStyle: ResultStore.isActiveStyle(),
      licenses: ResultStore.getLicenses(),
      setFeatured: ResultStore.getFeaturedImage(),
      noSearch: true,
    };
  },

  componentWillMount() {
    this.boundUpdate = bind(this.update, this);
  },

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    ResultStore.addChangeListener(this.boundUpdate);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    ResultStore.removeChangeListener(this.boundUpdate);
  },

  handleResize() {
    const elem = document.getElementById('bsp-container');
    if (elem) {
      this.setState({
        containerWidth: elem.offsetWidth,
      });
    }
  },

  nextPage() {
    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH_FACET,
      facet: 'page',
      value: (this.props.facets.page + 1),
    });

    dispatcher.dispatch({
      type: actions.REFRESH_SEARCH,
      query: this.props.query,
      facets: this.props.facets,
    });
  },

  update() {
    this.setState({
      downloading: ResultStore.getDownloading(),
      swapped: ResultStore.getSwapped(),
      inline: ResultStore.getDetail(),
      similar: ResultStore.getSimilar(),
      activeStyle: ResultStore.isActiveStyle(),
      licenses: ResultStore.getLicenses(),
      setFeatured: ResultStore.getFeaturedImage(),
      noSearch: false,
    });
  },

  render() {
    const containerElem = document.getElementById('bsp-container');

    const styles = {
      resultsContainer: {
        overflowX: 'hidden',
        overflowY: 'scroll',
        display: 'block',
        marginTop: '2px',
        width: '100%',
        height: `${this.props.height}px`,
      },

      icon: {
        fontSize: '18px',
        verticalAlign: 'middle',
      },

      blankSearch: {
        height: '100%',
        width: '100%',
        position: 'relative',
      },

      blankSearchText: {
        position: 'absolute',
        top: '33%',
        left: '50%',
        textAlign: 'center',
        color: colors.gray,
        transform: 'translate(-50%, -50%)',
        fontSize: '26px',
      },

      nextButton: {
        backgroundColor: colors.blue,
        color: colors.white,
        padding: '14px 18px',
        fontSize: '14px',
        borderRadius: '2px',
        border: '0',
      },

      nextButtonContainer: {
        display: 'block',
        textAlign: 'center',
        width: '100%',
        margin: '40px 0',
      },
    };

    // Draw the default 'No Results' screen
    let screen = (
      <div id="bsp-results" style={styles.resultsContainer}>
        <div style={styles.blankSearch}>
          <p style={styles.blankSearchText}>We couldn't find any images matching your query, maybe try something else?</p>
        </div>
      </div>
    );

    const nextButton = (this.props.hasNext) ?
      <div style={styles.nextButtonContainer}><span style={styles.nextButton} onClick={debounce(bind(this.nextPage, this), 400)} className="confirm-button">Next Page <i style={styles.icon} className="material-icons">keyboard_arrow_right</i></span></div> :
      null;
    // Prevent the grid from loading if we aren't in the application
    if (this.props.results.length && containerElem) {
      // Setup the mosaic grid
      const grid = new Mosaic.Grid({
        width: this.state.containerWidth || containerElem.offsetWidth,
        margin: 2,
        border: 0,
        constraints: {
          minHeight: 220,
          maxHeight: 300,
          maxWidth: 550,
          tolerance: 1.0,
        },
      });

      // Parse into rows
      const rows = grid.layout(this.props.results.map((result) => {
        const width = result.preview.width;
        const height = result.preview.height;
        result.height = ~~height;
        result.width = ~~width;
        result.url = result.preview.url;
        return result;
      }));

      const results = rows.map((row, i) => {
        return (
          <ResultRow
            key={i}
            setFeatured={this.state.setFeatured}
            facets={this.props.facets}
            downloading={this.state.downloading}
            vw={this.props.vw}
            results={row}
            licenses={this.state.licenses}
            inline={this.state.inline}
            similar={this.state.similar}
            swapped={this.state.swapped}
            activeStyle={this.state.activeStyle}
          />
        );
      });
      screen = (
        <div id="bsp-results" style={styles.resultsContainer}>
          {results}
          {nextButton}
        </div>
      );
    } else if (this.state.noSearch) {
      screen = (
        <div id="bsp-results" style={styles.resultsContainer}>
          <div style={styles.blankSearch}>
            <p style={styles.blankSearchText}>Find the perfect image by searching above...</p>
          </div>
        </div>
      );
    }
    return screen;
  },
});
