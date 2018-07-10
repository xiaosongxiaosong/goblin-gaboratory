
import resource from '../utils/resource';

const projects = () => {
  return resource('/projects/:projectName/:resourcetype/:resourceId/:subType/:subId');
};
// const storageQuota = () => {
//   return resource('/projects/:projectName/storage_quota');
// };

export default {
  async addVirtualCamera({ projectName, ...data }) {
    return projects().post({ projectName, resourcetype: 'add_virtual_camera' }, data);
  },
  async getStorageQuota({ projectName }) {
    return projects().get({ projectName, resourcetype: 'storage_quota' });
  },
  async getProjects(params) {
    return projects().get(params);
  },
  async getProjectInfo({ projectName }) {
    return projects().get({ projectName });
  },
  async updateProjectInfo({ projectName, ...data }) {
    return projects().put({ projectName }, data);
  },
  async getAccount({ projectName }) {
    return projects().get({ projectName, resourcetype: 'account' });
  },
  async getQuota({ projectName }) {
    return projects().get({ projectName, resourcetype: 'quota' });
  },
  async getOnlineSchoolConfig({ projectName }) {
    return projects().get({ projectName, resourcetype: 'online_school', resourceId: 'config' });
  },
  async getWechatMerchant({ projectName }) {
    return projects().get({ projectName, resourcetype: 'wechat_merchant' });
  },
  async getProjectUsers(params) {
    return projects().get({ ...params, resourcetype: 'users' });
  },
  async getProjectUserInfo({ projectName, username }) {
    return projects().get({ projectName, resourcetype: 'users', resourceId: username });
  },
  async addProjectUser({ projectName, username, role }) {
    return projects().post({ projectName, resourcetype: 'users' }, { username, role });
  },
  async removeProjectUser({ projectName, username }) {
    return projects().remove({ projectName, resourcetype: 'users', resourceId: username });
  },
  async getProjectUserRoles(params) {
    return projects().get({ ...params, resourcetype: 'user_roles' });
  },
  async getProjectUserRole({ projectName, username }) {
    return projects().get({ projectName, resourcetype: 'user_roles', resourceId: username });
  },
  async updateProjectUserRole({ projectName, username, role }) {
    return projects().put({ projectName, resourcetype: 'user_roles', resourceId: username }, { role });
  },
  async getProjectDevices(params) {
    return projects().get({ ...params, resourcetype: 'devices' });
  },
};
