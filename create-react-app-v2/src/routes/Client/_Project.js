import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Menu, Dropdown, Icon, Avatar } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import ProjectInfo from './common/ProjectInfo';
import ProjectAnalysis from './project/ProjectAnalysis';
import styles from './index.less';

const getMenuTtem = (prefix) => {
  return (it) => {
    return (
      <Menu.Item key={it.key}>
        <Link to={`${prefix}${it.path}`}>{it.name}</Link>
      </Menu.Item>
    );
  };
};

const ProjectHeaderContent = ({
  selectedProject,
}) => {
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar shape="square" size="large" src={selectedProject.logo_url} />
      </div>
      <div className={styles.content}>
        <ProjectInfo info={selectedProject} />
      </div>
    </div>
  );
};

const ProjectHeaderAction = ({
  selectedProject,
  roleInfo,
  dispatch,
}) => {
  const prefix = `/p/${selectedProject.name}`;
  const menuItem = getMenuTtem(prefix);
  const menuItems = [{
    key: 'logo',
    name: '上传封面',
    path: '/project/logo',
  }, {
    key: 'address',
    name: '设置地址',
    path: '/project/address',
  }, {
    key: 'phone',
    name: '登记电话',
    path: '/project/phone',
  }].map(menuItem);

  if (roleInfo) {
    menuItems.push(<Menu.Divider key="divider" />);
    if (1 === roleInfo.role) {
      menuItems.push(<Menu.Item key="exit">退出商户</Menu.Item>);
    } else {
      menuItems.push(<Menu.Item key="transfer">转让商户</Menu.Item>);
    }
  }

  const onClick = ({ key }) => {
    if ('exit' === key) {
      dispatch({ type: 'project/exitProject' });
    } else if ('transfer' === key) {
      dispatch({ type: 'project/transferProject' });
    }
  };
  const menu = (
    <Menu onClick={onClick}>{menuItems}</Menu>
  );

  return (
    <div>
      <Button type="primary" href={`#${prefix}/project/info`}>编辑</Button>
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
        <Button><Icon type="ellipsis" /></Button>
      </Dropdown>
    </div>
  );
};

const Project = ({
  selectedProject,
  roleInfo,
  dispatch,
}) => {
  return (
    <div>
      <PageHeader
        title={selectedProject.title}
        content={<ProjectHeaderContent selectedProject={selectedProject} />}
        action={<ProjectHeaderAction selectedProject={selectedProject} roleInfo={roleInfo} dispatch={dispatch} />}
      />
      <ProjectAnalysis name={selectedProject.name} />
    </div>
  );
};

function mapStateToProps(state) {
  return { ...state.project };
}

Project.propTypes = {
  selectedProject: PropTypes.object,
  roleInfo: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(mapStateToProps)(Project);
