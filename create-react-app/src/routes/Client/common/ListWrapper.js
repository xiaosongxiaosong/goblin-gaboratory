import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

// import { gutter } from './index';
import styles from './ListWrapper.less';


const ListWrapper = ({
  dataSource,
  renderItem,
  loadMore,
}) => {
  const colResponsiveProps = { xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 4 };
  return (
    <div className={styles.container}>
      {/* <List
        grid={{ gutter, ...colResponsiveProps }}
        dataSource={dataSource}
        renderItem={renderItem}
        loadMore={loadMore}
      /> */}
      <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
        {dataSource.map((it) => {
          return <Col key={it.uuid} {...colResponsiveProps} className={styles.col}>{renderItem(it)}</Col>;
        })}
        <Col xs={24} className={styles.loadMore}>{loadMore}</Col>;
      </Row>
    </div>
  );
};

ListWrapper.propTypes = {
  dataSource: PropTypes.array,
  renderItem: PropTypes.func,
  loadMore: PropTypes.element,
};

export default ListWrapper;
