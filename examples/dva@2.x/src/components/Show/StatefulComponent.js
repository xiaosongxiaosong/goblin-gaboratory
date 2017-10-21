import React from 'react';
import PropTypes from 'prop-types';

class StatefulComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keepAliveInterval: null,
      sessionWaitingInterval: null,
      showStartInterval: null,
      seconds: 0,
      start: null,
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
    this.props.dispatch({ type: 'show/resize', payload: { width, height } });
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

    if (null === this.props.info && null !== nextProps.info && 0 === nextProps.info.state) {
      this.setState({ start: nextProps.info.start });
      this.startWaitingShow();
    } else if (null !== this.props.info && null === nextProps.info) {
      this.setState({ start: null });
      this.stopWaitingShow();
    }
  }

  startKeepAlive() {
    this.stopKeepAlive();
    const keepAliveInterval = window.setInterval(() => {
      this.props.dispatch({ type: 'show/keepAlive' });
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
    this.props.dispatch({ type: 'show/setWaitingSeconds', payload: 10 });
    const sessionWaitingInterval = window.setInterval(() => {
      const seconds = this.state.seconds - 1;
      this.setState({ seconds });
      this.props.dispatch({ type: 'show/setWaitingSeconds', payload: seconds });
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
    this.props.dispatch({ type: 'show/setWaitingSeconds', payload: 0 });
    this.setState({ seconds: 0 });
  }

  startWaitingShow() {
    this.stopWaitingShow();
    const showStartInterval = window.setInterval(() => {
      if (null === this.state.start) {
        this.stopWaitingShow();
        return;
      }
      const time = new Date().getTime();
      const countdown = this.state.start - time;
      if (0 >= countdown) {
        this.stopWaitingShow();
      } else {
        this.props.dispatch({ type: 'show/setShowCountdown', payload: countdown });
      }
    }, 1000);
    this.setState({ showStartInterval });
  }

  stopWaitingShow() {
    if (null !== this.state.showStartInterval) {
      window.clearInterval(this.state.showStartInterval);
      this.setState({ showStartInterval: null });
    }
    this.props.dispatch({ type: 'show/setShowCountdown', payload: null });
  }

  render() {
    return (
      <div style={{ display: 'none' }} />
    );
  }
}

StatefulComponent.propTypes = {
  sessionId: PropTypes.string,
  playingState: PropTypes.string,
  info: PropTypes.object,
  dispatch: PropTypes.func,
};

export default StatefulComponent;
