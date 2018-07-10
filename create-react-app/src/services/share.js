
// import { resource } from '../utils';
import resource from '../utils/resource';


const shares = () => {
  return resource('/projects/:project_name/shares/:share_id/:action');
};

export default {
  async getShareInfo({ projectName, shareId }) {
    return shares().get({
      project_name: projectName,
      share_id: shareId,
    });
    // return jwt.init({ login: login_v1 });
  },
  async getProjectInfo({ projectName, shareId }) {
    return shares().get({
      project_name: projectName,
      share_id: shareId,
      action: 'project_info',
    });
  },
  async getLiveShowInfo({ projectName, shareId }) {
    return shares().get({
      project_name: projectName,
      share_id: shareId,
      action: 'live_show_info',
    });
  },
  async getStatistic({ projectName, shareId }) {
    return shares().get({
      project_name: projectName,
      share_id: shareId,
      action: 'live_show_statistic',
    });
  },
  async getShowChatroom({ projectName, shareId }) {
    return shares().get({
      project_name: projectName,
      share_id: shareId,
      action: 'live_show_chatroom',
    });
  },
  async createLiveSession({ projectName, shareId, streamFormat }) {
    return shares().post({
      project_name: projectName,
      share_id: shareId,
      action: 'live_sessions',
    }, { format: streamFormat });
  },
  async createVodSession({ projectName, shareId }) {
    return shares().post({
      project_name: projectName,
      share_id: shareId,
      action: 'vod_sessions',
    }, {});
  },
};
