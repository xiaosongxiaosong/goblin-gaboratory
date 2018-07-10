
// import { resource } from '../utils';
import resource from '../utils/resource';


const sessions = () => {
  // /projects/{project_name}/live_show_square/project_info
  return resource('/projects/:project_name/cameras/:camera_id/sessions/:session_id');
};
export default {
  async sessionAlive({ projectName, cameraId, sessionId }) {
    return sessions().post({
      project_name: projectName,
      camera_id: cameraId,
      session_id: sessionId,
    });
  },
  async destorySession({ projectName, cameraId, sessionId }) {
    return sessions().remove({
      project_name: projectName,
      camera_id: cameraId,
      session_id: sessionId,
    });
  },
};
