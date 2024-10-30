/**
 * @package Bigstock
 * @version 1.0.0
 * @author BigstockPhoto
 * @copyright Shutterstock, Inc.
 */

import React from 'react';
import ImageResult from './image';
import InlineDetail from './../inline';

export default React.createClass({

  propTypes: {
    swapped: React.PropTypes.object,
    results: React.PropTypes.array.isRequired,
    licenses: React.PropTypes.array.isRequired,
    inline: React.PropTypes.object.isRequired,
    downloading: React.PropTypes.bool.isRequired,
    similar: React.PropTypes.array,
    vw: React.PropTypes.number.isRequired,
    facets: React.PropTypes.object.isRequired,
    activeStyle: React.PropTypes.bool.isRequired,
    setFeatured: React.PropTypes.bool.isRequired,
  },

  render() {
    const styles = {
      bspGrid: {
        marginLeft: '4px',
        display: 'flex',
        flexWrap: 'wrap',
      },
    };

    let screen = (<div></div>);
    if (this.props.results) {
      // Determine if we need to display inline pic
      let inline = false;
      // Loop through the results to form JSX elems
      const results = this.props.results.map((result) => {
        const { image, dimensions } = result;
        const active = this.props.inline && this.props.inline.id === image.id;
        if (active) {
          if (this.props.swapped && this.props.swapped.id) {
            inline = (<InlineDetail setFeatured={this.props.setFeatured} licenses={this.props.licenses} detail={this.props.swapped} similar={this.props.similar} downloading={this.props.downloading} vw={this.props.vw} facets={this.props.facets} />);
          } else {
            inline = (<InlineDetail setFeatured={this.props.setFeatured} licenses={this.props.licenses} detail={this.props.inline} similar={this.props.similar} downloading={this.props.downloading} vw={this.props.vw} facets={this.props.facets} />);
          }
        }

        return (
          <ImageResult
            active={active}
            activeStyle={this.props.activeStyle}
            image={image}
            dimensions={dimensions}
            key={image.id}
          />
        );
      });
      screen = (
        <div style={styles.bspGrid}>
          {results}
          {inline}
        </div>
      );
    }
    return screen;
  },
});
