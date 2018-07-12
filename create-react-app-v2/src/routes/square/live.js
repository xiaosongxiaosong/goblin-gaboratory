import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { CommonComponent, LiveComponent } from '../../components/';

import styles from './index.less';

// const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;
const {
  Info,
  ProjectInfo,
  CompanyLink,
  SessionCountdownTip,
  getSiderWidth,
} = CommonComponent;

const {
  Preview,
  StartPlayBtn,
  FormatBtnGroup,
  QualityBtnGroup,
  PublicInfo,
  MobileLink,
  LivePlayer,
  StatefulComponent,
} = LiveComponent;


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

  layout() {
    const width = $(window).width();
    const height = $(window).height();
    const tabsBarHeight = $(`.${styles.leftSider} .ant-tabs-bar`).outerHeight() + 34;

    this.setState({ width, height, tabsBarHeight });
  }

  // start() {
  //   if (playingState === 'inited') {
  //     if (info.state === 1) {
  //       dispatch({ type: 'Live/startPlay' });
  //     } else if (info.state !== 0) {
  //       dispatch({ type: 'Live/startReplay' });
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
      info,
      projectInfo,
      playingState,
      url,
      sessionId,
      // statistic,
      supportedFormats,
      selectedFormat,
      supportedQualitys,
      selectedQuality,
      bInPublicTimeRange,
      dispatch,
    } = this.props;

    return (
      <div className={styles.square}>
        <div className={styles.leftSider} style={{ width: siderWidth }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="介绍" key="1" className={styles.tabpane} style={{ height: tabPaneHeight }} >
              <Info info={info} />
              <div className={styles.tabpaneBottom}>
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
            <Preview playingState={playingState} info={info} />
            <LivePlayer playingState={playingState} src={url} format={selectedFormat} dispatch={dispatch} />
            <StartPlayBtn playingState={playingState} info={info} bInPublicTimeRange={bInPublicTimeRange} dispatch={dispatch} />
            {'waitingForSession' === playingState && <SessionCountdownTip />}
          </div>
          <div className={styles.bottomBar} style={{ height: bottomBarHeight }}>
            <span className={styles.bottomBarLeft}>
              <FormatBtnGroup playingState={playingState} info={info} bInPublicTimeRange={bInPublicTimeRange} supportedFormats={supportedFormats} selectedFormat={selectedFormat} dispatch={dispatch} />
              <QualityBtnGroup playingState={playingState} info={info} bInPublicTimeRange={bInPublicTimeRange} supportedQualitys={supportedQualitys} selectedQuality={selectedQuality} dispatch={dispatch} />
              <PublicInfo info={info} />
              {/* 公开时段 */}
            </span>
            <span className={styles.bottomBarRight}>
              <MobileLink info={info} />
            </span>
          </div>
        </div>
        <StatefulComponent sessionId={sessionId} dispatch={dispatch} />
      </div>
    );
  }
}

Live.propTypes = {
  // showId: PropTypes.string,
  info: PropTypes.object,
  projectInfo: PropTypes.object,
  playingState: PropTypes.string,
  url: PropTypes.string,
  sessionId: PropTypes.string,
  // statistic: PropTypes.object,
  supportedFormats: PropTypes.array,
  selectedFormat: PropTypes.object,
  supportedQualitys: PropTypes.array,
  selectedQuality: PropTypes.object,
  bInPublicTimeRange: PropTypes.bool,
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  return { ...state.live };
}

// export default Show;
export default connect(mapStateToProps)(Live);
