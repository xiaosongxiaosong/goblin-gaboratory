import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Card, Input } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import ListWrapper from './common/ListWrapper';


const ShowCard = () => {
  return (
    <Card
      hoverable
      cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
      <Card.Meta
        title="Europe Street beat"
        description="www.instagram.com"
      />
    </Card>
  );
};

// const getCards = (list) => {
//   if (!list) {
//     return [];
//   }
//   return list.map((info) => {
//     return <ShowCard info={info} />;
//   });
// };

const ShowAction = ({
  name,
  loading,
  onRefresh,
}) => {
  const prefix = getProjectPathname(name);
  return (
    <div>
      <Button type="default" href={`#${prefix}/shows`}>创建</Button>
      <Button type="default" href={`#${prefix}/shows`}>剪辑</Button>
      <Button type="default" disabled={loading} onClick={onRefresh}>刷新</Button>
    </div>
  );
};

const LoadMore = ({
  list,
  total,
  loading,
  load,
}) => {
  if (loading) {
    return (
      <div>loading</div>
    );
  }
  if (total > list.length) {
    return <Button onClick={load}>加载更多</Button>;
  }
  return null;
};

const renderItem = (info) => {
  return <ShowCard info={info} />;
};

const Shows = ({
  selectedProject,
  list,
  total,
  loading,
  dispatch,
}) => {
  const onSearch = (keyword) => {
    dispatch({ type: 'shows/search', payload: keyword });
  };
  const onRefresh = (keyword) => {
    dispatch({ type: 'shows/refresh', payload: keyword });
  };
  const load = (keyword) => {
    dispatch({ type: 'shows/load', payload: keyword });
  };

  // const cards = getCards(list);
  return (
    <div>
      <PageHeader
        title={<Input.Search onSearch={onSearch} enterButton disabled={loading} />}
        action={<ShowAction name={selectedProject.name} loading={loading} onRefresh={onRefresh} />}
      />
      <ListWrapper
        dataSource={list}
        renderItem={renderItem}
        loadMore={<LoadMore list={list} total={total} loading={loading} load={load} />}
      />
      {/* <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6 }}
          dataSource={list}
          renderItem={item => (
            <List.Item>
              <ShowCard info={item} />;
            </List.Item>
          )}
        /> */}
    </div>
  );
};

function mapStateToProps(state) {
  return { ...state.project, ...state.shows };
}

Shows.propTypes = {
  selectedProject: PropTypes.object,
  list: PropTypes.array,
  dispatch: PropTypes.func,
};

// export default Show;
export default connect(mapStateToProps)(Shows);
