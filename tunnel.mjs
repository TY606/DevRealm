import localtunnel from 'localtunnel';

(async () => {
  const tunnel = await localtunnel({ port: 5173 });
  console.log('公网地址:', tunnel.url);
  
  tunnel.on('close', () => {
    console.log('隧道已关闭');
  });
  
  tunnel.on('error', (err) => {
    console.error('隧道错误:', err);
  });
})();
