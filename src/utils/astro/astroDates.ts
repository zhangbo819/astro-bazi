enum AstroEventType {
  Pattern = 'pattern', // 几何格局
  Cycle = 'cycle', // 周期事件
  Ingress = 'ingress', // 行星换座
  Discovery = 'discovery', // 行星发现
  Historical = 'historical', // 历史事件
  Eclipse = 'eclipse', // 食相
  Symbolic = 'symbolic', // 象征性节点
}

interface AstrologyEvent {
  name: string;
  time: string;
  description: string;
}

interface AstrologyEventGroup {
  type: AstroEventType;
  data: AstrologyEvent[];
}

const astrologyEvents: AstrologyEventGroup[] = [
  {
    type: AstroEventType.Pattern,
    data: [
      {
        name: '七行星聚集',
        time: '1962-02-05T14:00:00Z',
        description: '经典水瓶群星结构',
      },
      {
        name: '顶点合相大十字',
        time: '2010-08-07T00:00:00Z',
        description: '高张力多轴结构',
      },
      {
        name: '水象大三角',
        time: '2013-07-17T18:00:00Z',
        description: '木星、土星、海王形成经典水象大三角',
      },
      {
        name: '多重格局叠加',
        time: '2013-07-29T04:30:00Z',
        description: '2风筝、3大三角、2T三角同时存在',
      },
      {
        name: '红色大十字',
        time: '2014-04-23T18:00:00Z',
        description: '经典本位宫大十字',
      },
      {
        name: '固定宫T三角',
        time: '2021-06-14T10:00:00Z',
        description: '土星、天王、火星形成固定宫T三角',
      },
    ],
  },

  {
    type: AstroEventType.Cycle,
    data: [
      {
        name: '土天海三重结构',
        time: '1989-11-09T18:53:00Z',
        description: '柏林墙时期的重要结构节点',
      },
      {
        name: '土冥合',
        time: '2020-01-12T16:59:00Z',
        description: '全球结构重组的重要周期节点',
      },
      {
        name: '木土大合 (水瓶0°)',
        time: '2020-12-21T18:20:00Z',
        description: '风元素时代的重要周期节点',
      },
    ],
  },

  {
    type: AstroEventType.Ingress,
    data: [
      {
        name: '冥王星进入摩羯',
        time: '2008-01-26T19:32:00Z',
        description: '全球资本结构与平台权力体系重构',
      },
      {
        name: '天王星进入金牛',
        time: '2018-05-15T15:16:00Z',
        description: '数字资产、金融系统与现实资源结构重组',
      },
      {
        name: '冥王星进入水瓶',
        time: '2023-03-23T09:13:00Z',
        description: 'AI、网络与群体结构的重写(核心转折点)',
      },
    ],
  },

  {
    type: AstroEventType.Eclipse,
    data: [
      {
        name: '狮子座美国大日食',
        time: '2017-08-21T18:26:00Z',
        description: '横贯美国的重要狮子座日食',
      },
      {
        name: '北美白羊日食',
        time: '2024-04-08T18:18:00Z',
        description: '白羊轴线的重要日食事件',
      },
      {
        name: '巨蟹月偏食',
        time: '2020-01-10T19:10:00Z',
        description: '土冥合前后的关键月食节点',
      },
      {
        name: '双子-射手食相轴开启',
        time: '2020-06-05T19:12:00Z',
        description: '信息、传播与认知主题的重要食相周期',
      },
    ],
  },

  {
    type: AstroEventType.Discovery,
    data: [
      {
        name: '天王星发现',
        time: '1781-03-13T00:00:00Z',
        description: '现代革命、科技与觉醒主题进入占星体系',
      },
      {
        name: '谷神星发现',
        time: '1801-01-01T00:00:00Z',
        description: '现代小行星占星的重要起点',
      },
      {
        name: '海王星发现',
        time: '1846-09-23T00:00:00Z',
        description: '现代意识与潜意识占星的重要起点',
      },
      {
        name: '凯龙星发现',
        time: '1977-11-01T00:00:00Z',
        description: '现代疗愈与创伤主题的重要节点',
      },
      {
        name: '冥王星发现',
        time: '1930-02-18T00:00:00Z',
        description: '现代冥王主题进入集体视野',
      },
    ],
  },

  {
    type: AstroEventType.Symbolic,
    data: [
      {
        name: '冬至（玛雅历法讨论节点）',
        time: '2012-12-21T11:11:00Z',
        description: '集体意识转向的象征性时间节点',
      },
      {
        name: '千禧年时刻',
        time: '2000-01-01T00:00:00Z',
        description: '20世纪进入21世纪的重要象征节点',
      },
      {
        name: '互联网公众化时代开启',
        time: '1995-08-09T00:00:00Z',
        description: '互联网正式进入大众社会的重要象征时间',
      },
      {
        name: 'ChatGPT 发布',
        time: '2022-11-30T18:00:00Z',
        description: 'AI生成时代象征节点',
      },
    ],
  },

  {
    type: AstroEventType.Historical,
    data: [
      {
        name: '阿波罗11号登月',
        time: '1969-07-20T20:17:00Z',
        description: '人类首次登陆月球的重要历史节点',
      },
      {
        name: '柏林墙倒塌',
        time: '1989-11-09T18:53:00Z',
        description: '冷战结构瓦解的重要象征时刻',
      },
      {
        name: '911事件',
        time: '2001-09-11T12:46:00Z',
        description: '全球结构与安全叙事的重要转折点',
      },
      {
        name: '比特币创世区块',
        time: '2009-01-03T18:15:05Z',
        description: '去中心化数字货币时代的重要起点',
      },
      {
        name: 'WHO宣布全球疫情',
        time: '2020-03-11T00:00:00Z',
        description: '全球疫情时代正式开启',
      },
    ],
  },
];

const astroEventMap = {
  [AstroEventType.Pattern]: { text: '经典格局' },
  [AstroEventType.Cycle]: { text: '周期事件' },
  [AstroEventType.Ingress]: { text: '行星换座' },
  [AstroEventType.Discovery]: { text: '行星发现' },
  [AstroEventType.Historical]: { text: '历史事件' },
  [AstroEventType.Eclipse]: { text: '食相' },
  [AstroEventType.Symbolic]: { text: '象征性节点' },
};

export const astrologyEventsUI = astrologyEvents.map((i) => ({
  text: astroEventMap[i.type].text,
  children: i.data.map(({ name, description, time }) => {
    const date = new Date(time);
    const text = date.getFullYear() + '_' + name;
    return {
      text,
      id: time,
      description,
    };
  }),
}));
