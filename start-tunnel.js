const fs = require('fs');
const localtunnel = require('localtunnel');

const logFile = 'tunnel-log.txt';

function log(msg) {
  const line = `[${new Date().toLocaleString()}] ${msg}\n`;
  console.log(msg);
  fs.appendFileSync(logFile, line);
}

(async () => {
  try {
    log('正在创建公网隧道，请稍候...');
    
    const tunnel = await localtunnel({ 
      port: 5173,
      host: 'https://localtunnel.me'
    });
    
    log('========================================');
    log('  公网访问地址: ' + tunnel.url);
    log('========================================');
    log('');
    log('提示：首次访问可能需要点击 "Click to Continue" 按钮');
    log('保持此窗口打开，隧道将持续运行');
    log('按 Ctrl+C 停止隧道');
    log('');
    
    tunnel.on('request', (info) => {
      log('请求: ' + info.method + ' ' + info.path);
    });
    
    tunnel.on('error', (err) => {
      log('隧道错误: ' + err.message);
    });
    
    tunnel.on('close', () => {
      log('隧道已关闭');
    });
    
    process.on('SIGINT', () => {
      log('正在关闭隧道...');
      try {
        tunnel.close();
      } catch(e) {}
      process.exit(0);
    });
    
    setInterval(() => {
      log('隧道运行中... 当前地址: ' + tunnel.url);
    }, 60000);
    
  } catch (error) {
    log('创建隧道失败: ' + error.message);
    if (error.stack) log(error.stack);
    process.exit(1);
  }
})();
