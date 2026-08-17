import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/info.scss';
import { updateMe } from '../../api/user.js';
import { getErrorMessage } from '../../api/client.js';

function Info1() {

    const navigate = useNavigate();
    const location = useLocation();
    const profileImageFile = location.state?.profileImageFile ?? null;

    const [nickname, setNickname] = useState('');
    const [pregnancyWeek, setPregnancyWeek] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleStart = async () => {
        if (nickname.trim().length < 2) {
            alert('닉네임은 2글자 이상 입력해 주세요.');
            return;
        }

        const week = Number(pregnancyWeek);
        if (!week || week < 1 || week > 40) {
            alert('임신 주차는 1~40 사이로 입력해 주세요.');
            return;
        }

        if (!dueDate) {
            alert('출산 예정일을 입력해 주세요.');
            return;
        }

        setSubmitting(true);
        try {
            await updateMe({ nickname, pregnancyWeek: week, dueDate }, profileImageFile);
            navigate('/home');
        } catch (err) {
            alert(getErrorMessage(err, '회원 정보 저장에 실패했습니다.'));
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div className='wrap'>
            <h2 className='onboarding_title'>회원 정보 입력</h2>

            <div className="info_box">

                <div className="info_input_box">
                    <p className='info_p'>닉네임</p>
                    <input
                        type="text"
                        className='info_input'
                        placeholder='2글자 이상'
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>

                <div className="info_input_box">
                    <p className='info_p'>임신 주차</p>
                    <input
                        type="number"
                        className='info_input'
                        placeholder='n주차'
                        min={1}
                        max={40}
                        value={pregnancyWeek}
                        onChange={(e) => setPregnancyWeek(e.target.value)}
                    />
                </div>

                <div className="info_input_box">
                    <p className='info_p'>출산 예정일</p>
                    <input
                        type="date"
                        className='info_input'
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>

            </div>

            <p className='info_detail'>회원정보는 마이페이지에서 수정할 수 있어요</p>
            <button className='info_btn' onClick={handleStart} disabled={submitting}>
                {submitting ? '저장 중...' : '시작하기'}
            </button>
        </div>
    )
}

export default Info1
