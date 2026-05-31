# Vercel Deployment Guide

이 문서는 모바일 청첩장 프로젝트를 Vercel에 배포하기 위한 체크리스트입니다. 프로젝트는 Next.js 하나 안에서 프론트엔드, Route Handler API, 관리자 페이지, Prisma DB 연동을 모두 처리합니다.

## 1. 프로젝트 개요

- 모바일 청첩장 UI
- 방명록/축하 메시지 등록, 조회, 사용자 삭제
- 관리자 로그인
- 관리자 방명록 숨김, 숨김 해제, 삭제
- 신랑측/신부측 분류
- CSV 다운로드
- Prisma + 외부 PostgreSQL DB

참석 여부 RSVP, 참석/불참, 식사 여부, 동행 인원 기능은 없습니다.

## 2. 로컬 실행

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

로컬 주소:

- 청첩장: `http://localhost:3000`
- 관리자 로그인: `http://localhost:3000/admin/login`
- 관리자 페이지: `http://localhost:3000/admin`

## 3. 환경변수

`.env.example`을 참고해 로컬에서는 `.env.local` 또는 `.env`를 만들고, Vercel에서는 Project Settings → Environment Variables에 등록합니다.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-password"
AUTH_SECRET="change-this-random-secret"
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
# Optional. Vercel sets this automatically for production deployments.
NODE_ENV="production"
```

환경변수 설명:

- `DATABASE_URL`: Supabase, Neon, Railway 등 외부 PostgreSQL 연결 문자열
- `ADMIN_USERNAME`: seed에서 생성할 관리자 아이디
- `ADMIN_PASSWORD`: seed에서 생성할 관리자 비밀번호
- `AUTH_SECRET`: 관리자 httpOnly 쿠키 토큰 서명용 비밀값
- `NEXT_PUBLIC_SITE_URL`: 배포된 청첩장 주소, 공유 링크와 metadata에 사용
- `NODE_ENV`: Vercel에서는 자동 설정되므로 보통 직접 등록하지 않아도 됩니다.

실제 DB 주소, 비밀번호, 토큰은 코드에 저장하지 말고 Vercel Environment Variables에 등록하세요.

## 4. DB 준비

Supabase 또는 Neon 기준:

1. PostgreSQL 프로젝트를 생성합니다.
2. 연결 문자열을 복사합니다.
3. Vercel과 로컬 `.env.local`에 `DATABASE_URL`로 등록합니다.
4. Vercel 서버리스 환경에서는 SQLite 운영 배포를 피하세요. PostgreSQL 또는 MySQL 계열 외부 DB를 권장합니다.

## 5. Prisma 명령어

로컬 개발:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

운영 DB:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

이 프로젝트에는 아래 npm script도 있습니다.

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:deploy
npm run prisma:seed
```

`prisma/seed.ts`는 `src/data/wedding.ts`의 청첩장 기본 정보로 기본 Wedding row를 upsert하고, `ADMIN_USERNAME`, `ADMIN_PASSWORD`로 관리자 계정을 upsert합니다.

## 6. Vercel 배포 순서

1. GitHub에 프로젝트를 업로드합니다.
2. Supabase 또는 Neon에서 PostgreSQL DB를 생성합니다.
3. `DATABASE_URL`을 복사합니다.
4. Vercel에서 GitHub repository를 Import합니다.
5. Vercel Project Settings → Environment Variables에 값을 등록합니다.
6. Deploy를 실행합니다.
7. 운영 DB에 migration을 적용합니다.
8. seed를 실행합니다.
9. `/admin/login`에서 관리자 로그인을 확인합니다.

Vercel에서 등록할 환경변수:

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## 7. Vercel 빌드 설정

