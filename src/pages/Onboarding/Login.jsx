import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/login.scss';

function Login() {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/profile');
    }
    return (
        <div className='wrap'>
            <h2 className='login_title'>로그인</h2>
            <div className="login_main_box">
                <div className="login_box">
                    <p className='login_id'>아이디</p>
                    <input type="text" className='login_input' placeholder='아이디를 입력하세요' />
                </div>
                <div className="login_box">
                    <p className='login_pw'>비밀번호</p>
                    <input type="password" className='login_input' placeholder='비밀번호를 입력하세요' />
                </div>
            </div>
            <div className="login_bot">
                <a href="" className='login_fg'>아이디/비밀번호를 잊어버렸어요</a>

            </div>
            <button className='login_btn' onClick={handleLogin}>로그인</button>
        </div>
    )
}

export default Login
