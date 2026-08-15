import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/tracker/scss/tracker_main.scss';

//이미지
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import arrowRightIcon from '../../assets/tracker/img/tracker_right.svg';
import goodIcon from '../../assets/tracker/img/tracker_good.svg';
import sosoIcon from '../../assets/tracker/img/tracker_soso.svg';
import badIcon from '../../assets/tracker/img/tracker_bad.svg';
import cardArrow from '../../assets/tracker/img/tracker_card_arrow.svg';

function Tracker_main() {
  // 1. 상태값 정의

  // 실제 오늘 날짜 (기준값)
  const realToday = new Date();

  // 2. 기준 연/월의 초기값을 오늘 날짜의 1일로 설정
  const [currentDate, setCurrentDate] = useState(
    new Date(realToday.getFullYear(), realToday.getMonth(), 1)
  );

  // 3. 선택된 일자의 초기값을 오늘의 '일(day)'로 설정
  const [selectedDay, setSelectedDay] = useState(realToday.getDate());

  // 더미 사용자 데이터 (나중에 백엔드 API 연동 자리)
  const [pregnancyInfo, setPregnancyInfo] = useState({
    weeks: 9,
    days: 3,
  });

  // 날짜별 이모지 더미 데이터 (YYYY-MM-DD 형태 또는 일자 기준)
  const dummyEmotionMap = {
    2: 'bad',
    3: 'bad',
    4: 'soso',
    5: 'soso',
    6: 'bad',
    7: 'good',
    8: 'soso',
    10: 'soso',
    11: 'bad',
    12: 'good',
    13: 'soso',
    14: 'soso',
    15: 'bad',
    16: 'bad',
    17: 'bad',
    18: 'soso',
    19: 'bad',
    20: 'soso',
  };

  // 2. 월 이동 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 3. 달력 날짜 계산 로직
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 ~ 11

  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= lastDate; i++) {
    calendarDays.push(i);
  }
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  // 이모지 렌더링 헬퍼 함수
  const getEmotionImg = (emotion) => {
    if (emotion === 'good') return <img src={goodIcon} alt="좋음" className="tracker_emotion_img" />;
    if (emotion === 'soso') return <img src={sosoIcon} alt="보통" className="tracker_emotion_img" />;
    if (emotion === 'bad') return <img src={badIcon} alt="나쁨" className="tracker_emotion_img" />;
    return null;
  };

  //현재 날짜로 돌아가는 버튼
  //월, 일이 모두 오늘과 일치하는지 비교
  const isToday =
    currentDate.getFullYear() === realToday.getFullYear() &&
    currentDate.getMonth() === realToday.getMonth() &&
    selectedDay === realToday.getDate();

  // '오늘' 버튼 클릭 시 현재 연/월/일로 즉시 복귀
  const handleGoToday = () => {
    setCurrentDate(new Date(realToday.getFullYear(), realToday.getMonth(), 1));
    setSelectedDay(realToday.getDate());
  };



  // 하단 기록 리스트 더미 데이터 (백엔드 연동)
  const mockRecords = [
    {
      id: 1,
      timeCategory: '오전',
      emotion: 'good',
      title: '울렁거릴 때 레몬사탕을 먹고 속이 조금 편해짐',
      triggerType: 'X',
      symptom: '입덧완화',
      intensity: 0,
    },
    {
      id: 2,
      timeCategory: '오전',
      emotion: 'bad',
      title: '계란비린내로 인한 심한 메스꺼움/식사 중단',
      triggerType: '음식냄새',
      symptom: '메스꺼움',
      intensity: 4,
    },
    {
      id: 3,
      timeCategory: '새벽',
      emotion: 'soso',
      title: '아무것도 먹지 않은 공복상태로 속이 울렁거림',
      triggerType: '환경',
      symptom: '울렁거림',
      intensity: 3,
    },
  ];

  // 카드 클릭 시 상세 페이지로 이동 (id 전달)

  const navigate = useNavigate();
  const handleCardClick = (id) => {
    navigate(`/tracker/detail/${id}`); // 상세 페이지 라우트에 맞게 지정
  };

  const handleThisWeek = (id) => {
    navigate(`/tracker/week`); 
  };




  return (
    <div className="tracker_wrap">
      <h2 className="tracker_main_title">트래커</h2>

      {/* 상단 임신 주차 정보 */}
      <div className="tracker_main_header">
        <h3 className="tracker_main_week">
          임신 {pregnancyInfo.weeks}주 {pregnancyInfo.days}일차에요
        </h3>
        <button type="button" className="tracker_info_link_btn" onClick={handleThisWeek}>
          이번 주 임신 정보 보러가기 <img src={arrowRightIcon} alt="" />
        </button>
      </div>

      {/* 달력 섹션 */}
      <div className="tracker_calendar_container">
        {/* 달력 헤더 (월 전환) */}
        <div className="tracker_calendar_month_bar">
          <button type="button" onClick={handlePrevMonth} className="tracker_nav_btn">
            <img src={arrowLeftIcon} alt="이전달" className='tracker_arrow_img' />
          </button>
          <span className="tracker_month_title">{month + 1}월</span>
          <button type="button" onClick={handleNextMonth} className="tracker_nav_btn">
            <img src={arrowRightIcon} alt="다음달" className='tracker_arrow_img' />
          </button>
        </div>

        {/* 달력 그리드 */}
        <div className="tracker_calendar_grid">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="tracker_day_cell empty" />;
            }

            const isSelected = day === selectedDay;
            const isRealToday =
              currentDate.getFullYear() === realToday.getFullYear() &&
              currentDate.getMonth() === realToday.getMonth() &&
              day === realToday.getDate();

            return (
              <div
                key={`day-${day}`}
                className={`tracker_day_cell ${isSelected ? 'selected' : ''} ${isRealToday ? 'today' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <span className="tracker_day_num">{day}</span>
                <div className="emotion_wrapper">{getEmotionImg(dummyEmotionMap[day])}</div>
              </div>
            );
          })}
        </div>

        {!isToday && (
          <button
            type="button"
            className="tracker_main_today"
            onClick={handleGoToday}
          >
            오늘→
          </button>
        )}
      </div>

      <div className="tracker_record_section">
        {/* 선택된 날짜 타이틀 */}
        <h4 className="record_section_title">
          {month + 1}월 {selectedDay}일 입덧 기록
        </h4>

        {/* 기록 카드 리스트 */}
        <div className="record_card_list">
          {mockRecords.map((item) => (
            <div
              key={item.id}
              className="tracker_record_card"
            >
              {/* 상단 뱃지 영역 */}
              <div className="tracker_card_header">
                <div className="trakcer_badge_group">
                  <span className="tracker_time_badge">{item.timeCategory}</span>
                  <div className="emotion_badge">
                    {getEmotionImg(item.emotion)}
                  </div>
                </div>
                <img src={cardArrow} className="tracker_card_arrow" onClick={() => handleCardClick(item.id)} />
              </div>

              {/* 본문 제목 */}
              <p className="tracker_card_title">{item.title}</p>

              {/* 하단 요약 정보 */}
              <p className="tracker_card_info">
                유발유형: {item.triggerType}/ 증상: {item.symptom}/ 강도: {item.intensity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tracker_main
