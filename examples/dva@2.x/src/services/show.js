
import { resource } from '../utils';

const shows = () => {
  return resource('/projects/:project_name/live_show_square/live_shows/:live_show_id/:type');
};
const showAction = () => {
  // /projects/{project_name}/live_show_square/project_info
  return resource('/projects/:project_name/live_show_square/:action');
};
const sessions = () => {
  // /projects/{project_name}/live_show_square/project_info
  return resource('/projects/:project_name/cameras/:camera_id/sessions/:session_id');
};

export default {
  async getInfo(projectName, showId) {
    return shows().get({
      project_name: projectName,
      live_show_id: showId,
    });
    // return jwt.init({ login: login_v1 });
  },
  async getProjectInfo(projectName) {
    return showAction().get({
      project_name: projectName,
      action: 'project_info',
    });
  },
  async getRecordHls(projectName, showId, password) {
    // /projects/{project_name}/live_show_square/live_shows/{live_show_id}/record_hls
    return shows().get({
      project_name: projectName,
      live_show_id: showId,
      type: 'record_hls',
      password,
    });
  },
  async getStatistic(projectName, showId) {
    // /projects/{project_name}/live_show_square/live_shows/{live_show_id}/statistic
    return shows().get({
      project_name: projectName,
      live_show_id: showId,
      type: 'statistic',
    });
  },
  async createSession(projectName, showId, streamFormat, password) {
    // /projects/{project_name}/live_show_square/live_sessions
    return showAction().post({
      project_name: projectName,
      live_show_id: showId,
      action: 'live_sessions',
    }, {
      stream_format: streamFormat,
      password,
    });
  },
  async sessionAlive(projectName, cameraId, sessionId) {
    // /projects/{project_name}/live_show_square/live_sessions
    return sessions().post({
      project_name: projectName,
      camera_id: cameraId,
      session_id: sessionId,
    });
  },
  async stopSession(projectName, cameraId, sessionId) {
    // /projects/{project_name}/live_show_square/live_sessions
    return sessions().remove({
      project_name: projectName,
      camera_id: cameraId,
      session_id: sessionId,
    });
  },
};
