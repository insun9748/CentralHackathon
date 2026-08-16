export const reportMockData = {
  periodOptions: [
    { id: 'week1', label: '최근 1주' },
    { id: 'week2', label: '최근 2주' },
    { id: 'month1', label: '최근 1달' },
    { id: 'custom', label: '사용자 지정' },
  ],
  selectedPeriodId: 'week1',

  // TODO: API 연동 후 선택된 기간(periodId 또는 사용자 지정 날짜범위)으로 서버에서 조회해서 교체
  // 지금은 기간별로 다른 mock 데이터를 미리 준비해둬서, 드롭다운에서 기간을 바꾸면
  // 그래프/AI인사이트/유발요인·완화요인 TOP3/관리TIP이 실제로 달라지는 것처럼 시뮬레이션함
  periods: {
    week1: {
      chart: {
        max: 5,
        points: [
          { label: '새벽', range: '(00:00~06:00)', value: 1, avgIntensity: 1.2, mainCause: '환경' },
          { label: '오전', range: '(06:00~12:00)', value: 4, avgIntensity: 4.2, mainCause: '공복' },
          { label: '오후', range: '(12:00~18:00)', value: 1, avgIntensity: 1.3, mainCause: '향수냄새' },
          { label: '저녁', range: '(18:00~00:00)', value: 3, avgIntensity: 3.4, mainCause: '김치냄새' },
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
      otherTriggerFactors: [
        { rank: '04', name: '공복상태', detail: '강도2.8 | 3회' },
        { rank: '05', name: '향수냄새', detail: '강도2.6 | 5회' },
        { rank: '06', name: '고기', detail: '강도2.5 | 3회' },
        { rank: '07', name: '소화불량', detail: '강도2.5 | 3회' },
        { rank: '08', name: '밀폐공간', detail: '강도1.5 | 3회' },
      ],
      reliefFactors: {
        title: '완화 요인 TOP3',
        subtitle: '나에게 잘 맞아요',
        items: [
          { rank: '01', name: '레몬사탕', detail: '강도0 | 6회' },
          { rank: '02', name: '차가운 생강차', detail: '강도1 | 5회' },
          { rank: '03', name: '신선한 공기', detail: '강도1 | 4회' },
        ],
      },
      otherReliefFactors: [
        { rank: '04', name: '냉면', detail: '강도1 | 3회' },
        { rank: '05', name: '탄산수', detail: '강도1 | 2회' },
        { rank: '06', name: '차가운 물', detail: '강도1 | 2회' },
      ],
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
    },

    week2: {
      chart: {
        max: 5,
        points: [
          { label: '새벽', range: '(00:00~06:00)', value: 2, avgIntensity: 2.1, mainCause: '환경' },
          { label: '오전', range: '(06:00~12:00)', value: 2, avgIntensity: 2.3, mainCause: '카페인 냄새' },
          { label: '오후', range: '(12:00~18:00)', value: 2, avgIntensity: 2.0, mainCause: '생선냄새' },
          { label: '저녁', range: '(18:00~00:00)', value: 4, avgIntensity: 4.1, mainCause: '찌개냄새' },
        ],
      },
      aiInsight: {
        lines: ['저녁 식사 준비 중 냄새로 입덧이 심해져요', '환기하며 조리하거나 포장 음식을 활용해보세요'],
      },
      triggerFactors: {
        title: '주요 유발 요인 TOP3',
        subtitle: '주의가 필요해요',
        items: [
          { rank: '01', name: '찌개냄새', detail: '강도4.5 | 6회' },
          { rank: '02', name: '생선', detail: '강도3.8 | 4회' },
          { rank: '03', name: '카페인 냄새', detail: '강도2.9 | 3회' },
        ],
      },
      otherTriggerFactors: [
        { rank: '04', name: '튀김냄새', detail: '강도2.7 | 4회' },
        { rank: '05', name: '만원버스', detail: '강도2.5 | 3회' },
        { rank: '06', name: '설거지', detail: '강도2.2 | 3회' },
        { rank: '07', name: '청소세제', detail: '강도2 | 2회' },
        { rank: '08', name: '미세먼지', detail: '강도1.8 | 2회' },
      ],
      reliefFactors: {
        title: '완화 요인 TOP3',
        subtitle: '나에게 잘 맞아요',
        items: [
          { rank: '01', name: '사이다', detail: '강도0.5 | 7회' },
          { rank: '02', name: '견과류', detail: '강도1 | 4회' },
          { rank: '03', name: '창문 환기', detail: '강도1.2 | 3회' },
        ],
      },
      otherReliefFactors: [
        { rank: '04', name: '산책', detail: '강도1.2 | 3회' },
        { rank: '05', name: '가벼운 스트레칭', detail: '강도1.5 | 2회' },
        { rank: '06', name: '허브차', detail: '강도1.5 | 2회' },
      ],
      tips: [
        {
          emoji: '🍲',
          title: '저녁 요리는 환기하며 준비해보세요',
          lines: ['저녁 식사 준비 시간에 반복적으로 입덧이 심해지고 있어요', '창문을 열고 조리하거나 배달·포장을 활용해보세요'],
        },
        {
          emoji: '🐟',
          title: '생선 요리는 당분간 피해보세요',
          lines: ['생선 냄새에 반복적으로 강한 입덧이 나타나요', '가능하다면 조리를 다른 사람에게 부탁해보세요'],
        },
        {
          emoji: '🥤',
          title: '탄산음료를 챙겨보세요',
          lines: ['사이다를 마셨을 때 입덧이 크게 완화됐어요', '외출할 때 미리 챙겨두면 도움이 될 수 있어요'],
        },
        {
          emoji: '🚌',
          title: '출퇴근 혼잡시간을 피해보세요',
          lines: ['만원버스에서 입덧 강도가 높게 나타나요', '가능하다면 시간을 조절하거나 자리를 옮겨보세요'],
        },
      ],
    },

    month1: {
      chart: {
        max: 5,
        points: [
          { label: '새벽', range: '(00:00~06:00)', value: 2, avgIntensity: 1.5, mainCause: '담배연기' },
          { label: '오전', range: '(06:00~12:00)', value: 3, avgIntensity: 2.8, mainCause: '커피냄새' },
          { label: '오후', range: '(12:00~18:00)', value: 2, avgIntensity: 2.2, mainCause: '향수' },
          { label: '저녁', range: '(18:00~00:00)', value: 3, avgIntensity: 2.6, mainCause: '계란' },
        ],
      },
      aiInsight: {
        lines: ['한 달간 특정 냄새 자극이 꾸준히 입덧을 유발했어요', '외출 시 마스크나 손수건을 활용해보세요'],
      },
      triggerFactors: {
        title: '주요 유발 요인 TOP3',
        subtitle: '주의가 필요해요',
        items: [
          { rank: '01', name: '담배연기', detail: '강도4 | 4회' },
          { rank: '02', name: '향수', detail: '강도3 | 8회' },
          { rank: '03', name: '커피냄새', detail: '강도2.8 | 5회' },
        ],
      },
      otherTriggerFactors: [
        { rank: '04', name: '밀가루음식', detail: '강도2.5 | 6회' },
        { rank: '05', name: '계란', detail: '강도2.4 | 5회' },
        { rank: '06', name: '청국장', detail: '강도2.3 | 3회' },
        { rank: '07', name: '생선회', detail: '강도2 | 3회' },
        { rank: '08', name: '지하주차장', detail: '강도1.8 | 4회' },
      ],
      reliefFactors: {
        title: '완화 요인 TOP3',
        subtitle: '나에게 잘 맞아요',
        items: [
          { rank: '01', name: '견과류', detail: '강도0.5 | 10회' },
          { rank: '02', name: '요거트', detail: '강도1 | 7회' },
          { rank: '03', name: '가벼운 산책', detail: '강도1 | 6회' },
        ],
      },
      otherReliefFactors: [
        { rank: '04', name: '민트사탕', detail: '강도1.2 | 5회' },
        { rank: '05', name: '시원한 과일', detail: '강도1.3 | 4회' },
        { rank: '06', name: '낮잠', detail: '강도1.5 | 3회' },
      ],
      tips: [
        {
          emoji: '🚭',
          title: '담배 연기가 나는 장소를 피해보세요',
          lines: ['한 달간 담배 연기에서 가장 높은 입덧 강도를 보였어요', '흡연 구역과 거리를 두는 걸 권해요'],
        },
        {
          emoji: '🌸',
          title: '향이 강한 제품 사용을 줄여보세요',
          lines: ['향수나 방향제 냄새에 반복적으로 반응했어요', '무향 제품으로 바꿔보는 것도 방법이에요'],
        },
        {
          emoji: '🥜',
          title: '견과류를 간식으로 챙겨보세요',
          lines: ['한 달간 가장 꾸준히 입덧을 완화해준 음식이에요', '소량씩 자주 챙겨 먹어보세요'],
        },
        {
          emoji: '🚶',
          title: '가벼운 산책을 습관화해보세요',
          lines: ['짧은 산책 후 컨디션이 좋아지는 경향이 있었어요', '무리하지 않는 선에서 매일 조금씩 걸어보세요'],
        },
      ],
    },

    custom: {
      chart: {
        max: 5,
        points: [
          { label: '새벽', range: '(00:00~06:00)', value: 1, avgIntensity: 1.1, mainCause: '공복' },
          { label: '오전', range: '(06:00~12:00)', value: 2, avgIntensity: 2.2, mainCause: '고기냄새' },
          { label: '오후', range: '(12:00~18:00)', value: 3, avgIntensity: 3.1, mainCause: '매운음식' },
          { label: '저녁', range: '(18:00~00:00)', value: 2, avgIntensity: 2.4, mainCause: '세제냄새' },
        ],
      },
      aiInsight: {
        lines: ['선택하신 기간 동안 자극적인 음식 냄새에 예민했어요', '순한 음식 위주로 식단을 조절해보세요'],
      },
      triggerFactors: {
        title: '주요 유발 요인 TOP3',
        subtitle: '주의가 필요해요',
        items: [
          { rank: '01', name: '매운음식', detail: '강도3.6 | 5회' },
          { rank: '02', name: '고기냄새', detail: '강도3 | 4회' },
          { rank: '03', name: '세제냄새', detail: '강도2.5 | 3회' },
        ],
      },
      otherTriggerFactors: [
        { rank: '04', name: '양파냄새', detail: '강도2.2 | 3회' },
        { rank: '05', name: '엘리베이터', detail: '강도2 | 2회' },
        { rank: '06', name: '헤어스프레이', detail: '강도1.8 | 2회' },
        { rank: '07', name: '자동차 매연', detail: '강도1.6 | 2회' },
        { rank: '08', name: '뜨거운 국물', detail: '강도1.5 | 2회' },
      ],
      reliefFactors: {
        title: '완화 요인 TOP3',
        subtitle: '나에게 잘 맞아요',
        items: [
          { rank: '01', name: '물', detail: '강도0.3 | 8회' },
          { rank: '02', name: '산책', detail: '강도1 | 5회' },
          { rank: '03', name: '시원한 바람', detail: '강도1 | 4회' },
        ],
      },
      otherReliefFactors: [
        { rank: '04', name: '크래커', detail: '강도1.2 | 3회' },
        { rank: '05', name: '조용한 공간', detail: '강도1.3 | 3회' },
        { rank: '06', name: '따뜻한 보리차', detail: '강도1.5 | 2회' },
      ],
      tips: [
        {
          emoji: '🌶️',
          title: '자극적인 음식은 당분간 줄여보세요',
          lines: ['선택하신 기간 동안 매운 음식에서 강도가 가장 높았어요', '순하고 담백한 메뉴 위주로 선택해보세요'],
        },
        {
          emoji: '🥩',
          title: '고기 조리는 환기와 함께 해보세요',
          lines: ['고기 냄새에 반복적으로 반응했어요', '창문을 열거나 후드를 켜고 조리해보세요'],
        },
        {
          emoji: '💧',
          title: '물을 자주 챙겨 마셔보세요',
          lines: ['물을 마셨을 때 입덧이 가장 잘 완화됐어요', '한 번에 많이보다 조금씩 자주 마셔보세요'],
        },
        {
          emoji: '🧺',
          title: '세제·방향 제품은 무향으로 바꿔보세요',
          lines: ['세제 냄새에도 입덧 반응이 있었어요', '무향 제품으로 교체하는 것도 도움이 될 수 있어요'],
        },
      ],
    },
  },
}
