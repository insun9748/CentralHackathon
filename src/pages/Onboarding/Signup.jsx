import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/signup.scss';
import { signup, login } from '../../api/auth.js';
import { setTokens } from '../../api/tokenStorage.js';
import { getErrorMessage } from '../../api/client.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validatePassword = (value) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const isLongEnough = value.length >= 8;
    return hasSpecialChar.test(value) && isLongEnough;
  };

  const isEmailValid = email && EMAIL_PATTERN.test(email);
  const isPasswordMatch = password && passwordConfirm && password === passwordConfirm;
  const isPasswordMismatch = password && passwordConfirm && password !== passwordConfirm;

  const handleSignup = async () => {
    if (!isEmailValid) {
      alert('올바른 이메일 형식을 입력해 주세요.');
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

    setSubmitting(true);
    try {
      await signup({ email, password, confirmPassword: passwordConfirm });
      // 가입 직후 바로 로그인해서 온보딩(프로필 입력) 단계로 진행한다
      const tokens = await login({ email, password });
      setTokens(tokens);
      navigate('/login', {state: {from: 'signup' } });
    } catch (err) {
      alert(getErrorMessage(err, '회원가입에 실패했습니다.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='wrap'>
      <h2 className='onboarding_title'>회원가입</h2>
      <div className="signup_box">

        {/* 이메일 영역 */}
        <div className="signup_input_box">
          <p className='signup_p'>이메일</p>
          <div className="signup_id_input_box">
            <input
              type="email"
              className='signup_input'
              placeholder='이메일을 입력하세요'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* 비밀번호 영역 */}
        <div className="signup_input_box">
          <p className='signup_p'>비밀번호</p>
          <input
            type="password"
            className='signup_input'
            placeholder='특수문자 포함 8자 이상'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 비밀번호 확인 영역 */}
        <div className="signup_input_box">
          <p className='signup_p'>비밀번호 확인</p>
          <div className="signup_pw_input_box">
            <input
              type="password"
              className='signup_input'
              placeholder='특수문자 포함 8자 이상'
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            {isPasswordMatch && (
              <span className="signup_status_text">일치</span>
            )}
            {isPasswordMismatch && (
              <span className="signup_status_text error">비밀번호가 일치하지 않습니다. </span>
            )}
          </div>
        </div>

      </div>

      <button className='signup_btn' onClick={handleSignup} disabled={submitting}>
        {submitting ? '가입 중...' : '가입하기'}
      </button>
    </div>
  );
}

export default Signup;
