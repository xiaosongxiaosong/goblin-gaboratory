
import config from '../utils/config';
import resource from '../utils/resource';
import { requestWithoutJwt } from '../utils/request';

// const { resource, config } = utils;
// const { requestWithoutJwt } = requestUtils;

const users = () => {
  return resource('/users/:username/:action');
};

const user = () => {
  return resource('/user/:action', { notNecessaryJwt: true });
};

const userRoles = () => {
  return resource('/projects/:project_name/user_roles/:username');
};

const userProjects = () => {
  return resource('/users/:username/projects/:project_name');
};

const cmsSessions = () => {
  return resource('/sms/sessions/:phoneNumber', { notNecessaryJwt: true });
};


// const webLogin = () => {
//   return resource('/wechat/web_login', true);
// };


export default {
  async userLogin(data) {
    return requestWithoutJwt(`${config.api}/user_login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // return userLogin().post({}, data);
  },
  async webLogin(data) {
    return requestWithoutJwt(`${config.api}/wechat/web_login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // return webLogin().post({}, data);
  },
  async getUserInfo(username) {
    // debugger;
    return users().get({ username });
  },
  async getUserProjects(username) {
    // debugger;
    return userProjects().get({ username });
  },
  async getUserRole({ projectName, username }) {
    // debugger;
    return userRoles().get({ project_name: projectName, username });
  },
  async checkConflict({ cellphone, username }) {
    // debugger;
    const data = {};
    if (cellphone) {
      data.cellphone = cellphone;
    } else if (username) {
      data.username = username;
    } else {
      return;
    }
    return user().post({ action: 'check_conflict' }, data);
  },
  async getCode({ username, cellphone }) {
    // debugger;
    return users().post({ username, action: 'cellphone_sms' }, {
      phone_number: cellphone,
    });
  },
  async getRegisterCode({ cellphone }) {
    return cmsSessions().post({}, {
      phone_number: cellphone,
      sms_type: 1,
    });
  },
  async completeRegister({ username, cellphone, code, password }) {
    return users().post({ username, action: 'complete_register' }, {
      cellphone,
      code,
      password,
    });
  },
  async register(data) {
    return user().post({ action: 'register' }, data);
  },
  async createProject({ username, ...data }) {
    return userProjects().post({ username }, {
      ...data,
      op: 'create',
    });
  },
  async getJwt({ username, jwt, expired }) {
    return requestWithoutJwt(`${config.api}/users/${username}/jwt?expired=${expired}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });
    // return users().get({ username, action: 'jwt', jwt, expired, });
  },
  async getUsers(params) {
    return users().get(params);
  },
  // / projects / { project_name } / user_roles / { username }
};
