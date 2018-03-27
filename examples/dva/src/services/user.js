import storage from '../utils/storage';

export default {
  async getLocalRepos() {
    const { data, errMsg } = await storage.get('repos');
    if (errMsg || !(data instanceof Array)) {
      return [
        'https://github.com/sorrycc/blog',
        'https://github.com/dwqs/blog',
      ];
    } else {
      return data;
    }
  },
  async addLocalRepo(repo) {
    const { data, errMsg } = await storage.get('repos');
    if (errMsg || !(data instanceof Array)) {
      return storage.set('repos', [repo]);
    }
    const index = data.findIndex(it => it === repo);
    if (-1 === index) {
      data.push(repo);
      return storage.set('repos', data);
    } else {
      return storage.set('repos', data);
    }
  },
  async removeLocalRepo(repo) {
    const { data, errMsg } = await storage.get('repos');
    if (errMsg || !(data instanceof Array)) {
      return storage.set('repos', []);
    }
    const index = data.findIndex(it => it === repo);
    if (-1 === index) {
      return storage.set('repos', data);
    } else {
      data.splice(index, 1);
      return storage.set('repos', data);
    }
  },
  async getLocalReadRecords() {
    const { data, errMsg } = await storage.get('records');
    if (errMsg || !(data instanceof Array)) {
      return [];
    } else {
      return data;
    }
  },
  async markAsLocalRead(issue) {
    const { data, errMsg } = await storage.get('records');
    if (errMsg || !(data instanceof Array)) {
      return storage.set('records', [issue]);
    }
    const index = data.findIndex(it => it === issue);
    if (-1 === index) {
      data.push(issue);
      return storage.set('records', data);
    } else {
      return storage.set('records', data);
    }
  },
  async getLocalFavorites() {
    // return storage.get('favorites');
    const { data, errMsg } = await storage.get('favorites');
    if (errMsg || !(data instanceof Array)) {
      return [];
    } else {
      return data;
    }
  },
  async markAsLocalFavorite(issue) {
    const { data, errMsg } = await storage.get('favorites');
    if (errMsg || !(data instanceof Array)) {
      return storage.set('favorites', [issue]);
    }
    const index = data.findIndex(it => it === issue);
    if (-1 === index) {
      data.push(issue);
      return storage.set('favorites', data);
    } else {
      return storage.set('favorites', data);
    }
  },
  async unmarkAsLocalFavorite(issue) {
    const { data, errMsg } = await storage.get('favorites');
    if (errMsg || !(data instanceof Array)) {
      return storage.set('favorites', []);
    }
    const index = data.findIndex(it => it === issue);
    if (-1 === index) {
      return storage.set('favorites', data);
    } else {
      data.splice(index, 1);
      return storage.set('favorites', data);
    }
  },
};
