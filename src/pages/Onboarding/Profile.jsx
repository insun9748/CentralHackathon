// import React from 'react'
// import { useNavigate } from 'react-router-dom';
// import '../../assets/onboarding/scss/profile.scss';
// import camera from '../../assets/onboarding/img/camera.svg';

// function Profile() {

//   const navigate = useNavigate();

//   const handleSkip = () => {
//     navigate('/info');
//   }
//   return (
//     <div className='wrap'>
//       <h2 className='onboarding_title'>회원 정보 입력</h2>

//       <div className="profile_main">
//         <p className='profile_title'>프로필 설정</p>
//         <div className="profile_circle">
//           <img src={camera} alt="" className='profile_camera' />
//         </div>
//         <p className='profile_detail'>프로필 사진은 추후 마이페이지에서 설정할 수 있어요</p>
//       </div>

//       <div className="profile_bot">
//         <button className='profile_btn1'>완료</button>
//         <button className='profile_btn2' onClick={handleSkip}>건너뛰기</button>
//       </div>

//     </div>
//   )
// }

// export default Profile

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/onboarding/scss/profile.scss';
import camera from '../../assets/onboarding/img/camera.svg';

function Profile() {
  const navigate = useNavigate();

  // 1. 파일 input 참조용 ref와 프로필 이미지 상태
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // 2. profile_circle 클릭 시 숨겨진 file input 트리거
  const handleCircleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 3. 파일 선택 시 이미지 미리보기 URL 생성 (실제 파일은 다음 단계(Info)에서
  // 닉네임/주차/출산예정일과 함께 한 번에 업로드된다)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      setProfileImageFile(file);
    }
  };

  const handleSkip = () => {
    navigate('/info');
  };

  const handleComplete = () => {
    navigate('/info', { state: { profileImageFile } });
  };

  return (
    <div className="wrap">
      <h2 className="onboarding_title">회원 정보 입력</h2>

      <div className="profile_main">
        <p className="profile_title">프로필 설정</p>

        {/* 원형 영역 클릭 시 파일 업로드 */}
        <div className="profile_circle" onClick={handleCircleClick}>
          {profileImage ? (
            <img src={profileImage} alt="프로필 미리보기" className="profile_preview_img" />
          ) : (
            <img src={camera} alt="카메라 아이콘" className="profile_camera" />
          )}

          {/* 숨겨진 파일 인풋 */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <p className="profile_detail">프로필 사진은 추후 마이페이지에서 설정할 수 있어요</p>
      </div>

      <div className="profile_bot">
        <button className="profile_btn1" onClick={handleComplete}>
          완료
        </button>
        <button className="profile_btn2" onClick={handleSkip}>
          건너뛰기
        </button>
      </div>
    </div>
  );
}

export default Profile;