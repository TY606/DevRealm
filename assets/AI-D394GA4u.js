import{t as e}from"./check-ChTHTbvT.js";import{A as t,I as n,L as r,Q as i,U as a,W as o,Y as s,_ as c,a as l,b as u,h as d,j as f,l as p,m,o as h,s as g}from"./index-Bnu2ZX8n.js";var _=r(`Copy`,[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]),v=r(`FileCode`,[[`path`,{d:`M10 12.5 8 15l2 2.5`,key:`1tg20x`}],[`path`,{d:`m14 12.5 2 2.5-2 2.5`,key:`yinavb`}],[`path`,{d:`M14 2v4a2 2 0 0 0 2 2h4`,key:`tnqrlb`}],[`path`,{d:`M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z`,key:`1mlx9k`}]]),y=r(`Lightbulb`,[[`path`,{d:`M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5`,key:`1gvzjb`}],[`path`,{d:`M9 18h6`,key:`x1upvd`}],[`path`,{d:`M10 22h4`,key:`ceow96`}]]),b=r(`Terminal`,[[`polyline`,{points:`4 17 10 11 4 5`,key:`akl6gq`}],[`line`,{x1:`12`,x2:`20`,y1:`19`,y2:`19`,key:`q2wloq`}]]),x=i(s(),1),S=h();function C(){let{isAuthenticated:r,user:i}=a(),[s,h]=(0,x.useState)(`chat`),[C,w]=(0,x.useState)([{id:`1`,role:`assistant`,content:`你好！我是 DevRealm AI 助手，很高兴为你提供游戏开发方面的帮助。

我可以帮你：
- 设计游戏架构和技术方案
- 编写代码和调试问题
- 提供性能优化建议
- 解答引擎相关问题

请问有什么我可以帮你的吗？`,timestamp:new Date}]),[T,E]=(0,x.useState)(``),[D,O]=(0,x.useState)(!1),[k,A]=(0,x.useState)(`// 在此输入代码，AI 将帮助你分析和优化

function gameLoop() {
  // 游戏主循环逻辑
}`),[j,M]=(0,x.useState)(``),[N,P]=(0,x.useState)(!1),[F,I]=(0,x.useState)(!1),[L,R]=(0,x.useState)(``),z=()=>{if(!T.trim())return;let e={id:Date.now().toString(),role:`user`,content:T,timestamp:new Date};w(t=>[...t,e]),E(``),O(!0),setTimeout(()=>{let e={id:(Date.now()+1).toString(),role:`assistant`,content:`感谢你的提问！根据你的需求，我建议：

1. 首先进行需求分析和原型设计
2. 选择合适的游戏引擎（Unity/Unreal/Godot）
3. 设计合理的架构模式
4. 逐步实现核心功能

如果你有具体的问题或代码片段，我可以提供更详细的解答和建议。`,timestamp:new Date};w(t=>[...t,e]),O(!1)},1500)},B={分析代码:`代码分析结果：

1. 代码质量评估：良好
   - 代码结构清晰，命名规范
   - 建议添加更多注释说明

2. 性能优化建议：
   - 使用对象池减少内存分配
   - 考虑使用 Job System 并行处理
   - 添加帧率限制避免性能浪费

3. 安全检查：
   - 未发现明显安全隐患
   - 建议添加输入验证

4. 重构建议：
   - 考虑将游戏循环拆分为多个子系统
   - 使用状态模式管理游戏状态`,生成代码:`已根据你的描述生成示例代码：

// 带固定时间步长的游戏主循环
class GameLoop {
  constructor(update, render, step = 1000 / 60) {
    this.update = update;
    this.render = render;
    this.step = step;
    this.last = 0;
    this.acc = 0;
  }

  frame(now) {
    this.acc += now - this.last;
    this.last = now;
    while (this.acc >= this.step) {
      this.update(this.step / 1000);
      this.acc -= this.step;
    }
    this.render();
    requestAnimationFrame((t) => this.frame(t));
  }

  start() {
    requestAnimationFrame((t) => { this.last = t; this.frame(t); });
  }
}

提示：可在左侧替换为你的需求描述后再次生成。`,优化建议:`性能优化建议：

1. 渲染层面
   - 合并静态批次，减少 Draw Call
   - 使用图集（Atlas）降低纹理切换
   - 视锥外对象启用裁剪与休眠

2. 内存层面
   - 频繁创建的子弹/特效使用对象池
   - 大资源采用异步加载与引用计数释放
   - 避免在主循环中分配闭包与临时数组

3. 逻辑层面
   - 空间分区（四叉树/网格）加速碰撞检测
   - 耗时任务分帧或移入 Worker 线程
   - 用脏标记替代每帧全量刷新 UI`,安全检查:`安全检查报告：

1. 输入校验
   - 所有网络字段需做类型/长度校验
   - 客户端结果不可信，关键判定放服务端

2. 数据存储
   - 存档加入签名校验，防止本地篡改
   - 敏感字段不要写入 localStorage 明文

3. 常见风险
   - 防范反序列化注入与原型污染
   - Web 请求统一使用 HTTPS / WSS
   - 第三方 SDK 最小化权限申请`,文档生成:`生成的 API 文档：

## GameLoop

### constructor(update, render, step?)
- update(dt: number)：固定步长逻辑更新
- render()：每帧渲染回调
- step：步长（毫秒），默认 1000/60

### start()
启动循环，内部使用 requestAnimationFrame。

### 设计说明
- 固定步长保证不同帧率下逻辑一致
- 累加器模型避免“慢机穿透”问题
- 渲染与逻辑解耦，便于单元测试`},V=(e=`分析代码`)=>{k.trim()&&(P(!0),setTimeout(()=>{M(B[e]),P(!1)},1200))},H=e=>{navigator.clipboard?.writeText(e).catch(()=>void 0),I(!0),setTimeout(()=>I(!1),2e3)},U=e=>{R(`已向 ${e} 发起预约咨询，专家将在 24 小时内回复`),setTimeout(()=>R(``),3e3)},W=()=>{R(`专家申请已提交，平台将在 3 个工作日内审核资料`),setTimeout(()=>R(``),3e3)},G=(0,S.jsxs)(`div`,{className:`h-full flex flex-col`,children:[(0,S.jsxs)(`div`,{className:`flex-1 overflow-y-auto space-y-4 p-6`,children:[C.map(e=>(0,S.jsxs)(`div`,{className:`flex gap-4 animate-fade-in ${e.role===`user`?`flex-row-reverse`:``}`,children:[(0,S.jsx)(`div`,{className:`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${e.role===`user`?`bg-gradient-to-br from-primary to-secondary`:`bg-dark-600`}`,children:e.role===`user`?(0,S.jsx)(`span`,{className:`text-white font-bold text-sm`,children:`你`}):(0,S.jsx)(g,{className:`w-5 h-5 text-primary`})}),(0,S.jsxs)(`div`,{className:`max-w-[70%] ${e.role===`user`?`text-right`:``}`,children:[(0,S.jsx)(`div`,{className:`inline-block px-5 py-3 rounded-2xl ${e.role===`user`?`bg-gradient-to-r from-primary to-secondary text-white rounded-br-md`:`bg-dark-700/80 text-gray-300 rounded-bl-md`}`,children:e.content.split(`
`).map((e,t)=>(0,S.jsx)(`p`,{className:`mb-1 last:mb-0 whitespace-pre-wrap`,children:e},t))}),(0,S.jsx)(`span`,{className:`text-xs text-gray-500 mt-1 block`,children:e.timestamp.toLocaleTimeString(`zh-CN`)})]})]},e.id)),D&&(0,S.jsxs)(`div`,{className:`flex gap-4 animate-fade-in`,children:[(0,S.jsx)(`div`,{className:`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-dark-600`,children:(0,S.jsx)(g,{className:`w-5 h-5 text-primary animate-pulse`})}),(0,S.jsx)(`div`,{className:`bg-dark-700/80 px-5 py-3 rounded-2xl rounded-bl-md`,children:(0,S.jsxs)(`div`,{className:`flex gap-1`,children:[(0,S.jsx)(`div`,{className:`w-2 h-2 rounded-full bg-gray-400 animate-bounce`}),(0,S.jsx)(`div`,{className:`w-2 h-2 rounded-full bg-gray-400 animate-bounce`,style:{animationDelay:`0.2s`}}),(0,S.jsx)(`div`,{className:`w-2 h-2 rounded-full bg-gray-400 animate-bounce`,style:{animationDelay:`0.4s`}})]})})]})]}),(0,S.jsxs)(`div`,{className:`p-4 border-t border-white/5 bg-dark-800/50`,children:[(0,S.jsx)(`div`,{className:`flex flex-wrap gap-2 mb-4`,children:[`如何设计一款2D平台游戏？`,`Unity性能优化最佳实践`,`如何实现多人联机功能？`,`独立游戏发行策略`].map(e=>(0,S.jsxs)(`button`,{onClick:()=>E(e),className:`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-dark-700/50 text-gray-400 hover:bg-primary/10 hover:text-primary transition-all border border-white/5`,children:[(0,S.jsx)(y,{className:`w-3 h-3`}),e]},e))}),(0,S.jsxs)(`div`,{className:`flex gap-3`,children:[(0,S.jsx)(`input`,{type:`text`,value:T,onChange:e=>E(e.target.value),onKeyDown:e=>e.key===`Enter`&&z(),placeholder:`输入你的问题...`,className:`flex-1 px-5 py-3 bg-dark-700/50 border border-white/5 rounded-xl outline-none focus:border-primary text-white placeholder-gray-500`}),(0,S.jsx)(`button`,{onClick:z,disabled:!T.trim()||D,className:`px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`,children:(0,S.jsx)(c,{className:`w-5 h-5`})})]})]})]}),K=(0,S.jsxs)(`div`,{className:`h-full flex flex-col`,children:[(0,S.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 flex-1 gap-4 p-4`,children:[(0,S.jsxs)(`div`,{className:`flex flex-col`,children:[(0,S.jsxs)(`div`,{className:`flex items-center justify-between px-4 py-3 bg-dark-700/80 rounded-t-xl border-b border-white/5`,children:[(0,S.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,S.jsx)(v,{className:`w-4 h-4 text-primary`}),(0,S.jsx)(`span`,{className:`text-sm font-medium text-white`,children:`代码输入`})]}),(0,S.jsxs)(`button`,{onClick:()=>V(),disabled:N,className:`flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/15 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50`,children:[(0,S.jsx)(g,{className:`w-4 h-4`}),N?`分析中...`:`分析代码`]})]}),(0,S.jsx)(`textarea`,{value:k,onChange:e=>A(e.target.value),className:`flex-1 p-4 bg-dark-800 font-mono text-sm text-gray-300 resize-none outline-none rounded-b-xl`,placeholder:`在此输入代码...`})]}),(0,S.jsxs)(`div`,{className:`flex flex-col`,children:[(0,S.jsxs)(`div`,{className:`flex items-center justify-between px-4 py-3 bg-dark-700/80 rounded-t-xl border-b border-white/5`,children:[(0,S.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,S.jsx)(b,{className:`w-4 h-4 text-secondary`}),(0,S.jsx)(`span`,{className:`text-sm font-medium text-white`,children:`分析结果`})]}),j&&(0,S.jsx)(`button`,{onClick:()=>H(j),className:`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-600 text-gray-400 text-sm hover:bg-dark-500 transition-colors`,children:F?(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(e,{className:`w-4 h-4 text-green-500`}),`已复制`]}):(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(_,{className:`w-4 h-4`}),`复制`]})})]}),(0,S.jsx)(`div`,{className:`flex-1 p-4 bg-dark-800 font-mono text-sm text-gray-300 overflow-auto rounded-b-xl`,children:N?(0,S.jsxs)(`div`,{className:`flex flex-col items-center justify-center h-full text-gray-500`,children:[(0,S.jsx)(g,{className:`w-10 h-10 mb-3 animate-pulse text-primary`}),(0,S.jsx)(`p`,{children:`AI 正在分析你的代码...`})]}):j?(0,S.jsx)(`pre`,{className:`whitespace-pre-wrap`,children:j}):(0,S.jsxs)(`div`,{className:`flex flex-col items-center justify-center h-full text-gray-500`,children:[(0,S.jsx)(b,{className:`w-12 h-12 mb-3 opacity-30`}),(0,S.jsx)(`p`,{children:`输入代码并点击分析按钮`}),(0,S.jsx)(`p`,{className:`text-xs mt-2`,children:`AI 将为你提供代码审查和优化建议`})]})})]})]}),(0,S.jsx)(`div`,{className:`p-4 border-t border-white/5 bg-dark-800/50`,children:(0,S.jsxs)(`div`,{className:`grid grid-cols-2 md:grid-cols-4 gap-3`,children:[(0,S.jsxs)(`button`,{onClick:()=>V(`生成代码`),disabled:N||!k.trim(),className:`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed`,children:[(0,S.jsx)(t,{className:`w-4 h-4`}),`生成代码`]}),(0,S.jsxs)(`button`,{onClick:()=>V(`优化建议`),disabled:N||!k.trim(),className:`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed`,children:[(0,S.jsx)(y,{className:`w-4 h-4`}),`优化建议`]}),(0,S.jsxs)(`button`,{onClick:()=>V(`安全检查`),disabled:N||!k.trim(),className:`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed`,children:[(0,S.jsx)(d,{className:`w-4 h-4`}),`安全检查`]}),(0,S.jsxs)(`button`,{onClick:()=>V(`文档生成`),disabled:N||!k.trim(),className:`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-700/50 text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors border border-white/5 disabled:opacity-40 disabled:cursor-not-allowed`,children:[(0,S.jsx)(v,{className:`w-4 h-4`}),`文档生成`]})]})})]}),q=(0,S.jsxs)(`div`,{className:`h-full flex flex-col p-6 overflow-y-auto`,children:[(0,S.jsxs)(`div`,{className:`mb-6 flex items-start justify-between gap-4`,children:[(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`h3`,{className:`font-display text-xl font-bold text-white mb-2`,children:`VIP 专家团队`}),(0,S.jsx)(`p`,{className:`text-gray-400`,children:`专业游戏开发专家一对一指导`})]}),L&&(0,S.jsxs)(`div`,{className:`flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/15 text-green-400 text-sm animate-fade-in`,children:[(0,S.jsx)(e,{className:`w-4 h-4`}),L]})]}),(0,S.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`,children:l.map((e,t)=>(0,S.jsxs)(`div`,{className:`glass-card p-5 hover-lift group animate-fade-in`,style:{animationDelay:`${t*.1}s`},children:[(0,S.jsxs)(`div`,{className:`flex items-start gap-4 mb-4`,children:[(0,S.jsx)(`img`,{src:e.avatar_url,alt:e.name,className:`w-14 h-14 rounded-full flex-shrink-0 border-2 border-primary/30`}),(0,S.jsxs)(`div`,{className:`flex-1`,children:[(0,S.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,S.jsx)(`h4`,{className:`font-bold text-white`,children:e.name}),(0,S.jsxs)(`span`,{className:`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent`,children:[(0,S.jsx)(m,{className:`w-3 h-3 fill-current`}),`VIP`]})]}),(0,S.jsx)(`p`,{className:`text-sm text-primary`,children:e.title}),(0,S.jsxs)(`div`,{className:`flex items-center gap-1 mt-1`,children:[[...[,,,,,]].map((t,n)=>(0,S.jsx)(m,{className:`w-3 h-3 ${n<e.rating?`text-accent fill-accent`:`text-gray-600`}`},n)),(0,S.jsx)(`span`,{className:`text-xs text-gray-500 ml-1`,children:e.rating})]})]})]}),(0,S.jsx)(`p`,{className:`text-sm text-gray-400 mb-4 line-clamp-2`,children:e.bio}),(0,S.jsx)(`div`,{className:`flex flex-wrap gap-2 mb-4`,children:e.skills.map(e=>(0,S.jsx)(`span`,{className:`px-2.5 py-1 rounded-full text-xs bg-dark-700/50 text-gray-400 border border-white/5`,children:e},e))}),(0,S.jsxs)(`div`,{className:`flex items-center justify-between pt-4 border-t border-white/5`,children:[(0,S.jsxs)(`div`,{className:`flex items-center gap-3 text-sm text-gray-500`,children:[(0,S.jsxs)(`span`,{className:`flex items-center gap-1`,children:[(0,S.jsx)(f,{className:`w-4 h-4`}),e.response_time]}),(0,S.jsxs)(`span`,{children:[e.sessions,` 次咨询`]})]}),r?(0,S.jsxs)(`button`,{onClick:()=>U(e.name),className:`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:opacity-90 transition-all`,children:[`预约咨询`,(0,S.jsx)(n,{className:`w-4 h-4`})]}):(0,S.jsx)(o,{to:`/login`,className:`px-4 py-2 rounded-lg bg-dark-700/50 text-gray-400 text-sm font-medium border border-white/5 hover:text-primary transition-colors`,children:`登录后预约`})]})]},e.id))}),(0,S.jsx)(`div`,{className:`mt-8 glass-card p-6`,children:(0,S.jsxs)(`div`,{className:`flex flex-col md:flex-row items-center justify-between gap-4`,children:[(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`h3`,{className:`font-display text-xl font-bold text-white mb-2`,children:`成为 VIP 专家`}),(0,S.jsx)(`p`,{className:`text-gray-400`,children:`分享你的专业知识，获得丰厚回报`})]}),r?(0,S.jsxs)(`button`,{onClick:W,className:`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-secondary text-white font-medium hover:opacity-90 transition-all`,children:[(0,S.jsx)(p,{className:`w-5 h-5`}),`申请成为专家`]}):(0,S.jsx)(o,{to:`/login`,className:`px-6 py-3 rounded-xl bg-dark-700/50 text-gray-400 font-medium border border-white/5 hover:text-primary transition-colors`,children:`登录后申请`})]})})]});return(0,S.jsx)(`div`,{className:`min-h-screen pt-16`,children:(0,S.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 py-8`,children:[(0,S.jsxs)(`div`,{className:`flex flex-col md:flex-row items-center justify-between gap-4 mb-8`,children:[(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`h1`,{className:`font-display text-3xl md:text-4xl font-bold text-gradient mb-2`,children:`AI 辅助开发`}),(0,S.jsx)(`p`,{className:`text-gray-400`,children:`智能代码分析、架构设计与专家指导`})]}),r&&i?.role===`vip`&&(0,S.jsxs)(`span`,{className:`flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 text-accent border border-accent/30`,children:[(0,S.jsx)(m,{className:`w-4 h-4 fill-current`}),`VIP 会员专享`]})]}),(0,S.jsxs)(`div`,{className:`glass-card h-[600px] flex flex-col`,children:[(0,S.jsxs)(`div`,{className:`flex border-b border-white/5`,children:[(0,S.jsxs)(`button`,{onClick:()=>h(`chat`),className:`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${s===`chat`?`text-primary border-b-2 border-primary bg-primary/5`:`text-gray-400 hover:text-white hover:bg-white/5`}`,children:[(0,S.jsx)(u,{className:`w-5 h-5`}),`AI 对话`]}),(0,S.jsxs)(`button`,{onClick:()=>h(`code`),className:`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${s===`code`?`text-primary border-b-2 border-primary bg-primary/5`:`text-gray-400 hover:text-white hover:bg-white/5`}`,children:[(0,S.jsx)(t,{className:`w-5 h-5`}),`代码分析`]}),(0,S.jsxs)(`button`,{onClick:()=>h(`expert`),className:`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${s===`expert`?`text-primary border-b-2 border-primary bg-primary/5`:`text-gray-400 hover:text-white hover:bg-white/5`}`,children:[(0,S.jsx)(p,{className:`w-5 h-5`}),`专家咨询`]})]}),s===`chat`&&G,s===`code`&&K,s===`expert`&&q]})]})})}export{C as default};