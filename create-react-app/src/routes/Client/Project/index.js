import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Menu, Dropdown, Icon, Avatar } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import ProjectInfo from '../common/ProjectInfo';
import ProjectAnalysis from './ProjectAnalysis';
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
  info,
}) => {
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar shape="square" size="large" src={info.logo_url} />
      </div>
      <div className={styles.content}>
        <ProjectInfo info={info} />
      </div>
    </div>
  );
};

const ProjectHeaderAction = ({
  name,
  roleInfo,
  onExit,
  onTransfer,
}) => {
  const prefix = `/p/${name}/project`;
  const menuItem = getMenuTtem(prefix);
  const menuItems = [{
    key: 'logo',
    name: '上传封面',
    path: '/logo',
  }, {
    key: 'address',
    name: '设置地址',
    path: '/address',
  }, {
    key: 'phone',
    name: '登记电话',
    path: '/phone',
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
      onExit();
    } else if ('transfer' === key) {
      onTransfer();
    }
  };
  const menu = (
    <Menu onClick={onClick}>{menuItems}</Menu>
  );

  return (
    <div>
      <Button type="primary" href={`#${prefix}/info`}>编辑</Button>
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
        <Button><Icon type="ellipsis" /></Button>
      </Dropdown>
    </div>
  );
};


const getProjectByName = (name, list) => {
  const i = list.findIndex((it) => {
    return it.name === name;
  });
  return -1 === i ? null : list[i];
};

class Project extends React.PureComponent {
  constructor(props) {
    super(props);

    const info = getProjectByName(props.selected, props.projects);
    this.state = { info };
    this.onExit = this.onExit.bind(this);
    this.onTransfer = this.onTransfer.bind(this);
  }
  onExit() {
    this.props.dispatch({ type: 'project/exitProject' });
  }
  onTransfer() {
    this.props.dispatch({ type: 'project/transferProject' });
  }
  render() {
    const { info } = this.state;
    if (!info) {
      return null;
    }
    const { roleInfo, selected } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          title={info.title}
          content={<ProjectHeaderContent info={info} />}
          action={<ProjectHeaderAction name={selected} roleInfo={roleInfo} onExit={this.onExit} onTransfer={this.onTransfer} />}
          breadcrumbList={[{ title: null }]}
        />
        <ProjectAnalysis name={selected} />
      </React.Fragment>
    );
  }
}

Project.propTypes = {
  dispatch: PropTypes.func,
};
export default connect(state => ({
  selected: state.client.selected,
  projects: state.client.projects,
  roleInfo: state.project.projects,
}))(Project);
