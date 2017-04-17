let data = {};
module.exports = {
    get: function (key) {
        if (undefined === data[key]) {
            data[key] = wx.getStorageSync(key);
        }
        if ('' === data[key]) {
            data[key] = undefined;
        }
        return data[key];
    },
    set: function (key, info) {
        if (info instanceof Array){
            data[key] = info;
            wx.setStorageSync(key, data[key]);
        } else {
            data[key] = Object.assign({}, this.get(key), data[key], info);
            wx.setStorageSync(key, data[key]);
        }
        return data[key];
    }
};