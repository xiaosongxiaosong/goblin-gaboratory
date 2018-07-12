import React from 'react';
import PropTypes from 'prop-types';
import { Link, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';
import { Layout, Menu, Icon, Dropdown } from 'antd';
// import BizIcon from '../components/BizIcon';
import { getAdminRoutes, getAdminSider } from '../common/admin';

import styles from './AdminLayout.less';


const NavExtra = ({ userInfo, location }) => {
  if (!userInfo) {
    return null;
  }
  const userPathname = '/u/';
  const reg = new RegExp(`^${userPathname}`);
  const actived = null !== location.pathname.match(reg);
  const selectedKeys = actived ? [userPathname] : [];
  const userClassName = actived ? styles.activedNavItem : styles.navItem;
  return (
    <div className={styles.navExtra}>
      <Link to={userPathname} className={`${userClassName} ${styles.userInfo}`}>{userInfo.title}</Link>
      <div className={`${styles.navItem} ${styles.logout}`}><Icon type="logout" />&nbsp;&nbsp;注销</div>
      <Dropdown
        overlay={<Menu theme="dark" selectedKeys={selectedKeys}>
          <Menu.Item key={userPathname}>
            <Link to={userPathname}>{userInfo.title}</Link>
          </Menu.Item>
          <Menu.Item key="logout"><Icon type="logout" />&nbsp;&nbsp;注销</Menu.Item>
        </Menu>}
        trigger={['click']}
      >
        <span className={styles.more}><Icon type="ellipsis" /></span>
      </Dropdown>
    </div>
  );
};

const isUserPath = (pathname) => {
  return 0 === pathname.indexOf('/user/');
};

const UserSiderMenu = ({ location }) => {
  const selectedKey = location.pathname.replace('/user/', '');
  const menuItems = getAdminSider(it => isUserPath(it.path)).map((it) => {
    return (
      <Menu.Item key={it.key}>
        <Link to={it.path}>
          <Icon type={it.icon} />
          <span>{it.name}</span>
        </Link>
      </Menu.Item>
    );
  });
  return <Menu mode="inline" selectedKeys={[selectedKey]}>{menuItems}</Menu>;
};
const ConsoleSiderMenu = ({ location }) => {
  const match = location.pathname.match(/^\/([^/]+)(\/.*)?/);
  const selectedKey = match && match[1] ? match[1] : '';
  const menuItems = getAdminSider(it => !isUserPath(it.path)).map((it) => {
    return (
      <Menu.Item key={it.key}>
        <Link to={it.path}>
          <Icon type={it.icon} />
          <span>{it.name}</span>
        </Link>
      </Menu.Item>
    );
  });
  return <Menu mode="inline" selectedKeys={[selectedKey]}>{menuItems}</Menu>;
};

const SiderMenu = ({ location }) => {
  if (isUserPath(location.pathname)) {
    return <UserSiderMenu location={location} />;
  } else {
    return <ConsoleSiderMenu location={location} />;
  }
};

const { Header, Content, Sider } = Layout;

class AdminLayout extends React.PureComponent {
  render() {
    const {
      app,
      location,
      userInfo,
    } = this.props;
    if (!userInfo) {
      return null;
    }
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <a className={styles.logo} href="https://www.opensight.cn/">
            <img alt="趣录播" src="//opensight-public.oss-cn-hangzhou.aliyuncs.com/img/logo40x40.png" />
          </a>
          <div className={styles.navBar}>
            <Link to="/dashboard">控制台</Link>
          </div>
          <NavExtra userInfo={userInfo} location={location} />
        </Header>
        <Content className={styles.content}>
          <Layout>
            <Sider breakpoint="sm" className={styles.sider}>
              <SiderMenu location={location} />
            </Sider>
            <Layout className={styles.siderRight}>
              <Content style={{ overflow: 'initial' }}>
                <Switch>
                  {getAdminRoutes(app)}
                  <Redirect from="(.*)" to="/dashboard" />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Content>
      </Layout>
    );
  }
}


AdminLayout.propTypes = {
  app: PropTypes.object,
  location: PropTypes.object,
  userInfo: PropTypes.object,
};

// export default AdminLayout;
export default connect(state => state.admin)(AdminLayout);
