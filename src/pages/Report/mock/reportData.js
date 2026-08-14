export const reportMockData = {
  periodOptions: [
    { id: 'week1', label: '최근 1주' },
    { id: 'week2', label: '최근 2주' },
    { id: 'month1', label: '최근 1달' },
    { id: 'custom', label: '사용자 지정' },
  ],
  selectedPeriodId: 'week1',

  chart: {
    max: 5,
    points: [
      { label: '새벽', range: '(00:00~06:00)', value: 1 },
      { label: '오전', range: '(06:00~12:00)', value: 4 },
      { label: '오후', range: '(12:00~18:00)', value: 1 },
      { label: '저녁', range: '(18:00~00:00)', value: 3 },
    ],
  },

  aiInsight: {
    lines: ['오전 공복 상태에서 입덧이 가장 심하게 나타나요', '공복시간을 줄여보세요'],
  },

  triggerFactors: {
    title: '주요 유발 요인 TOP3',
    subtitle: '주의가 필요해요',
    items: [
      { rank: '01', name: '김치냄새', detail: '강도4 | 5회' },
      { rank: '02', name: '계란', detail: '강도3.5 | 3회' },
      { rank: '03', name: '지하철 안', detail: '강도3 | 3회' },
    ],
  },

  reliefFactors: {
    title: '완화 요인 TOP3',
    subtitle: '나에게 잘 맞아요',
    items: [
      { rank: '01', name: '레몬사탕', detail: '강도0 | 6회' },
      { rank: '02', name: '차가운 생강차', detail: '강도1 | 5회' },
      { rank: '03', name: '신선한 공기', detail: '강도1 | 4회' },
    ],
  },

  tips: [
    {
      emoji: '🍟',
      title: '침대 옆에 간식을 준비해 보세요',
      lines: ['아침 공복 상태에서 반복적으로 입덧이 나타나고 있어요', '기상 후 부담없이 먹을 수 있는 간식을 배치해보세요'],
    },
    {
      emoji: '🥚',
      title: '계란조리를 피해보세요',
      lines: ['계란이 들어간 요리를 접한 뒤 입덧이 반복되고 있어요', '당분간 계란 조리는 다른 사람에게 부탁하거나 충분한 환기를 권해요'],
    },
    {
      emoji: '🍬',
      title: '출근 전 레몬사탕을 챙겨보세요',
      lines: ['출근 시간 지하철에서 높은 입덧 강도를 보여요', '가능하다면 혼잡시간을 피하거나 이동중에는 레몬사탕을 준비해보세요'],
    },
    {
      emoji: '🥘',
      title: '저녁에는 냄새가 적은 음식을 선택해보세요',
      lines: ['김치와 찌개냄새가 저녁 입덧의 원인으로 나타나고 있어요', '저녁에는 냄새가 적은 메뉴를 선택하거나 조리 시 환기해보세요'],
    },
  ],
}
