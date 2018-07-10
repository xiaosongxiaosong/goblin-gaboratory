import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

const Events = ({
  match,
}) => {
  return (
    <div match={match} selected="events">
      Events
    </div>
  );
};

function mapStateToProps(state) {
  return { ...state.project, ...state.events };
}

Events.propTypes = {
  match: PropTypes.object,
};

// export default Show;
export default connect(mapStateToProps)(Events);
