import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/login.scss';
import { login } from '../../api/auth.js';
import { setTokens } from '../../api/tokenStorage.js';
import { getErrorMessage } from '../../api/client.js';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert('이메일과 비밀번호를 입력해 주세요.');
            return;
        }

        setSubmitting(true);
        try {
            const tokens = await login({ email, password });
            setTokens(tokens);
            navigate('/home');
        } catch (err) {
            alert(getErrorMessage(err, '로그인에 실패했습니다.'));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className='wrap'>
            <h2 className='login_title'>로그인</h2>
            <div className="login_main_box">
                <div className="login_box">
                    <p className='login_id'>이메일</p>
                    <input
                        type="email"
                        className='login_input'
                        placeholder='이메일을 입력하세요'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="login_box">
                    <p className='login_pw'>비밀번호</p>
                    <input
                        type="password"
                        className='login_input'
                        placeholder='비밀번호를 입력하세요'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>
            </div>
            <div className="login_bot">
                <a href="" className='login_fg'>아이디/비밀번호를 잊어버렸어요</a>

            </div>
            <button className='login_btn' onClick={handleLogin} disabled={submitting}>
                {submitting ? '로그인 중...' : '로그인'}
            </button>
        </div>
    )
}

export default Login
