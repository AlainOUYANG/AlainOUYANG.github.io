export type LabProject = {
  title: string;
  description: string;
  status: '探索中' | '持续迭代';
  tags: readonly string[];
};

export const labProjects: readonly LabProject[] = [
  {
    title: 'AI 播客工作流',
    description: '探索从资料整理、脚本生成到音频制作的可复用内容工作流。',
    status: '持续迭代',
    tags: ['AI Content', 'Podcast', 'Workflow']
  },
  {
    title: '个人知识与内容系统',
    description: '把阅读、笔记和选题连接起来，减少知识沉淀与公开表达之间的摩擦。',
    status: '探索中',
    tags: ['Knowledge', 'Writing', 'Automation']
  },
  {
    title: 'AI 原生效率工具',
    description: '用 AI 编程快速验证面向个人生产力的小工具和交互原型。',
    status: '探索中',
    tags: ['AI Coding', 'Productivity', 'Prototype']
  }
] as const;
