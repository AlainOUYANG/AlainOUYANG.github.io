export type Topic = {
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  questions: readonly string[];
  accent: 'coral' | 'violet' | 'amber';
};

export const topics: readonly Topic[] = [
  {
    number: '01',
    title: '因果推断与实验评估',
    shortTitle: '因果与实验',
    description: '从相关性走向可验证的因果结论，关注实验设计、偏差识别和稳健评估。',
    questions: ['怎样定义真正的增量？', '实验结果如何支持长期决策？'],
    accent: 'coral'
  },
  {
    number: '02',
    title: 'Uplift Modeling 与增量决策',
    shortTitle: 'Uplift Modeling',
    description: '识别干预对不同人群的异质性影响，把模型输出连接到更有效的资源分配。',
    questions: ['谁会因为干预而改变？', '模型效果如何被可靠评估？'],
    accent: 'violet'
  },
  {
    number: '03',
    title: '智能营销算法',
    shortTitle: '智能营销',
    description: '围绕用户响应、策略评估和增量价值，讨论营销算法中的建模与决策问题。',
    questions: ['预测准确是否等于业务有效？', '如何避免只优化表面指标？'],
    accent: 'amber'
  }
] as const;
