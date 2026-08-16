import { useEffect, useState } from 'react'
import { RecordsContext, todayDateKey } from './records-context.js'

const STORAGE_KEY = 'deotlog:todayRecords'

// 트래커 페이지가 예전에 자체적으로 갖고 있던 데모 기록 — 저장된 기록이 하나도 없을 때만
// 기본값으로 보여줘서, 홈/트래커가 같은 기록 저장소를 보고 있다는 걸 알 수 있게 함
function createSeedRecords() {
  const date = todayDateKey()
  return [
    {
      id: 1,
      date,
      timeCategory: '오전',
      emotion: 'good',
      title: '울렁거릴 때 레몬사탕을 먹고 속이 조금 편해짐',
      triggerType: 'X',
      symptom: '입덧완화',
      intensity: 0,
    },
    {
      id: 2,
      date,
      timeCategory: '오전',
      emotion: 'bad',
      title: '계란비린내로 인한 심한 메스꺼움/식사 중단',
      triggerType: '음식냄새',
      symptom: '메스꺼움',
      intensity: 4,
    },
    {
      id: 3,
      date,
      timeCategory: '새벽',
      emotion: 'soso',
      title: '아무것도 먹지 않은 공복상태로 속이 울렁거림',
      triggerType: '환경',
      symptom: '울렁거림',
      intensity: 3,
    },
  ]
}

function loadStoredRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // 저장된 값이 깨졌으면 무시하고 시드 데이터로 대체
  }
  return createSeedRecords()
}

export function RecordsProvider({ children }) {
  const [todayRecords, setTodayRecords] = useState(loadStoredRecords)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todayRecords))
  }, [todayRecords])

  const addRecord = (record) => {
    setTodayRecords((records) => [...records, record])
  }

  return (
    <RecordsContext.Provider value={{ todayRecords, addRecord }}>
      {children}
    </RecordsContext.Provider>
  )
}
