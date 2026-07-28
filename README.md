# 주유소 관리시스템 (JTGS)

첨부 HTML 프로토타입과 동일한 UI·목업 동작을 Vite + React로 이식한 프론트엔드입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버: `http://localhost:5173/next-jtgs/`

## 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages

`vite.config.ts`의 `base: '/next-jtgs/'` 기준입니다.

1. Settings → Pages → Source: **GitHub Actions**
2. `main` 브랜치 push 시 [`.github/workflows/pages.yml`](.github/workflows/pages.yml)이 `dist`를 배포합니다.

배포 URL: https://kk00701903-hub.github.io/next-jtgs/

## 화면

- 대시보드
- 기준정보 (코드 / 거래처 / 담당자) — 코드 CRUD
- IF 연계 4종
- 유류 실적 (배양 / 김해 / 논산)
- 매출·정산 / 재고 / 마감
- 기술 스택 · 요구사항 정의 (CRUD) / 소스 반영 점검

백엔드 API 없이 클라이언트 목업 데이터만 사용합니다.
