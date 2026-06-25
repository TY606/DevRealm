import { Post, User, Comment, Game, Platform, Expert, Badge, Achievement, Category, Channel, Contract } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@devrealm.com',
    username: 'DevMaster',
    bio: '资深游戏开发者，10年行业经验',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevMaster',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    reputation: 15000,
    level: 50,
    is_banned: false,
  },
  {
    id: '2',
    email: 'vip@devrealm.com',
    username: 'GamePro',
    bio: '独立游戏制作人，多款游戏销量过百万',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GamePro',
    role: 'vip',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
    reputation: 8500,
    level: 35,
    is_banned: false,
  },
  {
    id: '3',
    email: 'user@devrealm.com',
    username: 'IndieDev',
    bio: '热爱游戏开发的独立开发者',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IndieDev',
    role: 'user',
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
    reputation: 2300,
    level: 15,
    is_banned: false,
  },
  {
    id: '4',
    email: 'banned@devrealm.com',
    username: 'BadUser',
    bio: '违规用户',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BadUser',
    role: 'user',
    created_at: '2024-04-10T00:00:00Z',
    updated_at: '2024-05-20T00:00:00Z',
    reputation: 100,
    level: 5,
    is_banned: true,
  },
];

export const mockCategories: Category[] = [
  { id: '1', name: '技术讨论', icon: 'Code', color: '#6B21A8', count: 128 },
  { id: '2', name: '游戏设计', icon: 'Gamepad2', color: '#0EA5E9', count: 89 },
  { id: '3', name: '美术资源', icon: 'Palette', color: '#22C55E', count: 67 },
  { id: '4', name: '市场推广', icon: 'TrendingUp', color: '#F59E0B', count: 45 },
  { id: '5', name: '求职招聘', icon: 'Briefcase', color: '#EF4444', count: 32 },
  { id: '6', name: '综合交流', icon: 'MessageSquare', color: '#EC4899', count: 156 },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    title: 'Unity 2024 新特性详解：性能优化实战',
    content: `## Unity 2024 性能优化指南

Unity 2024 带来了许多令人兴奋的新特性，特别是在性能优化方面。本文将深入探讨以下几个关键领域：

### 1. 场景加载优化
使用新的异步加载API可以显著提升加载速度：

\`\`\`csharp
async Task LoadSceneAsync(string sceneName)
{
    var asyncOperation = SceneManager.LoadSceneAsync(sceneName);
    while (!asyncOperation.isDone)
    {
        await Task.Yield();
    }
}
\`\`\`

### 2. 渲染管线改进
URP 和 HDRP 都得到了重大改进，包括：
- 更好的批处理支持
- 改进的阴影质量
- 新的后处理效果

### 3. 内存管理
建议使用对象池来减少GC压力：

\`\`\`csharp
public class ObjectPool<T> where T : MonoBehaviour
{
    private Queue<T> pool = new Queue<T>();
    
    public T Get()
    {
        if (pool.Count > 0) return pool.Dequeue();
        return Instantiate(prefab);
    }
}
\`\`\``,
    category: '技术讨论',
    tags: ['Unity', '性能优化', '游戏开发'],
    likes: 256,
    comments_count: 42,
    created_at: '2024-06-20T10:30:00Z',
    updated_at: '2024-06-20T10:30:00Z',
    user: mockUsers[0],
    status: 'published',
  },
  {
    id: '2',
    user_id: '2',
    title: '独立游戏市场分析：2024年趋势与机遇',
    content: `# 2024年独立游戏市场分析

随着游戏产业的持续发展，独立游戏市场也在不断演变。本文将分析当前市场趋势和未来机遇。

## 市场现状
- 移动端独立游戏持续增长
- Steam平台竞争加剧
- 玩家对叙事驱动游戏需求增加

## 成功策略
1. **差异化定位** - 找到独特的游戏玩法
2. **社区建设** - 早期建立玩家社群
3. **多平台发布** - 同时覆盖多个平台

## 推荐阅读
关注行业报告和数据分析平台，了解最新趋势。`,
    category: '市场推广',
    tags: ['市场分析', '独立游戏', '趋势'],
    likes: 189,
    comments_count: 35,
    created_at: '2024-06-18T14:20:00Z',
    updated_at: '2024-06-18T14:20:00Z',
    user: mockUsers[1],
    status: 'published',
  },
  {
    id: '3',
    user_id: '3',
    title: '分享我的2D游戏美术资源收集清单',
    content: `# 2D游戏美术资源推荐

作为一个独立开发者，找到优质的美术资源是非常重要的。以下是我的收藏清单：

## 免费资源网站
- itch.io - 大量免费游戏素材
- OpenGameArt - 开源游戏美术
- Kenney - 高质量像素风格资源

## 付费资源
- Asset Store - Unity官方市场
- Gumroad - 独立创作者平台

## 工具推荐
- Aseprite - 像素画工具
- Photoshop - 专业图像处理
- Blender - 3D建模与渲染

希望这些资源能帮助到大家！`,
    category: '美术资源',
    tags: ['美术资源', '2D游戏', '素材'],
    likes: 145,
    comments_count: 28,
    created_at: '2024-06-15T09:45:00Z',
    updated_at: '2024-06-15T09:45:00Z',
    user: mockUsers[2],
    status: 'published',
  },
  {
    id: '4',
    user_id: '1',
    title: 'AI辅助游戏开发：从概念到原型',
    content: `# AI辅助游戏开发实战

人工智能正在改变游戏开发的方式。本文介绍如何使用AI工具加速开发流程。

## AI工具推荐
1. **代码生成** - GitHub Copilot、CodeLlama
2. **美术生成** - Midjourney、Stable Diffusion
3. **音效生成** - ElevenLabs、AudioLDM

## 实战案例
使用AI生成游戏概念图，然后快速迭代：

\`\`\`
提示词示例：
"Pixel art game scene, cyberpunk city, neon lights, rainy night, detailed"
\`\`\`

## 注意事项
- AI工具是辅助，不是替代
- 需要人工审核和调整
- 注意版权问题`,
    category: '技术讨论',
    tags: ['AI', '游戏开发', '工具'],
    likes: 321,
    comments_count: 56,
    created_at: '2024-06-12T16:00:00Z',
    updated_at: '2024-06-12T16:00:00Z',
    user: mockUsers[0],
    status: 'published',
  },
  {
    id: '5',
    user_id: '2',
    title: '游戏设计文档模板分享',
    content: `# 游戏设计文档(GDD)模板

一个好的GDD是项目成功的基础。分享我的模板结构：

## 1. 项目概述
- 游戏名称
- 目标平台
- 开发周期
- 核心玩法

## 2. 游戏玩法
- 核心机制
- 游戏流程
- 关卡设计

## 3. 角色与世界观
- 主角设定
- NPC设计
- 世界观背景

## 4. 技术规格
- 引擎选择
- 技术栈
- 性能目标

## 5. 美术风格
- 视觉风格描述
- 色彩方案
- UI设计

完整模板已上传至资源区，欢迎下载使用！`,
    category: '游戏设计',
    tags: ['GDD', '游戏设计', '模板'],
    likes: 203,
    comments_count: 31,
    created_at: '2024-06-10T11:30:00Z',
    updated_at: '2024-06-10T11:30:00Z',
    user: mockUsers[1],
    status: 'pending',
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    post_id: '1',
    user_id: '2',
    content: '非常实用的内容！期待更多性能优化的分享。',
    likes: 23,
    created_at: '2024-06-20T11:45:00Z',
    user: mockUsers[1],
  },
  {
    id: '2',
    post_id: '1',
    user_id: '3',
    parent_id: '1',
    content: '同意！Unity 2024的批处理确实改进很多。',
    likes: 12,
    created_at: '2024-06-20T12:00:00Z',
    user: mockUsers[2],
  },
  {
    id: '3',
    post_id: '2',
    user_id: '1',
    content: '分析得很到位，市场确实在变化。',
    likes: 18,
    created_at: '2024-06-18T15:30:00Z',
    user: mockUsers[0],
  },
];

