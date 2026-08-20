# 덧로그 (deotlog)

임신 중 입덧을 기록하고, AI가 기록을 분석해 유발 요인·완화 요인·경향을 알려주는 서비스입니다.

## 배포 주소

- **프론트엔드**: https://central-hackathon.vercel.app
- **백엔드 API**: https://1-201-116-69.sslip.io/api

## 기술 스택

**프론트엔드**
- React 19 + Vite
- React Router
- Sass
- Axios

**백엔드**
- Spring Boot 3 (Java 17)
- Spring Security + JWT
- MySQL / JPA(Hibernate)
- OpenAI API (기록 분석, 음성 인식 결과 구조화)

## 저장소 구조

이 저장소는 브랜치별로 프론트엔드/백엔드를 나눠서 관리합니다.

| 브랜치 | 내용 |
|---|---|
| `main` | 프론트엔드 (이 브랜치) |
| `backend` | 백엔드 (Spring Boot) |

## 주요 기능

- **회원가입 / 로그인** — 이메일 기반, JWT 인증
- **입덧 기록** — 시간대·강도 선택 + 자유 텍스트(또는 음성) 입력 → AI가 유발요인/증상/완화요인 등을 자동 분석
- **트래커** — 날짜별 기록 캘린더, 이번 주 임신 정보(주차별 영양관리/주의사항/신체변화)
- **리포트** — 기간별(1주/2주/1달/직접 지정) 유발·완화 요인 TOP3, 시간대별 강도 추이, AI 인사이트
- **마이페이지** — 프로필 수정, 알림/권한 설정

## 로컬에서 실행하기

### 1. 설치
```bash
npm install
```

### 2. 환경변수
`.env.development`에 백엔드 주소가 이미 설정되어 있습니다.
```
VITE_API_BASE_URL=http://localhost:8080/api
```
로컬 백엔드 대신 배포된 백엔드를 보게 하려면 이 값을 `https://1-201-116-69.sslip.io/api`로 바꾸면 됩니다.

### 3. 실행
```bash
npm run dev
```

백엔드를 로컬에서 같이 띄우는 방법은 `backend` 브랜치의 README를 참고하세요.

## API 명세

Swagger: https://app.swaggerhub.com/apis/sswu/sswuTeam1/1.0.0
