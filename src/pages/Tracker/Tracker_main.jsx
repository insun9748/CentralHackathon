import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrackerRecordCard from '../../components/TrackerRecordCard/TrackerRecordCard.jsx';
import { formatDateKey, emotionFromIntensityLevel, useRecords } from '../../context/records-context.js';
import { getTracker, getCalendar } from '../../api/tracker.js';
import { getMe } from '../../api/user.js';
import { getErrorMessage } from '../../api/client.js';
import '../../assets/tracker/scss/tracker_main.scss';

//이미지
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import arrowRightIcon from '../../assets/tracker/img/tracker_right.svg';
import goodIcon from '../../assets/tracker/img/tracker_good.svg';
import sosoIcon from '../../assets/tracker/img/tracker_soso.svg';
import badIcon from '../../assets/tracker/img/tracker_bad.svg';

function Tracker_main() {
  // 실제 오늘 날짜 (기준값)
  const realToday = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(realToday.getFullYear(), realToday.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState(realToday.getDate());

  const [pregnancyInfo, setPregnancyInfo] = useState({ weeks: null, days: null });
  const [emotionMap, setEmotionMap] = useState({});

  useEffect(() => {
    getTracker()
      .then((data) => {
        setPregnancyInfo((prev) => ({ ...prev, weeks: data.currentWeek }));
      })
      .catch((err) => console.error(getErrorMessage(err)));

    // 출산예정일 기준으로 "N주 D일차"의 D(일차)를 클라이언트에서 계산
    getMe()
      .then((data) => {
        if (!data.dueDate) return;
        const due = new Date(data.dueDate);
        const diffDays = Math.round((due.getTime() - realToday.getTime()) / (1000 * 60 * 60 * 24));
        const totalDaysPregnant = 280 - diffDays;
        const days = ((totalDaysPregnant % 7) + 7) % 7;
        setPregnancyInfo((prev) => ({ ...prev, days }));
      })
      .catch((err) => console.error(getErrorMessage(err)));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 ~ 11

  useEffect(() => {
    getCalendar(year, month + 1)
      .then((data) => {
        const map = {};
        data.days.forEach((day) => {
          if (!day.hasRecord) return;
          const dayOfMonth = Number(day.date.slice(8, 10));
          map[dayOfMonth] = emotionFromIntensityLevel(day.averageIntensity);
        });
        setEmotionMap(map);
      })
      .catch((err) => console.error(getErrorMessage(err)));
  }, [year, month]);

  // 2. 월 이동 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 3. 달력 날짜 계산 로직
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
  const isToday =
    currentDate.getFullYear() === realToday.getFullYear() &&
    currentDate.getMonth() === realToday.getMonth() &&
    selectedDay === realToday.getDate();

  const handleGoToday = () => {
    setCurrentDate(new Date(realToday.getFullYear(), realToday.getMonth(), 1));
    setSelectedDay(realToday.getDate());
  };

  // 홈에서 저장한 기록과 같은 저장소(RecordsContext)를 공유 — 선택한 날짜에 해당하는 것만 필터링
  const { todayRecords } = useRecords();
  const selectedDateKey = formatDateKey(year, month, selectedDay);
  const recordsForSelectedDay = todayRecords.filter((record) => record.date === selectedDateKey);

  const navigate = useNavigate();

  const handleThisWeek = () => {
    navigate(`/tracker/week`);
  };

  return (
    <div className="tracker_wrap">
      <h2 className="tracker_main_title">트래커</h2>

      {/* 상단 임신 주차 정보 */}
      <div className="tracker_main_header">
        <h3 className="tracker_main_week">
          {pregnancyInfo.weeks != null
            ? `임신 ${pregnancyInfo.weeks}주 ${pregnancyInfo.days ?? 0}일차에요`
            : '임신 정보를 불러오는 중...'}
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
                <div className="emotion_wrapper">{getEmotionImg(emotionMap[day])}</div>
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
        {recordsForSelectedDay.length === 0 ? (
          <p className="record_empty_text">이 날짜에는 기록이 없어요</p>
        ) : (
          <div className="record_card_list">
            {recordsForSelectedDay.map((item) => (
              <TrackerRecordCard key={item.id} record={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tracker_main
