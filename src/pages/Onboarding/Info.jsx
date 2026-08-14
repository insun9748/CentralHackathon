import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/info.scss';

function Info1() {

    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/'); //홈화면으로 연결 필요
    }
    return (
        <div className='wrap'>
            <h2 className='onboarding_title'>회원 정보 입력</h2>

            <div className="info_box">

                <div className="info_input_box">
                    <p className='info_p'>닉네임</p>
                    <input type="text" className='info_input' placeholder='2글자 이상' />
                </div>

                <div className="info_input_box">
                    <p className='info_p'>임신 주차</p>
                    <input type="text" className='info_input' placeholder='n주차' />
                </div>

                <div className="info_input_box">
                    <p className='info_p'>출산 예정일</p>
                    <input type="text" className='info_input' placeholder='ex 20270707' />
                </div>

            </div>

            <p className='info_detail'>회원정보는 마이페이지에서 수정할 수 있어요</p>
            <button className='info_btn' onClick={handleStart}>시작하기</button>
        </div>
    )
}

export default Info1
