var express = require('express');
var AV = require('leanengine');
const path = require('path')


AV.init({
  appId: process.env.LEANCLOUD_APP_ID || 'Sfddslbr3k4qkkpXmrq0SryG-gzGzoHsz',
  appKey: process.env.LEANCLOUD_APP_KEY || '6WR33O5SqxveQ6dkAXAc81SH',
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY || 'V4jM1th7hm3AlVep01IfSBdY'
});

var app = express();
app.use(AV.express());
app.use(express.static(path.resolve(__dirname, './dva/dist')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dva/dist/index.html'))
})
app.listen(process.env.LEANCLOUD_APP_PORT);
