import React from 'react';
import PropTypes from 'prop-types';

class StatefulComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keepAliveInterval: null,
      sessionWaitingInterval: null,
      seconds: 0,
    };
  }
  componentWillMount() {
    // this.layout();
    // $(window).resize(() => {
    //   this.layout();
    // });
    // this.check({}, this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkNextProps(nextProps);
  }

  componentWillUnmount() {
    this.stopKeepAlive();
  }

  layout() {
    const width = $(window).width();
    const height = $(window).height();
    this.props.dispatch({ type: 'live/resize', payload: { width, height } });
  }

  checkNextProps(nextProps) {
    if (null === this.props.sessionId && null !== nextProps.sessionId) {
      this.startKeepAlive();
    } else if (null !== this.props.sessionId && null === nextProps.sessionId) {
      this.stopKeepAlive();
    }

    if ('waitingForSession' !== this.props.playingState && 'waitingForSession' === nextProps.playingState) {
      this.startWaitingSession();
    } else if ('waitingForSession' === this.props.playingState && 'waitingForSession' !== nextProps.playingState) {
      this.stopWaitingSession();
    }
  }

  startKeepAlive() {
    this.stopKeepAlive();
    const keepAliveInterval = window.setInterval(() => {
      this.props.dispatch({ type: 'live/keepAlive' });
    }, 20 * 1000);
    this.setState({ keepAliveInterval });
  }

  stopKeepAlive() {
    if (null !== this.state.keepAliveInterval) {
      window.clearInterval(this.state.keepAliveInterval);
      this.setState({ keepAliveInterval: null });
    }
  }

  startWaitingSession() {
    this.stopWaitingSession();
    this.setState({ seconds: 12 });
    this.props.dispatch({ type: 'live/setWaitingSeconds', payload: 10 });
    const sessionWaitingInterval = window.setInterval(() => {
      const seconds = this.state.seconds - 1;
      this.setState({ seconds });
      this.props.dispatch({ type: 'live/setWaitingSeconds', payload: seconds });
      if (0 >= seconds) {
        this.stopWaitingSession();
      }
    }, 1000);
    this.setState({ sessionWaitingInterval });
  }

  stopWaitingSession() {
    if (null !== this.state.sessionWaitingInterval) {
      window.clearInterval(this.state.sessionWaitingInterval);
      this.setState({ sessionWaitingInterval: null });
    }
    this.props.dispatch({ type: 'live/setWaitingSeconds', payload: 0 });
    this.setState({ seconds: 0 });
  }

  render() {
    return null;
  }
}

StatefulComponent.propTypes = {
  sessionId: PropTypes.string,
  playingState: PropTypes.string,
  dispatch: PropTypes.func,
};

export default StatefulComponent;
