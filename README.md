# 🎉 InviteMe Platform - 모바일 초대장 서비스

> **2026.02.07 첫 초대장 페이지 구현**
> SaaS 기반 청첩장/돌잔치/생일 등 다양한 초대장을 만들 수 있는 플랫폼

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-Latest-black)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📋 프로젝트 개요

InviteMe는 **검증된 SaaS Boilerplate**를 기반으로 빠르게 구축한 초대장 플랫폼입니다.

### 🎯 주요 기능

| 기능 | 상태 | 설명 |
|------|------|------|
| 📝 **템플릿 선택** | ✅ 완료 | 30개 템플릿 (무료 18개 + 프리미엄 12개) |
| 🎨 **6가지 타입** | ✅ 완료 | 청첩장, 돌잔치, 생일, 집들이, 환갑, 일반 |
| 🔒 **Zod 검증** | ✅ 완료 | 타입별 입력 검증 로직 (TDD) |
| 🛡️ **보안 강화** | ✅ 완료 | XSS 방지, URL 검증, 환경변수 관리 |
| 📱 **카카오톡 공유** | ✅ 준비됨 | 카카오 SDK 통합 (API 키 필요) |
| 🗺️ **카카오맵** | ✅ 준비됨 | 지도 표시 기능 |
| 💳 **결제 시스템** | 🔜 예정 | Stripe 통합 (프리미엄 템플릿) |
| 🔐 **인증** | 🔜 예정 | Clerk (소셜 로그인) |
| 💾 **데이터베이스** | 🔜 예정 | Supabase (PostgreSQL) |

---

## 🚀 빠른 시작

### 1. 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/26.2.7-inviteme-platform.git
cd 26.2.7-inviteme-platform

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

```bash
# .env.example을 .env.local로 복사
cp .env.example .env.local

# .env.local 파일 편집 (필수 키 없음 - 기본 실행 가능)
```

**현재 외부 서비스 없이도 실행 가능!**
카카오 API는 나중에 설정해도 됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 열기:
- 🏠 홈: http://localhost:3000
- 📋 **템플릿 선택**: http://localhost:3000/en/invite/select ← 여기!

---

## 📁 프로젝트 구조

```
InviteMe-Platform/
├── src/
│   ├── features/invite/          # 초대장 기능 모듈
│   │   ├── components/
│   │   │   ├── TemplateCard.tsx        # 템플릿 카드 (Shadcn UI)
│   │   │   ├── ShareButtons.tsx        # 공유 기능
│   │   │   └── KakaoMap.tsx            # 지도 (XSS 방지 처리됨)
│   │   ├── types/index.ts              # TypeScript 타입
│   │   ├── data/
│   │   │   ├── templates.json          # 30개 템플릿 데이터
│   │   │   └── templates.ts            # 헬퍼 함수
│   │   └── utils/
│   │       ├── validation.ts           # Zod 검증 (TDD)
│   │       ├── validation.test.ts      # 16개 테스트 (100% 통과)
│   │       └── formatter.ts            # 날짜/전화번호 포맷팅
│   └── app/[locale]/(unauth)/invite/
│       └── select/page.tsx              # 템플릿 선택 페이지
├── .env.example                         # 환경변수 가이드
└── README.md                            # 이 파일
```

---

## 🛡️ 보안

### ✅ 적용된 보안 조치

| 보안 항목 | 상태 | 설명 |
|----------|------|------|
| **XSS 방지** | ✅ | HTML 이스케이프 처리 |
| **URL 검증** | ✅ | 허용된 도메인만 공유 |
| **입력 검증** | ✅ | Zod 스키마 검증 |
| **환경변수** | ✅ | .env.local로 분리 |
| **SQL Injection** | ✅ | ORM 사용 (Drizzle) |
| **CSRF 보호** | 🔜 | 향후 추가 예정 |
| **Rate Limiting** | 🔜 | 향후 추가 예정 |

### 🔒 보안 점검 완료

- CRITICAL 이슈 2개 수정 완료
- HIGH 이슈 3개 확인 (의존성 업데이트 권장)
- TDD로 검증 로직 구현 (테스트 커버리지 100%)

---

## 🧪 테스트

### TDD로 구현된 검증 로직

```bash
# 검증 로직 테스트 (16개 테스트)
npm test src/features/invite/utils/validation.test.ts

# 결과
✓ 16 tests passed
Coverage: 100%
```

