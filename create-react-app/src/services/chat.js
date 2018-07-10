
import config from '../utils/config';
import resource from '../utils/resource';


const msgs = () => {
  return resource('/projects/:project_name/msgs/:uuid', {
    api: config.chatApi,
    notNecessaryJwt: true,
  });
};

const chatrooms = () => {
  return resource('/projects/:project_name/chatrooms/:uuid/:type', {
    api: config.chatApi,
    notNecessaryJwt: true,
  });
};

export default {
  async getMsgs({ projectName, chatroomUuid, lastUuid, lastTime, limit }) {
    const params = {
      project_name: projectName,
      chatroom_uuid: chatroomUuid,
    };
    if (lastUuid && lastTime) {
      params.last_uuid = lastUuid;
      params.last_time = lastTime;
    }
    if (limit) {
      params.limit = limit;
    }
    return msgs().get(params);
    // return jwt.init({ login: login_v1 });
  },
  async delMsg({ projectName, uuid }) {
    return msgs().remove({
      project_name: projectName,
      uuid,
    }, {});
    // return jwt.init({ login: login_v1 });
  },
  async getTencentLoginInfo({ projectName, uuid }) {
    return chatrooms().post({
      project_name: projectName,
      uuid,
      type: 'tencent_login',
    });
    // return jwt.init({ login: login_v1 });
  },
};
