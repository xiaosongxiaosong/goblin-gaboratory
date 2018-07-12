
// import { resource } from '../utils';
import resource from '../utils/resource';


const shows = () => {
  return resource('/projects/:projectName/live_shows/:showId/:type/:subId');
};

// const showSchedules = () => {
//   return resource('/projects/:projectName/live_show_schedules/:scheduleId');
// };


const liveShowResource = () => {
  return resource('/projects/:projectName/live_show/:resourceType/:resourceId/live_shows');
};

export default {
  async getShows(params) {
    const data = {
      projectName: params.projectName,
      start: params.start,
      limit: params.limit,
    };
    if (('string' === typeof params.keyword) && '' !== params.keyword) {
      data.keyword = params.keyword;
    }
    return shows().get(data);
  },
  async getShow({ projectName, showId }) {
    return shows().get({ projectName, showId });
  },
  async getShowTags({ projectName, showId }) {
    return shows().get({ projectName, showId, type: 'tags' });
  },
  async getShowStatistic({ projectName, showId }) {
    return shows().get({ projectName, showId, type: 'statistic' });
  },
  async getLiveStatistics({ projectName, showId }) {
    return shows().get({ projectName, showId, type: 'lives' });
  },
  async getShowRecords({ projectName, showId }) {
    return shows().get({ projectName, showId, type: 'records' });
  },
  async removeShowRecord({ projectName, showId, eventId }) {
    return shows().remove({ projectName, showId, type: 'records', subId: eventId });
  },
  async addShowRecords({ projectName, showId, events }) {
    return shows().post({ projectName, showId, type: 'records' }, events);
  },
  async getShowSchedules({ projectName, start, limit }) {
    return liveShowResource().get({ projectName, resourceType: 'live_show_schedules', start, limit });
  },
  async getShowsByEvent({ projectName, eventId }) {
    return liveShowResource().get({ projectName, resourceType: 'events', resourceId: eventId });
  },
  async changeShowState({ projectName, showId, op }) {
    return shows().post({ projectName, showId }, { op });
  },
  async updateShowInfo({ projectName, showId, ...data }) {
    return shows().put({ projectName, showId }, data);
  },
};
