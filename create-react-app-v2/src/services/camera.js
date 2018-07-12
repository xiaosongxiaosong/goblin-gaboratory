
import resource from '../utils/resource';
// import { resource } from '../utils';

const cameras = () => {
  return resource('/projects/:projectName/cameras/:cameraId/:type');
};

export default {
  async getCameras(params) {
    return cameras().get(params);
    // return jwt.init({ login: login_v1 });
  },
  async createCamera({ projectName, ...data }) {
    return cameras().post({ projectName }, data);
    // return jwt.init({ login: login_v1 });
  },
};
