
// import { resource } from '../utils';
import resource from '../utils/resource';

const shows = () => {
  return resource('/projects/:project_name/live_show_square/live_shows/:live_show_id/:type', {
    notNecessaryJwt: true,
  });
};
const showAction = () => {
  // /projects/{project_name}/live_show_square/project_info
  return resource('/projects/:project_name/live_show_square/:action', {
    notNecessaryJwt: true,
  });
};

const cameras = () => {
  // /projects/{project_name}/camera_square/cameras
  return resource('/projects/:project_name/camera_square/cameras/:camera_id', {
    notNecessaryJwt: true,
  });
};

const cameraAction = () => {
  // /projects/{project_name}/camera_square/live_sessions
  return resource('/projects/:project_name/camera_square/:action', {
    notNecessaryJwt: true,
  });
};

export default {
  async getShowInfo(projectName, showId) {
    return shows().get({
      project_name: projectName,
      live_show_id: showId,
    });
    // return jwt.init({ login: login_v1 });
  },
  async getShowProjectInfo(projectName) {
    return showAction().get({
      project_name: projectName,
      action: 'project_info',
    });
  },
  async getShowStatistic(projectName, showId) {
    // /projects/{project_name}/live_show_square/live_shows/{live_show_id}/statistic
    return shows().get({
      project_name: projectName,
      live_show_id: showId,
      type: 'statistic',
    });
  },
  async getShowChatroom(projectName, showId, password) {
    // /projects/{project_name}/live_show_square/live_sessions
    const params = {
      project_name: projectName,
      live_show_id: showId,
      type: 'chatroom',
    };
    if (password) {
      params.password = password;
    }
    return shows().get(params);
  },
  async createShowLiveSession(projectName, showId, streamFormat, password) {
    // /projects/{project_name}/live_show_square/live_sessions
    const data = {
      stream_format: streamFormat,
    };
    if (password) {
      data.password = password;
    }
    return showAction().post({
      project_name: projectName,
      live_show_id: showId,
      action: 'live_sessions',
    }, data);
  },
  async createShowVodSession(projectName, showId, password) {
    // /projects/{project_name}/live_show_square/live_sessions
    const data = {};
    if (password) {
      data.password = password;
    }
    return showAction().post({
      project_name: projectName,
      live_show_id: showId,
      action: 'vod_sessions',
    }, data);
  },
  async getCameraInfo(projectName, cameraId) {
    return cameras().get({
      project_name: projectName,
      camera_id: cameraId,
    });
    // return jwt.init({ login: login_v1 });
  },
  async getCameraProjectInfo(projectName) {
    return cameraAction().get({
      project_name: projectName,
      action: 'project_info',
    });
  },
  async createCameraLiveSession(projectName, cameraId, streamFormat, quality) {
    // /projects/{project_name}/live_show_square/live_sessions
    return cameraAction().post({
      project_name: projectName,
      action: 'live_sessions',
    }, {
      camera_id: cameraId,
      format: streamFormat,
      quality,
    });
  },
};
