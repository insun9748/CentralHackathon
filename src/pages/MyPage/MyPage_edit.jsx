import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/MyPage/scss/mypage_edit.scss';

import defaultProfileImg from '../../assets/MyPage/img/mypage.svg';
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import camera from '../../assets/MyPage/img/camera.svg';
import { getMe, updateMe } from '../../api/user.js';
import { resolveMediaUrl, getErrorMessage } from '../../api/client.js';

function MyPage_edit() {

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [initialData, setInitialData] = useState(null);
    const [formData, setFormData] = useState({
        profileImage: defaultProfileImg,
        nickname: '',
        pregnancyWeek: '',
        dueDate: '',
    });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        getMe()
            .then((data) => {
                if (cancelled) return;
                const loaded = {
                    profileImage: resolveMediaUrl(data.profileImage) || defaultProfileImg,
                    nickname: data.nickname,
                    pregnancyWeek: String(data.pregnancyWeek ?? ''),
                    dueDate: data.dueDate ?? '',
                };
                setInitialData(loaded);
                setFormData(loaded);
            })
            .catch((err) => {
                alert(getErrorMessage(err, '회원 정보를 불러오지 못했습니다.'));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
            setProfileImageFile(file);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isChanged =
        Boolean(profileImageFile) ||
        (initialData &&
            (formData.nickname !== initialData.nickname ||
                formData.pregnancyWeek !== initialData.pregnancyWeek ||
                formData.dueDate !== initialData.dueDate));

    const handleSave = async () => {
        if (!isChanged) return;

        const week = Number(formData.pregnancyWeek);
        if (formData.nickname.trim().length < 1) {
            alert('닉네임을 입력해 주세요.');
            return;
        }
        if (!week || week < 1 || week > 40) {
            alert('임신 주차는 1~40 사이로 입력해 주세요.');
            return;
        }
        if (!formData.dueDate) {
            alert('출산 예정일을 입력해 주세요.');
            return;
        }

        setSaving(true);
        try {
            await updateMe(
                { nickname: formData.nickname, pregnancyWeek: week, dueDate: formData.dueDate },
                profileImageFile
            );
            navigate('/mypage');
        } catch (err) {
            alert(getErrorMessage(err, '정보 수정에 실패했습니다.'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className='mypage_edit_wrap' />;
    }

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
                            type="number"
                            className="pf_form_input"
                            min={1}
                            max={40}
                            value={formData.pregnancyWeek}
                            onChange={(e) => handleInputChange('pregnancyWeek', e.target.value)}
                            placeholder="예: 9"
                        />
                    </div>

                    <div className="pf_form_item">
                        <label className="pf_form_label">출산예정일</label>
                        <input
                            type="date"
                            className="pf_form_input"
                            value={formData.dueDate}
                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        />
                    </div>
                </div>

                {/* 하단 저장 버튼 */}
                <div className="edit_button_container">
                    <button
                        type="button"
                        className={`save_submit_btn ${isChanged ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={!isChanged || saving}
                    >
                        {saving ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </main>
        </div>
    )
}

export default MyPage_edit
