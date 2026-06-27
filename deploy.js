import ghpages from 'gh-pages';

ghpages.publish('dist', {
  branch: 'gh-pages',
  message: 'Deploy to GitHub Pages',
}, (err) => {
  if (err) {
    console.error('部署失败:', err);
    process.exit(1);
  } else {
    console.log('部署成功！');
    process.exit(0);
  }
});