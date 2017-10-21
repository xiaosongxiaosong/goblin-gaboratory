import React from 'react';
import PropTypes from 'prop-types';

class ChangYan extends React.Component {

  componentDidMount() {
    $('#SOHUCS').attr('sid', this.props.sid);

    $.ajax({
      url: 'https://changyan.sohu.com/upload/changyan.js',
      dataType: 'script',
      crossDomain: true,
      success: () => {
        window.changyan.api.config({
          appid: 'cysz4Q4lo',
          conf: 'prod_4193b6bf7521a984e9ed89e4407582cc',
        });
      },
    });
  }

  render() {
    if (null === this.props.id) {
      return null;
    }
    return (
      <div id="SOHUCS" />
    );
  }
}

ChangYan.propTypes = {
  sid: PropTypes.string,
};

export default ChangYan;
