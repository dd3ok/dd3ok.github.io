# Waitworthy Notes Integration Plan

## Goal

`waitworthy`는 공개 가능한 AI 질문/답변을 정리하는 원본 저장소로 두고, `dd3ok.github.io`는 공개용으로 다듬은 노트만 읽기 좋게 보여준다.

## Current Decision

첫 버전은 `waitworthy` repo를 웹사이트 빌드에 직접 연결하지 않는다. 대신 에이전트가 공개 가능한 글만 `dd3ok.github.io/src/content/notes`에 Markdown으로 추가한다.

이 방식은 중복이 조금 있지만 안전하다. private/raw 성격의 대화 원문이 GitHub Pages에 실수로 섞일 가능성을 낮추고, Next.js static export도 단순하게 유지한다.

`/notes` 첫 화면은 글 목록보다 카테고리 인덱스를 먼저 보여준다. 공개 노트가 아직 없어도 카테고리 구조는 바로 보이고, 공개 노트가 추가되면 해당 카테고리 아래에 붙는다.

웹 카테고리는 Waitworthy의 기존 primary category를 기반으로 하되, 공개 독자가 읽을 일반 주제만 노출한다. 첨부 문서의 `Research Notes`, `Decision Logs`, `Life & Family`, `Business & Technology`, `Health & Longevity`, `AI Workflows`, `Archive`는 공개 블로그 상단 메뉴 후보에 가깝다.

## Category Model

Waitworthy의 원래 카테고리:

```text
ai
tools
tech
business
finance
learning
life
meta
other
```

`meta`는 Waitworthy 자체, 프롬프트, 지식관리 방식, 운영 절차를 다루는 내부 관리 카테고리다. 공개 `/notes`에서는 일반 독자용 카테고리로 노출하지 않고, 필요하면 Waitworthy repo 안에서만 관리한다.

공개 웹사이트 카테고리:

```text
ai-tools
tech
business
finance
learning
life
health
insights
other
```

공개 카테고리 조정 기준:

- `ai`와 `tools`는 공개 화면에서 `AI & Tools`로 합친다. AI 도구, 에이전트, 프롬프트, 생산성 도구는 실제로 같이 찾게 될 가능성이 높다.
- `health`는 `life`에서 분리한다. 운동, 노화, 수면, 식단처럼 반복적으로 쌓일 가능성이 큰 주제다.
- `insights`는 일반적으로 블로그/리서치 사이트에서 쓰이는 이름이지만, 너무 넓어질 수 있다. 따라서 분야를 넘는 관찰, 패턴, 재사용 가능한 관점만 넣는다.
- `career`는 별도 공개 카테고리로 두지 않는다. 필요하면 `life` 또는 `learning`에 태그로 붙인다.
- `decision`은 별도 공개 카테고리로 두지 않는다. 가성비/선택 기준 글은 `finance`, `business`, `life` 중 가장 먼저 찾을 곳에 넣고 `decision-analysis` type이나 `decision` tag를 붙인다.

역할 분리:

- `category`: 글을 어디에서 먼저 찾을지 정하는 primary bucket. 한 글은 하나의 category만 가진다.
- `type`: 문서 성격. 예: `deep-research`, `decision-analysis`, `naming`, `market-map`, `playbook`.
- `domain`: 세부 도메인. 예: `health-longevity`, `business-strategy`, `consumer-value`.
- `tags`: 겹치는 주제를 연결하는 보조 인덱스. 예: `parenting`, `finance`, `career`, `engineering`, `ai-workflow`.

따라서 모든 주제를 별도 대분류로 만들기보다, Waitworthy category는 적게 유지하고 세부 주제는 `domain`과 `tags`로 넓힌다.

## Architecture

```text
waitworthy
  README.md
  wiki/
  topics/
  templates/
  = 원본/작업 기록/개인 지식 저장소

dd3ok.github.io
  src/content/notes/*.md
  src/lib/notes.ts
  src/app/notes/page.tsx
  src/app/notes/[slug]/page.tsx
  scripts/check-notes.mjs
  = 공개용 노트 목록과 상세 페이지
```

## Publishing Flow

