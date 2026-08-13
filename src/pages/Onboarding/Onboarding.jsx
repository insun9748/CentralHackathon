import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/onboarding.scss';
import img from '../../assets/onboarding/img/onboarding.svg';
import dot from '../../assets/onboarding/img/dot.svg';

function Onboarding() {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }

    const handleSignup = () => {
        navigate('/signup')
    }
    return (
        <div className='wrap'>
            <div className="top">
                
                <h2>나만의 <span className='dots'> <img src={dot} className='dot' />입덧 패턴</span>을 <br /> 발견해주는 가장 쉬운 <span className='highlight'>기록<img src={img} alt="" className='pencil' /></span></h2>
                
            </div>
            <h1>덧로그</h1>
            <div className="button">
                <button className='ob_login' onClick={handleLogin}>로그인</button>
                <button className='ob_signup' onClick={handleSignup}>회원가입</button>
            </div>
        </div>
    )
}

export default Onboarding

