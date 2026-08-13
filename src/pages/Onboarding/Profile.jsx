import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/profile.scss';
import camera from '../../assets/onboarding/img/camera.svg';

function Profile() {

  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/info');
  }
  return (
    <div className='wrap'>
      <h2 className='onboarding_title'>회원 정보 입력</h2>

      <div className="profile_main">
        <p className='title'>프로필 설정</p>
        <div className="circle">
          <img src={camera} alt="" />
        </div>
        <p className='detail'>프로필 사진은 추후 마이페이지에서 설정할 수 있어요</p>
      </div>

      <div className="profile_bot">
        <button className='btn1'>완료</button>
        <button className='btn2' onClick={handleSkip}>건너뛰기</button>
      </div>

    </div>
  )
}

export default Profile
