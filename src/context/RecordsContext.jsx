import { useCallback, useEffect, useState } from 'react'
import { RecordsContext, emotionFromIntensityLevel } from './records-context.js'
import { getRecords, createRecord, updateRecord as updateRecordApi, deleteRecord as deleteRecordApi } from '../api/record.js'
import { analyzeRecord } from '../api/ai.js'
import { isLoggedIn } from '../api/tokenStorage.js'

function mapRecord(record) {
  const dateTime = record.recordDateTime
  return {
    id: record.recordId,
    date: dateTime ? dateTime.slice(0, 10) : null,
    recordDateTime: dateTime,
    timeCategory: record.timeCategory?.name ?? '',
    timeCategoryId: record.timeCategory?.timeCategoryId ?? null,
    intensityId: record.intensity?.intensityId ?? null,
    intensity: record.intensity?.level ?? 0,
    emotion: emotionFromIntensityLevel(record.intensity?.level),
    title: record.memo || '기록',
    memo: record.memo ?? '',
    status: record.status,
    // 목록 조회 응답에는 AI 분석 결과가 없어서, 분석을 조회하기 전까지는 비워둔다
    triggerType: '-',
    symptom: record.intensity?.description ?? '',
    analysis: null,
  }
}

export function RecordsProvider({ children }) {
  const [todayRecords, setTodayRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!isLoggedIn()) {
      setTodayRecords([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getRecords()
      setTodayRecords(data.map(mapRecord))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      // effect 실행과 동기적으로 얽히지 않도록 한 틱 양보한 뒤 상태를 갱신한다
      await Promise.resolve()
      if (!cancelled) await refresh()
    }

    load()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const addRecord = useCallback(async ({ timeCategoryId, intensityId, recordDateTime, memo }) => {
    const { recordId } = await createRecord({ timeCategoryId, intensityId, recordDateTime, memo })
    await refresh()
    return recordId
  }, [refresh])

  const analyzeAndAttach = useCallback(async (recordId) => {
    const analysis = await analyzeRecord(recordId)
    setTodayRecords((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? {
              ...record,
              title: analysis.aiSummary || record.title,
              triggerType: analysis.triggerFactor || record.triggerType,
              symptom: analysis.symptomSummary || record.symptom,
              analysis,
            }
          : record
      )
    )
    return analysis
  }, [])

  const editRecord = useCallback(async (recordId, payload) => {
    await updateRecordApi(recordId, payload)
    await refresh()
  }, [refresh])

  const removeRecord = useCallback(async (recordId) => {
    await deleteRecordApi(recordId)
    setTodayRecords((prev) => prev.filter((record) => record.id !== recordId))
  }, [])

  return (
    <RecordsContext.Provider
      value={{ todayRecords, loading, error, refresh, addRecord, analyzeAndAttach, editRecord, removeRecord }}
    >
      {children}
    </RecordsContext.Provider>
  )
}
