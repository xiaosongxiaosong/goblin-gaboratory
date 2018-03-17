import request from '../utils/request';

export default {
  async getIssues(repo) {
    return request(repo.replace(/https:\/\/github.com\/(\w+)\/(\w+)(\/.*)?/, 'https://api.github.com/repos/$1/$2/issues'));
    // return jwt.init({ login: login_v1 });
  },
  async getUserInfo(repo) {
    return request(repo.replace(/https:\/\/github.com\/(\w+)(\/.*)?/, 'https://api.github.com/users/$1'));
    // return jwt.init({ login: login_v1 });
  },
};
