import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
import EventPlayModal from './index';


export default function playEventRecord(info) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function render(props) {
    ReactDOM.render(<EventPlayModal {...props} hide={destroy} />, div);
  }

  render({ info });

  return {
    destroy,
  };
}