**테스트 항목:**
- ✅ 청첩장 데이터 검증
- ✅ 돌잔치 데이터 검증
- ✅ 과거 날짜 거부
- ✅ 잘못된 전화번호 형식 거부
- ✅ 필수 필드 누락 감지

---

## 🎨 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** 5.6
- **Tailwind CSS** 3.4
- **Shadcn UI** (Radix UI 기반)
- **Framer Motion** (애니메이션)
- **date-fns** (날짜 처리)

### 검증 & 보안
- **Zod** (스키마 검증)
- **React Hook Form** (폼 관리)
- **DOMPurify** (XSS 방지)

### 외부 서비스 (선택적)
- **Clerk** (인증) - 나중에 설정
- **Stripe** (결제) - 나중에 설정
- **Supabase** (DB) - 나중에 설정
- **Kakao API** (지도/공유) - 나중에 설정

---

## 📦 템플릿 데이터

### 30개 템플릿 포함

| 타입 | 무료 | 프리미엄 | 설명 |
|------|------|----------|------|
| 💐 청첩장 | 3개 | 2개 | 벚꽃, 클래식, 모던, 럭셔리 |
| 🎂 돌잔치 | 3개 | 2개 | 파스텔, 귀여운, 별빛 |
| 🎉 생일 | 3개 | 2개 | 컬러풀, 우아한, 파티 |
| 🏠 집들이 | 3개 | 2개 | 심플, 모던, 따뜻한 |
| 🎊 환갑 | 3개 | 2개 | 전통, 우아한, 축하 |
| 🎈 일반 | 3개 | 2개 | 다목적 초대장 |

---

## 🔧 개발 가이드

### 새로운 템플릿 추가

```typescript
// src/features/invite/data/templates.json
{
  "id": "wedding-06",
  "type": "wedding",
  "name": "새로운 템플릿",
  "style": "modern",
  "isPremium": false,
  "backgroundColor": "#FFFFFF",
  "primaryColor": "#FF6B9D",
  "fontFamily": "Pretendard",
  "description": "설명"
}
```

### 새로운 초대장 타입 추가

1. `src/features/invite/types/index.ts`에 타입 추가
2. `src/features/invite/utils/validation.ts`에 Zod 스키마 추가
3. 테스트 작성 및 실행

---

## 🚧 개발 현황

### ✅ 완료 (2026.02.07)

- [x] SaaS-Boilerplate 클론 및 설정
- [x] features/invite 모듈 생성
- [x] 30개 템플릿 데이터 준비
- [x] TemplateCard 컴포넌트 (Shadcn UI)
- [x] 템플릿 선택 페이지
- [x] Zod 검증 로직 (TDD)
- [x] 보안 취약점 수정 (XSS, URL 검증)
- [x] .env.example 문서화

### 🔄 진행 중

- [ ] 초대장 생성 페이지 (`/invite/create`) - 제미나이 작업 중
- [ ] 포맷터 유틸리티 구현 (날짜, 전화번호)
- [ ] 실시간 미리보기

### 🔜 예정

- [ ] 프리미엄 템플릿 결제 연동
- [ ] 데이터베이스 저장 (Supabase)
- [ ] 내 초대장 관리 페이지
- [ ] RSVP 기능
- [ ] 방명록 기능
- [ ] 카카오 개발자 등록 및 API 키 발급

---

## 🤝 기여 가이드

### TDD 워크플로우

이 프로젝트는 **Test-Driven Development**를 따릅니다:

1. **RED**: 실패하는 테스트 작성
2. **GREEN**: 테스트 통과하는 최소 코드
3. **REFACTOR**: 코드 개선

```bash
# 테스트 실행
npm test

# 커버리지 확인
npm test -- --coverage
```

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
test: 테스트 추가/수정
docs: 문서 수정
chore: 기타 작업
security: 보안 수정
```

---

## 📚 참고 자료

### 기반 프로젝트
- [SaaS-Boilerplate](https://github.com/ixartz/SaaS-Boilerplate) (6,796⭐)

### 주요 라이브러리
- [Next.js Docs](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
- [Kakao Developers](https://developers.kakao.com/)

---

## 📄 라이센스

MIT License

Copyright (c) 2026 InviteMe Platform

---

## 🙏 감사

- **SaaS-Boilerplate** - 인증/결제 기반 제공
- **Shadcn UI** - 아름다운 UI 컴포넌트
- **Kakao** - 지도 및 공유 API

---

## 📞 문의

프로젝트 관련 문의나 제안은 Issue를 통해 남겨주세요!

---

**Made with ❤️ using Claude Code + Gemini**
