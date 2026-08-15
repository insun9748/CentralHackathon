import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/MyPage/scss/mypage_edit.scss';

import defaultProfileImg from '../../assets/MyPage/img/mypage.svg';
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import camera from '../../assets/MyPage/img/camera.svg';

function MyPage_edit() {

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // 1. 초기 원본 데이터 (비교용)
    const initialData = {
        profileImage: defaultProfileImg,
        nickname: '다온',
        pregnancyWeek: '9주차',
        dueDate: '20270327',
    };

    // 2. 수정 중인 데이터 상태
    const [formData, setFormData] = useState(initialData);

    // 3. 사진 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
        }
    };

    // 4. 입력 필드 변경 핸들러
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // 5. 변경 사항이 있는지 확인 (하나라도 바뀌면 버튼이 민트색으로 활성화)
    const isChanged =
        formData.profileImage !== initialData.profileImage ||
        formData.nickname !== initialData.nickname ||
        formData.pregnancyWeek !== initialData.pregnancyWeek ||
        formData.dueDate !== initialData.dueDate;

    // 6. 저장 완료 핸들러
    const handleSave = () => {
        if (!isChanged) return;

        // [백엔드 API 연동 자리]: axios.put('/api/user/profile', formData)
    };

    return (
        <div className='mypage_edit_wrap'>
            <header className="mypage_edit_header">
                <img
                    src={arrowLeftIcon}
                    alt="뒤로가기"
                    className="mypage_edit_back_btn"
                    onClick={() => navigate(-1)}
                />
                <h2 className="mypage_edit_title">
                    정보 수정
                </h2>
            </header>

            <main className="mypage_edit_body">
                {/* 프로필 사진 수정 영역 */}
                <div className="profile_edit_section">
                    <div
                        className="profile_image_container"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img
                            src={formData.profileImage}
                            className="profile_img"
                        />
                        <img src={camera} alt="" className='profile_camera'/>
                        {/* 숨겨진 파일 업로드 input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                    <button
                        type="button"
                        className="photo_change_text"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        사진 변경
                    </button>
                </div>

                {/* 인풋 입력 폼 */}
                <div className="edit_form_group">
                    <div className="pf_form_item">
                        <label className="pf_form_label">닉네임</label>
                        <input
                            type="text"
                            className="pf_form_input"
                            value={formData.nickname}
                            onChange={(e) => handleInputChange('nickname', e.target.value)}
                            placeholder="닉네임을 입력해주세요"
                        />
                    </div>

                    <div className="pf_form_item">
                        <label className="pf_form_label">임신 주차</label>
                        <input
                            type="text"
                            className="pf_form_input"
                            value={formData.pregnancyWeek}
                            onChange={(e) => handleInputChange('pregnancyWeek', e.target.value)}
                            placeholder="예: 9주차"
                        />
                    </div>

                    <div className="pf_form_item">
                        <label className="pf_form_label">출산예정일</label>
                        <input
                            type="text"
                            className="pf_form_input"
                            value={formData.dueDate}
                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                            placeholder="YYYYMMDD"
                        />
                    </div>
                </div>

                {/* 하단 저장 버튼 */}
                <div className="edit_button_container">
                    <button
                        type="button"
                        className={`save_submit_btn ${isChanged ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={!isChanged}
                    >
                        저장하기
                    </button>
                </div>
            </main>
        </div>
    )
}

export default MyPage_edit
