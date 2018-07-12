
// import { resource } from '../utils';
import resource from '../utils/resource';


const events = () => {
  return resource('/projects/:projectName/record/events/:eventId/:type');
};

const recordResource = () => {
  return resource('/projects/:projectName/record/:resourceType/:resourceId/:action');
};

export default {
  async getEvents(params) {
    // const data = {
    //   projectName: params.projectName,
    //   start: params.start,
    //   limit: params.limit,
    // };
    // if (('string' === typeof params.keyword) && '' !== params.keyword) {
    //   data.keyword = params.keyword;
    // }
    return events().get(params);
  },
  async getEvent({ projectName, eventId }) {
    return events().get({ projectName, eventId });
  },
  async updateEventInfo({ projectName, eventId, ...data }) {
    return events().put({ projectName, eventId }, data);
  },
  async createVodSession({ projectName, eventId }) {
    return events().post({ projectName, eventId, type: 'vod_sessions' });
  },
  async removeEvent({ projectName, eventId }) {
    return events().remove({ projectName, eventId });
  },
  async createMultiUploadSession({ projectName, fileName, fileType }) {
    return recordResource().post({ projectName, resourceType: 'event_multipart_uploads' }, {
      file_name: fileName,
      mime: fileType,
    });
  },
  async getMultiUploadSessionToken({ projectName, eventId }) {
    return recordResource().post({
      projectName,
      resourceType: 'event_multipart_uploads',
      resourceId: eventId,
      action: 'token',
    });
  },
  async updateMultiUploadSession({ projectName, eventId }) {
    return recordResource().post({
      projectName,
      resourceType: 'event_multipart_uploads',
      resourceId: eventId,
      action: 'done',
    });
  },
  async delMultiUploadSession({ projectName, eventId }) {
    return recordResource().remove({
      projectName,
      resourceType: 'event_multipart_uploads',
      resourceId: eventId,
    });
  },
  async mergeEvents({ projectName, ...data }) {
    return recordResource().post({ projectName, resourceType: 'merge_events' }, data);
  },
  async getTsUrl({ projectName, eventId }) {
    return recordResource().get({
      projectName,
      resourceType: 'events',
      resourceId: eventId,
      action: 'ts_url',
    });
  },
};
