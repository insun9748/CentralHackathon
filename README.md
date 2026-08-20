# 덧로그 (deotlog) - Backend

임신 중 입덧 기록 및 AI 분석 서비스의 백엔드입니다.

프론트엔드는 이 저장소의 `main` 브랜치에 있습니다.

## 배포 주소

- **API**: https://1-201-116-69.sslip.io/api
- **DB**: MySQL (서버 내 로컬 설치)

## 기술 스택

- Spring Boot 3 (Java 17), Gradle
- Spring Security + JWT
- Spring Data JPA / Hibernate + MySQL
- OpenAI API (`gpt-5-mini`) — 기록 분석, 리포트 AI 인사이트, 음성 기록 구조화

## API 명세

Swagger: https://app.swaggerhub.com/apis/sswu/sswuTeam1/1.0.0

## 로컬에서 실행하기

### 1. 준비물
- JDK 17
- MySQL 8.x

### 2. DB 만들기
```sql
CREATE DATABASE deotlog CHARACTER SET utf8mb4;
```

### 3. 비밀값 설정
`local.properties.example`을 복사해서 `local.properties`로 저장하고 값을 채워주세요.
이 파일은 `.gitignore`에 등록되어 있어서 커밋되지 않습니다. IntelliJ/VS Code/`./gradlew bootRun` 등 어떤 방식으로 실행하든, `backend/` 안에서 실행하면 자동으로 읽힙니다.

```
DB_URL=jdbc:mysql://localhost:3306/deotlog?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=root
DB_PASSWORD=본인 MySQL 비밀번호
JWT_SECRET=팀 공용 값
OPENAI_API_KEY=팀 공용 키
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 4. 카테고리 시드 데이터 (최초 1회)
`GET /categories`가 비어 있으면 기록 작성 자체가 막히므로, 서버를 한 번 띄운 뒤(테이블 자동 생성) 아래 SQL을 실행해 주세요.
```sql
USE deotlog;
INSERT INTO time_category (name) VALUES ('새벽'), ('오전'), ('오후'), ('저녁');
INSERT INTO nausea_intensity (level, description) VALUES
(0,'없음'),(1,'약함'),(2,'보통'),(3,'약간심함'),(4,'심함'),(5,'매우심함');
```

### 5. 실행
```bash
./gradlew bootRun
```
`Started DeotlogApplication` 로그가 뜨면 성공. 주소는 `http://localhost:8080/api`.

### 6. 확인
```bash
curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!","confirmPassword":"Test1234!"}'
```

## 배포

`Dockerfile`이 포함되어 있어 Docker 지원 환경(Railway, 직접 세팅한 서버 등) 어디에도 그대로 올릴 수 있습니다. `PORT` 환경변수를 지정하면 그 포트로 뜹니다(기본 8080).

## 알려진 미구현 사항

- `DELETE /users/me` (회원탈퇴) — 명세에는 있지만 아직 구현되지 않았습니다.
