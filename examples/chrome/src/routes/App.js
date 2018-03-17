import React from 'react';
import { connect } from 'dva';
import { Switch, Route, Redirect } from 'dva/router';
import { Layout, Menu } from 'antd';
import All from './All';
import Discovery from './Discovery';
import RepoInfo from './RepoInfo';
import Repo from './Repo';
import Favorites from './Favorites';
import styles from './App.less';

const { Header, Content, Sider } = Layout;

// function App() {
//   return (
//     // <div>
//     //   <ul>
//     //     <li><Link to="/all">all</Link></li>
//     //     <li><Link to="/favorites">favorites</Link></li>
//     //     <li><Link to="/discovery">discovery</Link></li>
//     //     <li><Link to="/discovery/aaa">RepoInfo</Link></li>
//     //     <li><Link to="/repo/aaa">repo</Link></li>
//     //   </ul>
//     //   <Switch>
//     //     <Route path="/all" exact component={All} />
//     //     <Route path="/favorites" exact component={Favorites} />
//     //     <Route path="/discovery" exact component={Discovery} />
//     //     <Route path="/discovery/:repo" exact component={RepoInfo} />
//     //     <Route path="/repo/:repo" exact component={Repo} />
//     //     <Redirect push from="*" to="/all" />
//     //   </Switch>
//     // </div>
//     <Layout className={styles.layout}>
//       <Header className={styles.header}>
//         <a className={styles.logo} href="https://www.opensight.cn/">
//           <img alt="xiaosong" src="logo128x128.png" />
//         </a>
//         <div className={styles.navBar} />
//         <div className={styles.navExtra} />
//       </Header>
//       <Content className={styles.content}>
//         <Layout>
//           <Sider breakpoint="md" className={styles.sider} width="320">
//             <Menu
//               defaultSelectedKeys={['1']}
//               defaultOpenKeys={['sub1']}
//               mode="inline"
//             >
//               <Menu.Item key="1">
//                 <span>all</span>
//               </Menu.Item>
//               <Menu.Item key="2">
//                 <span>Option 2</span>
//               </Menu.Item>
//               <Menu.Item key="3">
//                 <span>Option 3</span>
//               </Menu.Item>
//               <Menu.SubMenu key="sub1" title={<span><span>Navigation One</span></span>}>
//                 <Menu.Item key="5">Option 5</Menu.Item>
//                 <Menu.Item key="6">Option 6</Menu.Item>
//                 <Menu.Item key="7">Option 7</Menu.Item>
//                 <Menu.Item key="8">Option 8</Menu.Item>
//               </Menu.SubMenu>
//               <Menu.SubMenu key="sub2" title={<span><span>Navigation Two</span></span>}>
//                 <Menu.Item key="9">Option 9</Menu.Item>
//                 <Menu.Item key="10">Option 10</Menu.Item>
//                 <Menu.SubMenu key="sub3" title="Menu.SubMenu">
//                   <Menu.Item key="11">Option 11</Menu.Item>
//                   <Menu.Item key="12">Option 12</Menu.Item>
//                 </Menu.SubMenu>
//               </Menu.SubMenu>
//             </Menu>
//           </Sider>
//           <Layout className={styles.siderRight}>
//             <Content style={{ overflow: 'initial' }}>
//               <Switch>
//                 <Route path="/all" exact component={All} />
//                 <Route path="/favorites" exact component={Favorites} />
//                 <Route path="/discovery" exact component={Discovery} />
//                 <Route path="/discovery/:repo" exact component={RepoInfo} />
//                 <Route path="/repo/:repo" exact component={Repo} />
//                 <Redirect push from="*" to="/all" />
//               </Switch>
//             </Content>
//           </Layout>
//         </Layout>
//       </Content>
//     </Layout>
//   );
// }

// App.propTypes = {
// };

// export default connect()(App);
class App extends React.PureComponent {

  render() {
    return (
      // <div>
      //   <ul>
      //     <li><Link to="/all">all</Link></li>
      //     <li><Link to="/favorites">favorites</Link></li>
      //     <li><Link to="/discovery">discovery</Link></li>
      //     <li><Link to="/discovery/aaa">RepoInfo</Link></li>
      //     <li><Link to="/repo/aaa">repo</Link></li>
      //   </ul>
      //   <Switch>
      //     <Route path="/all" exact component={All} />
      //     <Route path="/favorites" exact component={Favorites} />
      //     <Route path="/discovery" exact component={Discovery} />
      //     <Route path="/discovery/:repo" exact component={RepoInfo} />
      //     <Route path="/repo/:repo" exact component={Repo} />
      //     <Redirect push from="*" to="/all" />
      //   </Switch>
      // </div>
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
              >
                <Menu.Item key="/all">所有</Menu.Item>
                <Menu.Item key="/favorites">我的收藏</Menu.Item>
                <Menu.SubMenu key="/repos" title="我的订阅">
                  {this.props.owners && this.props.owners.map(it => it && <Menu.Item key={`/repos/${it.login}/${it.repo}`}>{it.name}（{it.login}）</Menu.Item>)}
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
};

export default connect(state => ({
  owners: state.app.owners,
}))(App);