export const mockGames: Game[] = [
  {
    id: '1',
    user_id: '2',
    name: '星空探险者',
    title: '星空探险者',
    description: '一款太空探索类Roguelike游戏，玩家将驾驶飞船探索未知星系，收集资源，战胜敌人。',
    category: '动作冒险',
    genre: '动作冒险',
    cover_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    cover_image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    developer: 'GamePro工作室',
    status: 'live',
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-06-15T00:00:00Z',
    published_at: '2024-05-15T00:00:00Z',
    user: mockUsers[1],
    downloads: '125K',
    rating: 4.8,
  },
  {
    id: '2',
    user_id: '3',
    name: '像素地牢',
    title: '像素地牢',
    description: '复古像素风格的地牢探险游戏，包含丰富的装备系统和随机生成的地牢。',
    category: '角色扮演',
    genre: '角色扮演',
    cover_url: 'https://images.unsplash.com/photo-1628157585537-4b454e90e6ba?w=800',
    cover_image: 'https://images.unsplash.com/photo-1628157585537-4b454e90e6ba?w=800',
    developer: 'IndieDev独立制作',
    status: 'approved',
    created_at: '2024-05-20T00:00:00Z',
    updated_at: '2024-06-10T00:00:00Z',
    published_at: '2024-06-01T00:00:00Z',
    user: mockUsers[2],
    downloads: '56K',
    rating: 4.5,
  },
  {
    id: '3',
    user_id: '1',
    name: '赛博都市',
    title: '赛博都市',
    description: '未来都市题材的开放世界游戏，玩家扮演赏金猎人在霓虹灯下的城市中穿梭。',
    category: '开放世界',
    genre: '开放世界',
    cover_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    cover_image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    developer: 'DevMaster Games',
    status: 'pending',
    created_at: '2024-06-10T00:00:00Z',
    updated_at: '2024-06-18T00:00:00Z',
    user: mockUsers[0],
    downloads: 0,
    rating: 0,
  },
];

