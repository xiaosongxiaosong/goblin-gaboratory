import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tabs, Icon } from 'antd';
import { ShowComponent, ShareComponent, CommonComponent } from '../../components/';

import styles from './index.less';

// const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;

const {
  // Info,
  ProjectInfo,
  CompanyLink,
  SessionCountdownTip,
  getSiderWidth,
} = CommonComponent;

const {
  // ProjectInfo,
  ShowState,
  ShowPlayer,
  Cover,
  Chat,
  StartPlayBtn,
  StatefulComponent,
  LiveBtnGroup,
  PlayBackBtn,
  // CompanyLink,
  // WatchPasswdModal,
} = ShowComponent;

const {
  ShareInfo,
  MobileLink,
} = ShareComponent;


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

  componentDidMount() {
    this.layout();
    $(window).resize(() => {
      this.layout();
    });
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
    const siderWidth = getSiderWidth(this.state.width);
    const bottomBarHeight = 50;
    const centerPadding = 8;
    const tabsBarHeight = 62;
    const tabPaneHeight = this.state.height - tabsBarHeight - bottomBarHeight;

    const {
      params,
      shareInfo,
      info,
      projectInfo,
      playingState,
      url,
      sessionId,
      statistic,
      countdown,
      supportedFormats,
      selectedFormat,
      // passwdModalType,
      roleInfo,
      userInfo,
      chatroom,
      dispatch,
    } = this.props;

    return (
      <div className={styles.share}>
        <div className={styles.leftSider} style={{ width: siderWidth }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="介绍" key="1" className={styles.tabpane} style={{ height: tabPaneHeight }} >
              <ShareInfo info={shareInfo} showInfo={info} />
              <div className={styles.projectInfoConatiner}>
                <ProjectInfo info={projectInfo} />
              </div>
            </TabPane>
            <TabPane tab="讨论" key="2" className={`${styles.tabpane} ${styles.chattabpane}`} style={{ height: tabPaneHeight }} >
              <Chat chatroom={chatroom} roleInfo={roleInfo} userInfo={userInfo} dispatch={dispatch} />
            </TabPane>
          </Tabs>
          <div className={styles.bottomBar}>
            <CompanyLink />
          </div>
        </div>
        <div className={styles.center} style={{ width: (this.state.width - siderWidth - centerPadding), padding: centerPadding, paddingRight: 0 }} >
          <div className={styles.centerPlayer} style={{ height: (this.state.height - bottomBarHeight - (2 * centerPadding)) }}>
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
              <MobileLink info={shareInfo} />
            </span>
          </div>
        </div>
        <StatefulComponent sessionId={sessionId} info={info} dispatch={dispatch} />
        {/* <WatchPasswdModal type={passwdModalType} dispatch={dispatch} /> */}
      </div>
    );
  }
}

Show.propTypes = {
  params: PropTypes.object,
  shareInfo: PropTypes.object,
  info: PropTypes.object,
  projectInfo: PropTypes.object,
  playingState: PropTypes.string,
  url: PropTypes.string,
  sessionId: PropTypes.string,
  statistic: PropTypes.object,
  supportedFormats: PropTypes.array,
  selectedFormat: PropTypes.object,
  // passwdModalType: PropTypes.string,
  roleInfo: PropTypes.object,
  userInfo: PropTypes.object,
  chatroom: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  return { ...state.show, ...state.share };
}

// export default Show;
export default connect(mapStateToProps)(Show);
