const api = 'http://api.opensight.cn/api/ivc/v1';

const ResourceFactory = function () {
  const get = (isArray = false) => {
    return {
      query: {
        method: 'GET',
        isArray: true === isArray
      },
      update: {
        method: 'PUT'
      }
    };
  };

  return {
    users() {
      return $resource(api + '/users/:username', {
        username: '@username'
      }, get());
    },
    user_projects() {
      return $resource(api + '/users/:username/projects/:project_name', {
        username: '@username',
        project_name: '@username',
      }, get(true));
    }
  };
};

export default ResourceFactory;
