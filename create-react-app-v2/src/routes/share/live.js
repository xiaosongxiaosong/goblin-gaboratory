import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { CommonComponent, LiveComponent, ShareComponent } from '../../components/';

import styles from './index.less';

// const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;

const {
  ProjectInfo,
  CompanyLink,
  SessionCountdownTip,
  FormatBtnGroup,
  getSiderWidth,
} = CommonComponent;

const {
  Preview,
  StartPlayBtn,
  LivePlayer,
  StatefulComponent,
} = LiveComponent;

// const {
//   Info,
//   ProjectInfo,
//   ShowState,
//   ShowPlayer,
//   Cover,
//   Mask,
//   StartPlayBtn,
//   SessionCountdownTip,
//   StatefulComponent,
//   LiveBtnGroup,
//   PlayBackBtn,
//   MobileLink,
//   CompanyLink,
//   WatchPasswdModal,
// } = ShowComponent;

const {
  ShareInfo,
  MobileLink,
} = ShareComponent;


class Live extends React.Component {

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

  componentWillUnmount() {
    $(window).off('resize');
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
      info,
      projectInfo,
      playingState,
      url,
      sessionId,
      supportedFormats,
      selectedFormat,
      dispatch,
    } = this.props;

    return (
      <div className={styles.share}>
        <div className={styles.leftSider} style={{ width: siderWidth }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="介绍" key="1" className={styles.tabpane} style={{ height: tabPaneHeight }} >
              {/* <Info info={info} /> */}
              <ShareInfo info={info} />
              <div className={styles.projectInfoConatiner}>
                <ProjectInfo info={projectInfo} />
              </div>
            </TabPane>
          </Tabs>
          <div className={styles.bottomBar}>
            <CompanyLink />
          </div>
        </div>
        <div className={styles.center} style={{ width: (this.state.width - siderWidth - centerPadding), padding: centerPadding, paddingRight: 0 }} >
          <div className={styles.centerPlayer} style={{ height: (this.state.height - bottomBarHeight - (2 * centerPadding)) }}>
            <LivePlayer playingState={playingState} src={url} format={selectedFormat} params={params} dispatch={dispatch} />
            <Preview info={info} playingState={playingState} />
            {/* <Mask playingState={playingState} /> */}
            <StartPlayBtn playingState={playingState} info={info} dispatch={dispatch} />
            {'waitingForSession' === playingState && <SessionCountdownTip />}
          </div>
          <div className={styles.bottomBar} style={{ height: bottomBarHeight }}>
            <span className={styles.bottomBarLeft}>
              <FormatBtnGroup playingState={playingState} supportedFormats={supportedFormats} selectedFormat={selectedFormat} dispatch={dispatch} />
            </span>
            <span className={styles.bottomBarRight}>
              <MobileLink info={info} />
            </span>
          </div>
        </div>
        <StatefulComponent sessionId={sessionId} info={info} dispatch={dispatch} />
      </div>
    );
  }
}

Live.propTypes = {
  // showId: PropTypes.string,
  params: PropTypes.object,
  info: PropTypes.object,
  projectInfo: PropTypes.object,
  playingState: PropTypes.string,
  url: PropTypes.string,
  sessionId: PropTypes.string,
  supportedFormats: PropTypes.array,
  selectedFormat: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  return { ...state.live };
}

// export default Show;
export default connect(mapStateToProps)(Live);
