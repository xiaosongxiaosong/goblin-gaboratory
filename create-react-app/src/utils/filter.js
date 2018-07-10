import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);
export function duration(milliseconds) {
  return moment.duration(Math.ceil(milliseconds / 1000), 'seconds').format('w[周]d[天]h[时]m[分]s[秒]', { trim: 'both' });
}

export function sharePrivate(pri) {
  return pri ? '私密' : '公开';
}

export function streamQuality(quality) {
  return {
    ld: '流畅',
    sd: '标清',
    hd: '高清',
    fhd: '超清',
  }[quality];
}

export function showState(state) {
  return ['未开始', '直播中', '暂停中', '已结束'][state] || '未知';
}

export function showStateType(state) {
  return (1 === state || 2 === state) ? 'success' : 'default';
}

export function showPublic(pub) {
  return ['内部', '公开发布', '密码', '报名审核', '付费观看'][pub] || '未知';
}

export function eventState(state) {
  if (0 > state) {
    return '异常';
  }
  return ['备份中', '正常', '异常', '删除中', '转码中', '转码中', '转码失败', '合成中', '剪辑中', '录像中'][state] || '未知';
}

export function eventStateType(state) {
  if (1 === state) {
    return 'success';
  } else if (0 === state || 3 === state || 4 === state || 5 === state || 7 === state || 8 === state || 9 === state) {
    return 'processing';
  } else {
    return 'error';
  }
}

export function eventStateExceptionDesc(state) {
  if (0 > state) {
    return ['', '', '设备异常', '录像时间太短', '存储配额满/过期'][-1 * state] || '未知异常';
  } else {
    return '';
  }
}

export function eventStateDescription(state) {
  const exception = eventStateExceptionDesc(state);
  if ('' === exception) {
    return eventState(state);
  } else {
    return `${eventState(state)}(${exception})`;
  }
}

export function projectState(state) {
  return ['未认证', '正常', '异常'][state] || '异常';
}

export function projectStateType(state) {
  return ['processing', 'success', 'error'][state] || 'error';
}

export function accountType(type) {
  return ['基础版', '企业版', '试用版'][type] || '基础版';
}

export function parseOnOff(flag) {
  return flag ? '开启' : '关闭';
}

export function parseEnableDisable(enabled) {
  return enabled ? '启用' : '禁用';
}

export function userRole(role) {
  if ('number' !== typeof role) {
    return '';
  }
  return ['管理员', '户主', '保养工', '访客'][role] || '';
}

export function cameraOnlineState(state) {
  return ['离线', '在线', '推流中'][state] || '';
}
