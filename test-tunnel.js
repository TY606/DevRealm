const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const options = {
  host: 'registry.npmjs.org',
  path: '/localtunnel',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const pkg = JSON.parse(data);
      console.log('localtunnel 最新版本:', pkg['dist-tags'].latest);
      console.log('可以通过 npx localtunnel --port 5173 启动');
    } catch(e) {
      console.log('获取包信息失败:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('请求失败:', e.message);
});

req.end();