```text
1. 사용자가 공개 가능한 질문/답변을 에이전트에게 전달
2. 에이전트가 Waitworthy용 Markdown 노트 작성
3. 에이전트가 공개용 정리본을 dd3ok.github.io/src/content/notes에 추가
4. npm run notes:check로 frontmatter와 공개 조건 검증
5. npm run validate로 lint/typecheck/notes 검증
6. npm run build로 GitHub Pages static export 확인
7. commit/push 또는 PR 생성
8. GitHub Pages에서 /notes와 /notes/[slug]로 공개
```

## Public Note Contract

각 공개 노트는 Markdown 파일 하나다. 파일명은 slug가 된다. 공개 노트가 0개인 상태도 정상이다.

```yaml
---
title: "글 제목"
date: "2026-06-16"
updated: "2026-06-16"
summary: "목록과 SEO에 사용할 요약"
visibility: "public"
status: "reviewed"
category: "ai-tools"
type: "ai-workflow"
domain: "knowledge-management"
tags:
  - waitworthy
  - ai-workflow
source_repository: "https://github.com/dd3ok/waitworthy"
human_reviewed: "true"
---
```

필수 규칙:

- `visibility`는 `public`만 허용한다.
- `status`는 `draft`, `reviewed`, `evergreen`, `archived` 중 하나다.
- `category`는 권장값이며 `/notes`의 카테고리 매핑에 쓰인다.
- `tags`는 최소 2개 이상 둔다.
- 원문 전체 복붙보다 TL;DR, 핵심 결론, 한계, 후속 질문 중심으로 재작성한다.
- 민감정보가 조금이라도 있으면 공개 노트로 만들지 않는다.

## Automation Levels

### Level 1: Local Agent Publishing

현재 구현 범위다.

사용자가 공개 가능한 질문/답변을 전달하면 에이전트가 두 저장소에 파일을 만든다. `waitworthy`에는 작업 기록을 남기고, `dd3ok.github.io`에는 공개용 Markdown만 추가한다.

검증:

```bash
npm run notes:check
npm run validate
npm run build
```

### Level 2: PR-Based Publishing

다음 단계다.

에이전트가 직접 main에 넣지 않고 branch를 만든 뒤 PR을 생성한다. 사람이 PR을 보고 merge하면 웹에 배포된다.

추천 PR 체크리스트:

```markdown
- [ ] 공개 가능한 내용만 포함했다.
- [ ] 원문 transcript 전체를 붙이지 않았다.
- [ ] 개인정보와 민감정보가 없다.
- [ ] 검증이 필요한 주장은 단정하지 않았다.
- [ ] npm run notes:check 통과.
- [ ] npm run build 통과.
```

### Level 3: GitHub Issue Form to PR

반자동화 단계다.

GitHub Issue Form에 질문/답변을 붙여넣으면 GitHub Actions가 Markdown 초안을 만들고 PR을 연다. 이 단계에서도 merge는 사람이 한다.

필요한 추가 파일:

```text
.github/ISSUE_TEMPLATE/ai-research-ingest.yml
.github/workflows/ingest-note.yml
scripts/ingest-note-from-issue.mjs
```

### Level 4: Conditional Auto-Publish

반복 패턴이 안정된 뒤에만 적용한다.

`auto-publish` 라벨이 있고 검증이 모두 통과한 PR만 자동 merge한다. 민감정보 가능성이 있거나 `human_reviewed`가 false인 글은 자동 merge하지 않는다.

## Agent Prompt

```text
다음 질문/답변은 공개 가능하다. waitworthy에는 작업 기록용 노트로 저장하고, dd3ok.github.io에는 공개용 research note로 정리해서 추가해줘.

요구사항:
- 원문 그대로 복붙하지 말고 공개 노트로 재작성
- title, date, summary, visibility, status, tags frontmatter 포함
- visibility는 public
- 민감정보가 발견되면 작업을 멈추고 보고
- dd3ok.github.io/src/content/notes/YYYY-MM-DD-slug.md에 저장
- npm run notes:check, npm run validate, npm run build 실행
- 자동 merge는 하지 말고 결과만 보고
```

## Open Decisions

- 공개 노트 파일명을 `YYYY-MM-DD-slug.md`로 강제할지 여부.
- `waitworthy`에도 동일한 공개용 정리본을 둘지, 원본 작업 기록만 둘지 여부.
- GitHub Actions 자동화를 언제 도입할지 여부.
