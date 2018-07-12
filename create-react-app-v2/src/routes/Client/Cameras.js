import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Row, Col, Card } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';


const Cameras = () => {
  const action = (
    <div>
      <Button type="default">添加</Button>
      <Button type="default">刷新</Button>
    </div>
  );

  const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 8,
    xl: 8,
    style: { marginBottom: 24 },
  };

  return (
    <div>
      <PageHeader
        title="摄像机列表"
        action={action}
        breadcrumbList={[{ title: null }]}
      />
      <Row gutter={24} style={{ margin: '24px 24px 0' }}>
        <Col {...topColResponsiveProps}>
          <Card>
            test
            </Card>
        </Col>
        <Col {...topColResponsiveProps}>
          <Card>
            test
          </Card>
        </Col>
        <Col {...topColResponsiveProps}>
          <Card>
            test
        </Card>
        </Col>
      </Row>
    </div>
  );
};

function mapStateToProps(state) {
  return { ...state.project, ...state.cameras };
}

Cameras.propTypes = {
  match: PropTypes.object,
};

// export default Show;
export default connect(mapStateToProps)(Cameras);
