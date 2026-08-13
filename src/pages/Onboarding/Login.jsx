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
            <h2>로그인</h2>
            <div className="main_box">
                <div className="box">
                    <p>아이디</p>
                    <input type="text" placeholder='아이디를 입력하세요' />
                </div>
                <div className="box">
                    <p>비밀번호</p>
                    <input type="password" placeholder='비밀번호를 입력하세요' />
                </div>
            </div>
            <div className="bot">
                <a href="">아이디/비밀번호를 잊어버렸어요</a>

            </div>
            <button className='login' onClick={handleLogin}>로그인</button>
        </div>
    )
}

export default Login
