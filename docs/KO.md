# Polkadot Cloud 스테이킹에 오신 것을 환영합니다!

이 섹션은 개발자들이 Polkadot 스테이킹 대시보드에 익숙해질 수 있도록 하기 위한 것입니다. 이 문서의 내용에 대한 설명이 필요하면 __staking@polkadot.cloud__로 연락하세요.

## Pull Request 제출

이 프로젝트는 Conventional Commits 명세를 따릅니다. Pull Request는 병합 및 압축되며, Pull Request 제목이 커밋 메시지로 사용됩니다. 커밋 메시지는 다음 구조를 따라야 합니다:

```
<유형>(<범위>): <요약>
```

PR 제목 예시:

- feat: 도움말 오버레이 구현
- feat(auth): 로그인 API 구현
- fix: 버튼 정렬 문제 해결
- fix(docs): README 설치 섹션 수정

**chore** 유형은 릴리스 변경 로그에 추가되지 않으며 조용한 업데이트에 사용해야 합니다.

## 프로젝트 설정

### 종속성 설치

```bash
pnpm install
```

### 개발 서버 시작

```bash
pnpm dev
```

### 프로덕션용 빌드

```bash
pnpm build
```

### 테스트 실행

```bash
pnpm test
```

### 코드 린팅

```bash
pnpm lint
```

## 프로젝트 구조

이 프로젝트는 pnpm 워크스페이스를 사용하여 모노레포로 구성되어 있습니다. 각 패키지는 `packages/` 디렉토리에 위치합니다.

## 기여하기

Polkadot Cloud 스테이킹에 기여해주셔서 감사합니다! Pull Request를 제출하기 전에 기여 지침을 읽어주세요.

## 라이선스

이 프로젝트는 GPL 3.0 라이선스에 따라 라이선스되어 있습니다.
