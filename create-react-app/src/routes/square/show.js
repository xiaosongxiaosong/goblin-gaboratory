import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tabs, Icon } from 'antd';
import { ShowComponent, CommonComponent, SquareComponent } from '../../components/';

import styles from './index.less';

// const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;

const {
  Info,
  ProjectInfo,
  CompanyLink,
  SessionCountdownTip,
  // getSiderWidth,
} = CommonComponent;

const {
  MobileLink,
  UserInfo,
} = SquareComponent;

const {
  ShowState,
  ShowPlayer,
  Cover,
  StartPlayBtn,
  StatefulComponent,
  LiveBtnGroup,
  PlayBackBtn,
  PasswdModal,
  Chat,
} = ShowComponent;


class Show extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabsBarHeight: 70,
      width: 1920,
      height: 950,
    };

    // This binding is necessary to make `this` work in the callback
    // this.start = this.start.bind(this);
    // this.startPlay = this.startPlay.bind(this);
    // this.startReplay = this.startReplay.bind(this);
  }

  // componentWillMount() {
  //   // debugger;
  //   this.props.dispatch({ type: 'show/init', payload: this.props.routeParams });
  // }

  componentDidMount() {
    // debugger;
    this.layout();
    $(window).resize(() => {
      this.layout();
    });
  }

  componentWillUnmount() {
    // debugger;
    this.props.dispatch({ type: 'show/stopPlay' });
    this.props.dispatch({ type: 'show/reset' });
  }

  layout() {
    const width = $(window).width();
    const height = $(window).height();
    const tabsBarHeight = $(`.${styles.leftSider} .ant-tabs-bar`).outerHeight() + 34;

    this.setState({ width, height, tabsBarHeight });
  }

  // start() {
  //   if (playingState === 'inited') {
  //     if (info.state === 1) {
  //       dispatch({ type: 'show/startPlay' });
  //     } else if (info.state !== 0) {
  //       dispatch({ type: 'show/startReplay' });
  //     }
  //   }
  // }

  render() {
    // const siderWidth = getSiderWidth(this.state.width);
    const headerHeight = 50;
    const bottomBarHeight = 50;
    const padding = 8;
    const tabsBarHeight = 52;
    const tabPaneHeight = this.state.height - tabsBarHeight - bottomBarHeight - headerHeight - (2 * padding);
    // const playerWidth = this.state.width - headerHeight - bottomBarHeight - (2 * centerPadding);
    const playerHeight = this.state.height - headerHeight - bottomBarHeight - (2 * padding);

    const {
      userInfo,
      params,
      info,
      projectInfo,
      playingState,
      url,
      sessionId,
      statistic,
      countdown,
      supportedFormats,
      selectedFormat,
      passwdModalVisible,
      roleInfo,
      chatroom,
      dispatch,
    } = this.props;

    return (
      <div className={styles.layout}>
        <div className={styles.header}>
          <div className={styles.logo}>
            {info && <img src={info.cover_url} alt="" />}
          </div>
          <div className={styles.navbar}>
            {info && <h1>{info.name}</h1>}
          </div>
          <div className={styles.navbarExtra}>
            <UserInfo info={userInfo} dispatch={dispatch} />
          </div>
        </div>
        <div className={styles.sider}>
          <div className={styles.siderContainer}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="介绍" key="1" className={`${styles.tabpane} ${styles.info}`} style={{ height: tabPaneHeight }} >
                <Info info={info} />
                <div className={styles.projectInfoConatiner}>
                  <ProjectInfo info={projectInfo} className={styles.projectInfoConatiner} />
                </div>
              </TabPane>
              <TabPane tab="讨论" key="2" className={styles.tabpane} style={{ height: tabPaneHeight }} >
                <Chat chatroom={chatroom} userInfo={userInfo} roleInfo={roleInfo} dispatch={dispatch} />
              </TabPane>
            </Tabs>
            <div className={styles.bottomBar}>
              <CompanyLink />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.center}>
            <div className={styles.centerPlayer} style={{ height: playerHeight }}>
              <Cover info={info} playingState={playingState} />
              <ShowPlayer playingState={playingState} src={url} format={selectedFormat} params={params} dispatch={dispatch} />
              <StartPlayBtn playingState={playingState} info={info} dispatch={dispatch} />
              {'waitingForSession' === playingState && <SessionCountdownTip />}
            </div>
            <div className={styles.bottomBar} style={{ height: bottomBarHeight }}>
              <span className={styles.bottomBarLeft}>
                <LiveBtnGroup playingState={playingState} info={info} supportedFormats={supportedFormats} selectedFormat={selectedFormat} dispatch={dispatch} />
                <PlayBackBtn playingState={playingState} info={info} dispatch={dispatch} />
                <ShowState info={info} countdown={countdown} />
              </span>
              <span className={styles.bottomBarRight}>
                <span className={styles.bottomBarItem}><Icon type="user" />&nbsp;{statistic && (statistic.total_session_count + statistic.total_vod_session_count)}</span>
                <span className={styles.bottomBarDivide} />
                <MobileLink info={info} />
              </span>
            </div>
          </div>
        </div>
        <StatefulComponent sessionId={sessionId} info={info} dispatch={dispatch} />
        <PasswdModal visible={passwdModalVisible} dispatch={dispatch} />
      </div>
    );
  }
}

Show.propTypes = {
  params: PropTypes.object,
  info: PropTypes.object,
  projectInfo: PropTypes.object,
  playingState: PropTypes.string,
  url: PropTypes.string,
  // sessionCountdown: PropTypes.number,
  sessionId: PropTypes.string,
  statistic: PropTypes.object,
  supportedFormats: PropTypes.array,
  selectedFormat: PropTypes.object,
  passwdModalVisible: PropTypes.bool,
  roleInfo: PropTypes.object,
  chatroom: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  return { ...state.show, ...state.square };
}

// export default Show;
export default connect(mapStateToProps)(Show);
