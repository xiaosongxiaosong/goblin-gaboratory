import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Switch, Route, Redirect, routerRedux } from 'dva/router';
import { Layout, Menu } from 'antd';
import All from './All';
import Discovery from './Discovery';
import RepoInfo from './RepoInfo';
import Repo from './Repo';
import Favorites from './Favorites';
import styles from './App.less';

const { Header, Content, Sider } = Layout;


class App extends React.PureComponent {
  // constructor(props) {
  //   super(props);

  //   this.handleClick = this.handleClick.bind(this);
  // }

  handleClick = ({ key }) => {
    this.props.dispatch(routerRedux.push(key));
  }

  render() {
    const { owners } = this.props;
    // const handleClick = ({ key }) => {
    //   dispatch({ type: 'app/routerReduxPush', payload: key });
    // };
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <a className={styles.logo} href="https://www.opensight.cn/">
            <img alt="xiaosong" src="logo128x128.png" />
          </a>
          <div className={styles.navBar} />
          <div className={styles.navExtra} />
        </Header>
        <Content className={styles.content}>
          <Layout>
            <Sider breakpoint="md" className={styles.sider} width="320">
              <Menu
                defaultSelectedKeys={['/all']}
                defaultOpenKeys={['/repos']}
                mode="inline"
                // theme="dark"
                onClick={this.handleClick}
              >
                <Menu.Item key="/all">所有</Menu.Item>
                <Menu.Item key="/favorites">我的收藏</Menu.Item>
                <Menu.SubMenu key="/repos" title="我的订阅">
                  {owners && owners.map(it => it && <Menu.Item key={`/repos/${it.login}/${it.repo}`}>{it.name}（{it.login}）</Menu.Item>)}
                </Menu.SubMenu>
                <Menu.Item key="/discovery">发现</Menu.Item>
              </Menu>
            </Sider>
            <Layout className={styles.siderRight}>
              <Content style={{ overflow: 'initial' }}>
                <Switch>
                  <Route path="/all" exact component={All} />
                  <Route path="/favorites" exact component={Favorites} />
                  <Route path="/discovery" exact component={Discovery} />
                  <Route path="/discovery/:owner/:repo" exact component={RepoInfo} />
                  <Route path="/repos/:owner/:repo" exact component={Repo} />
                  <Redirect push from="*" to="/all" />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

App.propTypes = {
  // repos: PropTypes.array,
  // issues: PropTypes.array,
  dispatch: PropTypes.func,
};

export default connect(state => ({
  owners: state.app.owners,
}))(App);
