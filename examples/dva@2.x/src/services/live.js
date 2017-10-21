
import { resource } from '../utils';

const cameras = () => {
  // /projects/{project_name}/camera_square/cameras
  return resource('/projects/:project_name/camera_square/cameras/:camera_id');
};
const cameraAction = () => {
  // /projects/{project_name}/camera_square/live_sessions
  return resource('/projects/:project_name/camera_square/:action');
};
const sessions = () => {
  // /projects/{project_name}/live_show_square/project_info
  return resource('/projects/:project_name/cameras/:camera_id/sessions/:session_id');
};
export default {
  async getInfo(projectName, cameraId) {
    return cameras().get({
      project_name: projectName,
      camera_id: cameraId,
    });
    // return jwt.init({ login: login_v1 });
  },
  async getProjectInfo(projectName) {
    return cameraAction().get({
      project_name: projectName,
      action: 'project_info',
    });
  },
  async createSession(projectName, cameraId, streamFormat, quality) {
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