export const mockPlatforms: Platform[] = [
  { id: '1', name: 'Steam', logo: 'steam', description: '全球最大的PC游戏平台', supported: true },
  { id: '2', name: 'Epic Games', logo: 'epic', description: 'Epic游戏商城，提供独占游戏', supported: true },
  { id: '3', name: 'GOG', logo: 'gog', description: '无DRM的经典游戏平台', supported: true },
  { id: '4', name: 'itch.io', logo: 'itch', description: '独立游戏开发者社区', supported: true },
  { id: '5', name: 'PlayStation', logo: 'ps', description: '索尼PlayStation主机平台', supported: false },
  { id: '6', name: 'Xbox', logo: 'xbox', description: '微软Xbox主机平台', supported: false },
];

export const mockExperts: Expert[] = [
  {
    id: '1',
    user_id: '1',
    specialization: '游戏架构设计',
    bio: '前EA高级工程师，参与过多款AAA级游戏开发',
    rating: 5,
    joined_at: '2024-01-01T00:00:00Z',
    user: mockUsers[0],
  },
  {
    id: '2',
    user_id: '2',
    specialization: '独立游戏发行',
    bio: '成功发行过10+款独立游戏，总销量超500万',
    rating: 5,
    joined_at: '2024-02-15T00:00:00Z',
    user: mockUsers[1],
  },
];

export const mockBadges: Badge[] = [
  { id: '1', user_id: '1', name: '社区元老', description: '平台早期用户', icon_url: '🏆', earned_at: '2024-01-01T00:00:00Z' },
  { id: '2', user_id: '1', name: '技术达人', description: '发布10篇以上技术文章', icon_url: '💻', earned_at: '2024-03-15T00:00:00Z' },
  { id: '3', user_id: '1', name: '游戏发布者', description: '成功发布首款游戏', icon_url: '🎮', earned_at: '2024-05-01T00:00:00Z' },
];

export const mockAchievements: Achievement[] = [
  { id: '1', user_id: '1', name: '初来乍到', description: '完成首次登录', progress: 1, target: 1, completed: true, completed_at: '2024-01-01T00:00:00Z' },
  { id: '2', user_id: '1', name: '社区活跃', description: '发布100条评论', progress: 156, target: 100, completed: true, completed_at: '2024-04-20T00:00:00Z' },
  { id: '3', user_id: '1', name: '声望达人', description: '获得10000声望值', progress: 15000, target: 10000, completed: true, completed_at: '2024-06-10T00:00:00Z' },
  { id: '4', user_id: '1', name: '全能开发者', description: '在所有板块发表过内容', progress: 3, target: 4, completed: false },
];

export const mockChannels: Channel[] = [
  { id: '1', name: 'Steam', description: '全球最大的PC游戏平台', color: '#1b2838' },
  { id: '2', name: 'Epic Games', description: 'Epic游戏商城，提供独占游戏', color: '#313131' },
  { id: '3', name: 'GOG', description: '无DRM的经典游戏平台', color: '#8B0000' },
  { id: '4', name: 'itch.io', description: '独立游戏开发者社区', color: '#FA5C5C' },
  { id: '5', name: 'PlayStation', description: '索尼PlayStation主机平台', color: '#003087' },
  { id: '6', name: 'Xbox', description: '微软Xbox主机平台', color: '#107C10' },
];

export const mockContracts: Contract[] = [
  {
    id: '1',
    title: '星空探险者 - Steam发行合同',
    status: 'signed',
    channel_name: 'Steam',
    valid_until: '2025-12-31',
    revenue_share: 70,
  },
  {
    id: '2',
    title: '像素地牢 - Epic独占协议',
    status: 'pending',
    channel_name: 'Epic Games',
    valid_until: '2025-06-30',
    revenue_share: 88,
  },
  {
    id: '3',
    title: '星空探险者 - GOG发行合同',
    status: 'signed',
    channel_name: 'GOG',
    valid_until: '2025-09-15',
    revenue_share: 70,
  },
  {
    id: '4',
    title: '老游戏合集 - itch.io',
    status: 'expired',
    channel_name: 'itch.io',
    valid_until: '2024-01-01',
    revenue_share: 90,
  },
  {
    id: '5',
    title: '赛博都市 - 多平台发行协议',
    status: 'pending',
    channel_name: '多平台联合',
    valid_until: '2026-03-31',
    revenue_share: 75,
  },
];