`package.json`에는 Prisma Client 생성을 위한 postinstall이 포함되어 있습니다.

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "next build"
  }
}
```

Vercel 기본 Build Command는 `npm run build`를 사용하면 됩니다.

운영 migration을 CI에서 함께 실행하려면 Vercel Build Command를 별도로 `npm run prisma:deploy && npm run build`처럼 설정할 수 있습니다. 단, 운영 DB migration은 배포 전후 한 번 명시적으로 실행하는 방식을 더 권장합니다.

## 8. 관리자 인증 점검

- 로그인 API: `POST /api/admin/login`
- 로그아웃 API: `POST /api/admin/logout`
- 로그인 상태 API: `GET /api/admin/me`
- 관리자 페이지: `/admin`
- 로그인 페이지: `/admin/login`

인증 쿠키는 `httpOnly`, `sameSite: "lax"`, `path: "/"`로 설정됩니다. `NODE_ENV=production`에서는 `secure` 쿠키가 적용됩니다.

## 9. API 점검

사용자 API:

- `GET /api/guestbook`
- `POST /api/guestbook`
- `DELETE /api/guestbook/[id]`

관리자 API:

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `GET /api/admin/guestbook`
- `PATCH /api/admin/guestbook/[id]`
- `DELETE /api/admin/guestbook/[id]`
- `GET /api/admin/guestbook/export`

CSV 다운로드는 UTF-8 BOM을 포함해 한글 깨짐을 줄이고, 파일명은 `wedding_guestbook_YYYYMMDD.csv` 형식입니다.

## 10. 배포 후 확인 URL

- `/`
- `/admin/login`
- `/admin`
- `/api/guestbook`

확인할 동작:

- 모바일 청첩장 표시
- 방명록 등록
- 방명록 목록 조회
- 방명록 비밀번호 삭제
- 관리자 로그인
- 관리자 방명록 목록 조회
- 숨김/숨김 해제
- 관리자 삭제
- CSV 다운로드
- 새로고침 후 404/500 없음

## 11. 운영 배포 체크리스트

- `npm run lint` 성공
- `npm run typecheck` 성공
- `npm run build` 성공
- `DATABASE_URL` 등록
- `AUTH_SECRET` 등록
- `ADMIN_USERNAME` 등록
- `ADMIN_PASSWORD` 등록
- `NEXT_PUBLIC_SITE_URL` 등록
- Prisma migration 완료
- Prisma seed 완료
- 관리자 로그인 확인
- 방명록 등록 확인
- 관리자 숨김/삭제 확인
- CSV 다운로드 확인

## 12. GitHub 업로드 전 확인

- `.env`, `.env.local`은 업로드하지 않습니다.
- `DATABASE_URL`은 절대 공개하지 않습니다.
- `AUTH_SECRET`, `ADMIN_PASSWORD`는 코드에 저장하지 않습니다.
- `node_modules`, `.next`는 업로드하지 않습니다.
- 운영 DB에 seed를 다시 실행하면 관리자 비밀번호가 `.env` 값으로 갱신됩니다.

## 13. 자주 발생하는 오류

### Prisma Client 오류

```bash
npm run prisma:generate
```

Vercel 배포에서는 `postinstall`이 자동으로 `prisma generate`를 실행합니다.

### DB 연결 오류

`DATABASE_URL`이 Vercel Production 환경에 등록되어 있는지 확인하세요. 환경변수 변경은 기존 배포에 소급 적용되지 않으므로 재배포가 필요합니다.

### 관리자 로그인이 계속 풀리는 경우

`AUTH_SECRET`이 등록되어 있고, 재배포 후 같은 값으로 유지되는지 확인하세요. 값이 바뀌면 기존 로그인 쿠키는 무효화됩니다.

### migration 누락

운영 DB에는 아래 명령을 실행합니다.

```bash
npm run prisma:deploy
```

### seed 누락

관리자 계정이 없으면 아래 명령을 실행합니다.

```bash
npm run prisma:seed
```

## 14. 참고 문서

- Prisma Vercel 배포: https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel
- Prisma migrate deploy: https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
