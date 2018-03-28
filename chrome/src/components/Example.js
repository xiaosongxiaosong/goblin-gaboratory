import React from 'react';
import PropTypes from 'prop-types';


class Example extends React.PureComponent {
  // constructor(props) {
  //   super(props);

  //   this.onSearch = this.onSearch.bind(this);
  //   this.onRefresh = this.onRefresh.bind(this);
  //   this.onPageChange = this.onPageChange.bind(this);
  // }
  render() {
    return (
      <React.Fragment>{this.props.porp}</React.Fragment>
    );
  }
}


Example.propTypes = {
  porp: PropTypes.string,
};

// export default Show;
export default Example;
