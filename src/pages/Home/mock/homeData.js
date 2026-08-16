export const NAUSEA_TYPES = ['침덧', '토덧', '먹덧']

export const homeMockData = {
  user: {
    name: '다온님',
  },
  timeSlots: [
    { id: 'dawn', label: '새벽' },
    { id: 'morning', label: '오전' },
    { id: 'afternoon', label: '오후' },
    { id: 'evening', label: '저녁' },
  ],
  intensityLevels: [0, 1, 2, 3, 4, 5],
  // TODO: API 연동 후 AI가 생성하는 한 줄 요약 제목으로 교체 (원문 전체가 아닌 짧은 요약)
  summaryTitle: '계란비린내로 인한 심한 메스꺼움/식사 중단',
  // TODO: API 연동 후 AI가 분류하는 유발유형 카테고리로 교체 (기록 카드 요약 줄에 짧게 노출)
  triggerCategory: '음식냄새',
  analysisFields: [
    { id: 'trigger', label: '입덧 유발 요인', value: '계란볶음밥 → 계란 비린내' },
    { id: 'symptom', label: '증상 요약', value: '메스꺼움, 구역질' },
    { id: 'type', label: '입덧 유형', value: '토덧', options: NAUSEA_TYPES },
    { id: 'relief', label: '완화 요인', value: '발견되지 않음' },
    { id: 'situation', label: '발생 상황', value: '아침 식사 중' },
    { id: 'condition', label: '감정 및 컨디션', value: '구역감, 기분저하' },
  ],
}
