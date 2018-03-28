import React from 'react';
import PropTypes from 'prop-types';
import request from '../utils/request';

class Image extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      url: undefined,
    };
  }
  componentDidMount() {
    this.load();
  }
  async load() {
    const { data } = await request(this.props.src);
    if (data) {
      // this.setState({ url: this.props.src });
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({ url: reader.result });
      };
      reader.readAsDataUrl(data);
    } else {
      this.setState({ url: null });
    }
  }
  render() {
    if (undefined === this.state.url) {
      return null;
    } else if (null === this.state.url) {
      return (<React.Fragment>{this.props.alt}</React.Fragment>);
    }
    return (<img src={this.state.url} alt={this.props.alt} />);
  }
}

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default Image;
