import React from 'react';
import PropTypes from 'prop-types';
import { Link, Switch, Redirect, Route } from 'dva/router';
import { connect } from 'dva';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import BizIcon from '../components/BizIcon';
import { getClientRoutes, getClientSider } from '../common/client';

import styles from './ClientLayout.less';


const getSelectedProjectTitle = (selected, projects) => {
  if (!projects || 0 === projects.length) {
    return '';
  }
  if (!selected || '' === selected) {
    return projects[0].title;
  }
  const i = projects.findIndex((it) => {
    return it.name === selected;
  });
  return -1 === i ? '' : projects[i].title;
};

const ProjectDropdown = ({
  location,
  projects,
  selected,
}) => {
  if (!projects || 0 === projects.length) {
    return null;
  }
  const menuItems = projects.map((it) => {
    return (
      <Menu.Item key={it.name}>
        <Link to={`/p/${it.name}`}>{it.title}</Link>
      </Menu.Item>
    );
  });
  const selectedKeys = [selected || projects[0].selected];
  const menu = (<Menu
    theme="dark"
    selectedKeys={selectedKeys}
  >
    {menuItems}
  </Menu>);
  const classname = location.pathname.match(/^\/p\//) ? styles.activedNavItem : styles.navItem;
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <span className={classname}>
        <span>{getSelectedProjectTitle(selected, projects)}&nbsp;&nbsp;</span>
        <Icon type="down" />
      </span>
    </Dropdown>
  );
};

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

const SiderMenu = ({
  location,
  selected,
}) => {
  const matchObj = location.pathname.match(/^\/[^/]+\//);
  if (null === matchObj) {
    return null;
  }
  const prefix = '/p/' === matchObj[0] ? `${matchObj[0]}${selected}/` : matchObj[0];
  const menuItems = getClientSider(matchObj[0]).map((it) => {
    return (
      <Menu.Item key={it.key}>
        <Link to={`${prefix}${it.key}`}>
          <BizIcon type={it.icon} />
          <span className="nav-text">{it.name}</span>
        </Link>
      </Menu.Item>
    );
  });

  const reg = '/p/' === matchObj[0] ? /^\/[^/]+\/[^/]+\/([^/-]+)/ : /^\/[^/]+\/([^/-]+)/;
  const matObj = location.pathname.match(reg);
  const selectedKeys = null === matObj ? [] : [matObj[1]];

  return (
    <Menu mode="inline" selectedKeys={selectedKeys}>
      {menuItems}
    </Menu>
  );
};

const { Header, Content, Sider } = Layout;

class ClientLayout extends React.PureComponent {
  render() {
    const {
      app,
      location,
      selected,
      userInfo,
      projects,
    } = this.props;
    if (!userInfo || !projects) {
      return null;
    }
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <a className={styles.logo} href="https://www.opensight.cn/">
            <img alt="趣录播" src="//opensight-public.oss-cn-hangzhou.aliyuncs.com/img/logo40x40.png" />
          </a>
          <div className={styles.navBar}>
            <ProjectDropdown location={location} projects={projects} selected={selected} />
          </div>
          <NavExtra userInfo={userInfo} location={location} />
        </Header>
        <Content className={styles.content}>
          <Layout>
            <Sider breakpoint="sm" className={styles.sider}>
              <SiderMenu selected={selected} location={location} />
            </Sider>
            <Layout className={styles.siderRight}>
              <Content style={{ overflow: 'initial' }}>
                <Switch>
                  {getClientRoutes(app)}
                  <Route
                    exact path="/p/:name" render={props => (
                      <Redirect to={`/p/${props.match.params.name}/project`} />
                    )}
                  />
                  <Redirect from="(.*)" to="/u/user" />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Content>
      </Layout>
    );
  }
}


ClientLayout.propTypes = {
  app: PropTypes.object,
  location: PropTypes.object,
};

// export default ClientLayout;
export default connect(state => state.client)(ClientLayout);
