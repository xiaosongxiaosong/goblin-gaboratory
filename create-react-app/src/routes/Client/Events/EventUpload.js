import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'dva';
import { Prompt } from 'dva/router';

import { Card, Upload, Icon, notification, List, Progress } from 'antd';

import PageHeader from 'ant-design-pro/lib/PageHeader';
import PageBody from '../../../components/PageBody';
import eventServer from '../../../services/event';

import { getScript, notifyRequestError } from '../../../utils';

import styles from './EventUpload.less';


class EventUpload extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      taskList: [],
      uploading: false,
      oss: global.OSS,
    };

    this.beforeUpload = this.beforeUpload.bind(this);

    if (global.OSS) {
      this.state.oss = true;
    } else {
      this.loadSrcipt();
    }

    // TODO: 路由监听，如果有长传任务没有完成，提示用户，让用户选择是否取消上传
  }
  componentWillUnmount() {
    const index = this.findIndexByState('uploading');
    const task = -1 === index ? null : this.state.taskList[index];
    this.setState({ uploading: false, taskList: [] });
    if (task) {
      this.cancelTask(task);
    }
  }
  async getUploadSessionInfo(task) {
    if (task.event_id) {
      const { data, errMsg } = await eventServer.getMultiUploadSessionToken({
        projectName: this.props.match.params.name,
        resourceId: task.event_id,
      });
      if (errMsg) {
        notifyRequestError(errMsg, `上传 ${task.file.name} 失败`);
        await this.updateTask(task, { state: 'failed' });
        return null;
      } else if (data.size_limit && data.size_limit < task.file.size) {
        notification.error({ message: '文件大小超出限制' });
        await this.updateTask(task, { state: 'overLimit' });
        return null;
      } else {
        const taskInfo = await this.updateTask(task, data);
        return taskInfo;
      }
    } else {
      const { data, errMsg } = await eventServer.createMultiUploadSession({
        projectName: this.props.match.params.name,
        fileName: task.file.name,
        fileType: task.file.type,
      });
      if (errMsg) {
        notifyRequestError(errMsg, `上传 ${task.file.name} 失败`);
        await this.updateTask(task, { state: 'abnormal' });
        return null;
      } else {
        const taskInfo = await this.updateTask(task, data);
        return taskInfo;
      }
    }
  }
  async loadSrcipt() {
    try {
      await getScript('//gosspublic.alicdn.com/aliyun-oss-sdk-4.11.4.min.js');
      this.setState({ oss: true });
    } catch (errMsg) {
      this.setState({ oss: false });
    }
  }
  beforeUpload(file, fileList) {
    if (fileList[0].uid !== file.uid) {
      return false;
    }
    const list = fileList.filter((item) => {
      if (!item.type.match(/^video\/(.+)$/)) {
        notification.error({ message: `${item.name} 不是视频文件` });
        return false;
      }
      return true;
    });
    // debugger;
    // if (!file.type.match(/^video\/(.+)$/)) {
    //   notification.error({ message: `${file.name} 不是视频文件` });
    //   return false;
    // }
    this.addTask(list);
    return false;
  }
  findIndexByUid(uid) {
    return this.state.taskList.findIndex(it => it.file.uid === uid);
  }
  // state: 'waiting', 'uploading', 'abnormal', 'canceled', 'succeeded', 'failed', 'overLimit', 'finished'
  findIndexByState(state) {
    return this.state.taskList.findIndex(it => it.state === state);
  }
  async addTask(fileList) {
    const taskList = fileList.map((file) => {
      return { file, state: 'waiting', retry: 0 };
    });
    await this.setState({
      taskList: [...this.state.taskList, ...taskList],
    });
    this.uploadNext();
  }
  async updateTask(task, info) {
    const index = this.findIndexByUid(task.file.uid);
    if (-1 === index) {
      return null;
    }
    const taskList = [...this.state.taskList];
    taskList[index] = { ...taskList[index], ...info };
    await this.setState({ taskList });
    return this.state.taskList[index];
  }
  async delTask(task) {
    const index = this.findIndexByUid(task.file.uid);
    if (-1 === index) {
      return null;
    }
    const taskList = [...this.state.taskList];
    const taskInfo = taskList.splice(index, 1);
    await this.setState({ taskList });
    return taskInfo;
  }
  cancelTask(task) {
    if (task.cpt && task.client) {
      task.client.abortMultipartUpload(task.cpt.name, task.cpt.uploadId);
    }
    if (task.event_id) {
      eventServer.delMultiUploadSession({
        projectName: this.props.match.params.name,
        eventId: task.event_id,
      });
    }
  }
  updateTaskByIndex(index, info) {
    const taskList = [...this.state.taskList];
    taskList[index] = { ...taskList[index], ...info };
    // taskList[index].state = state;
    return this.setState({ taskList });
  }
  async uploadNext() {
    const index = this.findIndexByState('uploading');
    if (-1 !== index) {
      this.setState({ uploading: true });
      return false;
    }
    const taskIndex = this.findIndexByState('waiting');
    if (-1 === taskIndex) {
      this.setState({ uploading: false });
      return false;
    }
    this.setState({ uploading: true });
    const taskInfo = await this.updateTask(this.state.taskList[taskIndex], { state: 'uploading', precent: 0, retry: 0 });
    await this.startUpload(taskInfo);
    this.uploadNext();
  }
  async startUpload(task) {
    let taskInfo = await this.getUploadSessionInfo(task);
    if (!taskInfo) {
      return;
    }
    taskInfo = await this.multipartUpload(taskInfo);
    if (!taskInfo || 'failed' === taskInfo.state) {
      return taskInfo;
    }
    if ('finished' !== taskInfo.state) {
      taskInfo = await this.startUpload(taskInfo);
      return taskInfo;
    }
    taskInfo = await this.multipartUploadFinished(taskInfo);
    return taskInfo;
  }
  async multipartUpload(task) {
    // const info = { ...task, ...session };
    const client = new global.OSS.Wrapper({
      accessKeyId: task.access_key_id,
      accessKeySecret: task.access_key_secret,
      stsToken: task.sts_token,
      bucket: task.bucket_name,
      endpoint: task.endpoint,
    });
    let taskInfo = await this.updateTask(task, { lastTime: new Date().getTime(), speed: 0, client });
    if (!taskInfo) {
      return taskInfo;
    }
    const result = await this.startMultipartUpload(taskInfo);
    let state = 'finished';
    const retry = taskInfo.retry + 1;
    if (!result) {
      state = 3 < retry ? 'failed' : taskInfo.state;
    }
    taskInfo = await this.updateTask(taskInfo, { speed: 0, client: undefined, state, retry });
    return taskInfo;
  }
  async startMultipartUpload(task) {
    return task.client.multipartUpload(task.object_key, task.file, {
      parallel: 2,
      checkpoint: task.cpt,
      progress: (precent, cpt) => {
        return async (done) => {
          await this.multipartUploadProgress(task, precent, cpt);
          done();
        };
      },
    }).then(() => true, () => false);
  }
  async multipartUploadProgress(task, precent, cpt) {
    const index = this.findIndexByUid(task.file.uid);
    if (-1 === index) {
      return -1;
    }
    const taskInfo = this.state.taskList[index];
    const now = new Date().getTime();
    const dur = now - taskInfo.lastTime;
    const current = Math.round(precent * 100);
    const uploaded = current - taskInfo.precent;
    if (0 < uploaded || 0 < dur) {
      this.updateTask(taskInfo, { precent: current, cpt, retry: 0, lastTime: now, speed: (uploaded * task.file.size * 1000) / dur });
    } else {
      this.updateTask(taskInfo, { cpt, retry: 0 });
    }
  }
  async multipartUploadFinished(task) {
    const { errMsg } = await eventServer.updateMultiUploadSession({
      projectName: this.props.match.params.name,
      eventId: task.event_id,
    });
    const state = errMsg ? 'failed' : 'succeeded';
    const taskInfo = await this.updateTask(task, { state });
    return taskInfo;
  }
  async delItem(task) {
    // TODO: 检查任务状态，只有成功的才能删除
    this.delTask(task);
  }
  async cancelItem(task) {
    // TODO: 如果真正上传，先停止任务，再删除任务，同时要启动下一个上传任务
    const taskInfo = await this.updateTask(task, {
      state: 'canceled',
      event_id: undefined,
      cpt: undefined,
    });
    this.cancelTask(task);
    this.uploadNext();
    return taskInfo;
  }
  async resetItem(task) {
    // TODO: 检查任务状态，失败和异常才需要处理，注意重置重试次数
    if (task.event_id) {
      eventServer.delMultiUploadSession({
        projectName: this.props.match.params.name,
        eventId: task.event_id,
      });
    }
    const taskInfo = await this.updateTask(task, {
      state: 'waiting',
      event_id: undefined,
      cpt: undefined,
      speed: 0,
      retry: 0,
      precent: 0,
    });
    this.uploadNext();
    return taskInfo;
  }
  async restart(task) {
    const taskInfo = await this.updateTask(task, { state: 'waiting', speed: 0, retry: 0 });
    this.uploadNext();
    return taskInfo;
  }
  render() {
    return (
      <React.Fragment>
        <Prompt when={this.state.uploading} message="正在上传录像文件，退出页面会导致上传任务被取消，是否继续？" />
        <PageHeader
          title="上传录像"
          breadcrumbList={[{ title: null }]}
        />
        <PageBody>
          <Card bordered={false}>
            <List
              size="large"
              rowKey="file.uid"
              loading={false}
              pagination={false}
              header={
                <Upload.Dragger action="" multiple beforeUpload={this.beforeUpload} showUploadList={false}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或拖动文件到这个区域上传</p>
                  <p className="ant-upload-hint">支持单个或批量上传。 严格禁止上传非音视频文件</p>
                </Upload.Dragger>
              }
              dataSource={this.state.taskList}
              renderItem={item => (
                <List.Item>
                  <div className={styles.listItem}>
                    <div>
                      <span>{item.file.name}</span>
                      {('waiting' !== item.state && 'uploading' !== item.state) &&
                        <div className={styles.pullRight}>
                          <span className={styles.action} title="从列表中移除" onClick={() => { this.delItem(item); }}><Icon type="close" /></span>
                        </div>
                      }
                    </div>
                    {('uploading' === item.state || 'failed' === item.state) && <Progress percent={item.precent} />}
                    <div>
                      {'waiting' === item.state && <span>等待上传</span>}
                      {'overLimit' === item.state && <span>文件大小超出限制</span>}
                      {'uploading' === item.state && <span>正在上传</span>}
                      {'canceled' === item.state && <span>已取消</span>}
                      {('failed' === item.state || 'abnormal' === item.state) && <span>上传失败</span>}
                      {'succeeded' === item.state && <span>上传成功</span>}
                      <div className={styles.pullRight}>
                        {('waiting' === item.state || 'uploading' === item.state) &&
                          <a className={styles.action} onClick={() => { this.cancelItem(item); }}>取消</a>
                        }
                        {('failed' === item.state || 'abnormal' === item.state || 'canceled' === item.state) &&
                          <a className={styles.action} onClick={() => { this.resetItem(item); }}>重试</a>
                        }
                        {'failed' === item.state && <a className={styles.action} onClick={() => { this.restart(item); }}>继续</a>}
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: '没有上传任务' }}
            />
          </Card>
        </PageBody>
      </React.Fragment>
    );
  }
}


EventUpload.propTypes = {
  // projectName: PropTypes.string,
  // match: PropTypes.match,
  // dispatch: PropTypes.func,
};

// export default Show;
export default EventUpload;
