
// import { resource } from '../utils';
import resource from '../utils/resource';


const ivrStatistic = () => {
  // /projects/{project_name}/camera_square/cameras
  return resource('/ivr_statistic/:type/:subType/:resourceType');
};

export default {
  async getWorkingStatistic(params) {
    return ivrStatistic().get({
      type: 'realtime',
      subType: 'working',
      ...params,
    });
  },
  async getProjectsByUserSession(params) {
    return ivrStatistic().get({
      type: 'realtime',
      subType: 'user_session_counts',
      ...params,
    });
  },
  async getProjectsByEventSize(params) {
    return ivrStatistic().get({
      type: 'event',
      subType: 'size',
      resourceType: 'projects',
      ...params,
    });
  },
  async getProjectsByVodDurtion(params) {
    return ivrStatistic().get({
      type: 'vod_session',
      subType: 'duration',
      resourceType: 'projects',
      ...params,
    });
  },
  async getProjectsByLiveDurtion(params) {
    return ivrStatistic().get({
      type: 'live_session',
      subType: 'duration',
      resourceType: 'projects',
      ...params,
    });
  },
};
