import { useRef, useState } from 'react'
import micIcon from '../../assets/Home/img/mic-icon.svg'
import micStopIcon from '../../assets/Home/img/mic-stop.svg'
import Waveform from './Waveform.jsx'
import './VoiceRecorder.scss'

function VoiceRecorder({ onRecordingComplete, className = '' }) {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onRecordingComplete?.(audioBlob)
      }

      recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
      setHasRecorded(true)
    } catch (err) {
      console.error('마이크 권한을 확인해주세요.', err)
    }
  }

  const stopRecording = () => {
    recorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className={`voice-recorder ${className}`.trim()}>
      {hasRecorded && <Waveform active={isRecording} />}
      <button
        type="button"
        className="voice-recorder-btn"
        onClick={handleClick}
        aria-label={isRecording ? '녹음 중지' : '음성으로 입력'}
      >
        <img src={isRecording ? micStopIcon : micIcon} alt="" />
      </button>
    </div>
  )
}

export default VoiceRecorder
