# Mobile Wedding Invitation

Next.js, TypeScript, Tailwind CSS로 만든 모바일 청첩장 단일 페이지입니다.

## 실행

```bash
npm install
npm run dev
```

로컬 실행 주소는 기본값으로 `http://localhost:3000`입니다.

## 2차 기능 패키지

방명록, 관리자, DB 연동을 위해 아래 패키지가 추가되었습니다.

```bash
npm install @prisma/client bcryptjs zod
npm install -D prisma tsx dotenv
```

## 환경 변수

`.env.example`을 참고해 `.env`를 만들고 값을 채워 주세요.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-this-password"
AUTH_SECRET="change-this-random-secret"
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
```

`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`는 운영 배포 전에 반드시 변경하세요.

## Prisma

PostgreSQL 기준으로 설정되어 있습니다.

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:deploy
npm run prisma:seed
```

로컬 개발에서는 `npm run prisma:migrate -- --name init`, 운영 DB에서는 `npm run prisma:deploy`를 사용합니다. `prisma/seed.ts`는 `src/data/wedding.ts`의 청첩장 기본 정보로 `Wedding` row를 만들고, `.env`의 관리자 계정을 생성합니다.

## 관리자

관리자 로그인 페이지는 `/admin/login`, 관리 페이지는 `/admin`입니다.

seed 후 기본 개발 계정은 `.env`를 따릅니다. 값이 없으면 개발용 기본값 `admin / admin1234`가 사용됩니다. 운영에서는 절대 기본값을 그대로 쓰지 마세요.

## 정보 수정

청첩장 내용은 [src/data/wedding.ts](src/data/wedding.ts)에서 한 번에 수정합니다.

- 신랑/신부 이름
- 결혼 날짜와 시간
- 예식장 이름과 주소
- 연락처
- 지도 링크
- 갤러리 이미지 경로
- 계좌 정보와 선택형 `kakaoPayUrl`

DB/API 설정은 아래 파일에서 관리합니다.

- Prisma schema: `prisma/schema.prisma`
- Prisma config: `prisma.config.ts`
- DB client: `src/lib/prisma.ts`
- 인증 쿠키: `src/lib/auth.ts`
- 입력 검증: `src/lib/validation.ts`
- CSV export: `src/lib/export.ts`

자세한 Vercel 배포 절차는 [DEPLOY.md](DEPLOY.md)를 확인하세요.

## 이미지

이미지는 `public/images` 폴더에 넣고 아래 경로로 교체합니다.

- 대표 이미지: `public/images/hero.svg`
- 갤러리: `public/images/gallery/photo1.svg`부터 `photo10.svg`

이미지가 없어도 페이지에는 placeholder가 표시됩니다.

## 배포 메타데이터

배포 도메인이 정해지면 환경변수로 사이트 URL을 지정하세요.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```
