import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/signup.scss';

function Signup() {
  const navigate = useNavigate();

  // 1. State 정리 (중복 선언 제거)
  const [userId, setUserId] = useState('');
  const [idStatus, setIdStatus] = useState('initial'); // 'initial' | 'available' | 'duplicate'

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 2. 비밀번호 특수문자 및 길이 조건 검사 함수
  const validatePassword = (password) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const isLongEnough = password.length >= 8;
    return hasSpecialChar.test(password) && isLongEnough;
  };

  // 3. 아이디 중복 확인 핸들러
  const handleCheckId = () => {
    if (!userId) {
      alert('아이디를 입력해 주세요.');
      return;
    }

    // 테스트용 임시 로직 ('mommy_fail' 입력 시 불가 처리)
    if (userId === 'mommy_fail') {
      setIdStatus('duplicate');
    } else {
      setIdStatus('available');
    }
  };

  // 아이디가 변경될 때마다 중복확인 상태 초기화
  const handleIdChange = (e) => {
    setUserId(e.target.value);
    setIdStatus('initial');
  };

  // 비밀번호 일치 여부 확인
  const isPasswordMatch = password && passwordConfirm && (password === passwordConfirm);

  // 4. 가입하기 버튼 클릭 핸들러
  const handleSignup = () => {
    if (idStatus !== 'available') {
      alert('아이디 중복확인을 진행해 주세요.');
      return;
    }

    if (!validatePassword(password)) {
      alert('비밀번호는 특수문자를 포함하여 8자 이상이어야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    navigate('/');
  };

  return (
    <div className='wrap'>
      <h2 className='onboarding_title'>회원가입</h2>
      <div className="box">

        {/* 아이디 영역 */}
        <div className="input_box">
          <p>아이디</p>
          <div className="id_input_box">
            <input 
              type="text" 
              placeholder='아이디를 입력하세요' 
              value={userId}
              onChange={handleIdChange}
            />
            {idStatus === 'initial' && (
              <button type="button" className="action_btn" onClick={handleCheckId}>
                중복확인
              </button>
            )}
            {idStatus === 'available' && (
              <span className="status_text">확인</span>
            )}
            {idStatus === 'duplicate' && (
              <span className="status_text error" onClick={handleCheckId}>불가</span>
            )}
          </div>
        </div>

        {/* 비밀번호 영역 */}
        <div className="input_box">
          <p>비밀번호</p>
          <input 
            type="password" 
            placeholder='특수문자 포함 8자 이상'
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        {/* 비밀번호 확인 영역 */}
        <div className="input_box">
          <p>비밀번호 확인</p>
          <div className="pw_input_box">
            <input 
              type="password" 
              placeholder='특수문자 포함 8자 이상'
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)} 
            />
            {isPasswordMatch && (
              <span className="status_text">일치</span>
            )}
          </div>
        </div>

      </div>

      <button className='signup2' onClick={handleSignup}>가입하기</button>
    </div>
  );
}

export default Signup;