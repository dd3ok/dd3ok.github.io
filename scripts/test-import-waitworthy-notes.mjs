import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { syncWaitworthyNotes } from './import-waitworthy-notes.mjs'

const createTempWorkspace = () => mkdtempSync(join(tmpdir(), 'waitworthy-notes-'))

const writeFile = (filePath, content) => {
  mkdirSync(join(filePath, '..'), { recursive: true })
  writeFileSync(filePath, content, 'utf8')
}

const readFile = (filePath) => readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n')

const runTest = (name, fn) => {
  const workspace = createTempWorkspace()

  try {
    fn(workspace)
    console.log(`ok - ${name}`)
  } finally {
    rmSync(workspace, { recursive: true, force: true })
  }
}

runTest('publishes every Waitworthy wiki page as a public note', (workspace) => {
  const sourceDir = join(workspace, 'waitworthy', 'wiki')
  const targetDir = join(workspace, 'site', 'src', 'content', 'notes')

  writeFile(
    join(sourceDir, 'life', '2026-06-17-korean-baby-naming-skill.md'),
    `﻿---
title: "대한민국 아기 이름 짓기 Skill"
date: 2026-06-17
status: "raw"
category: "life"
tags: ["baby-naming", "hanja"]
source: "User-provided Markdown file"
---

# 대한민국 아기 이름 짓기 Skill

## 한 줄 요약

대한민국 출생신고 가능성과 인명용 한자 검증을 포함한 작명 절차 메모.

## 중요한 인사이트

- 법적 출생신고 가능성을 먼저 확인한다.

## 출처 / 참고자료

- User-provided Markdown file: C:\\Users\\hwick\\Downloads\\korean_baby_naming_skill_v2 (1).md

<details>
<summary>원문 Markdown</summary>

private raw source

</details>
`,
  )
  writeFile(
    join(sourceDir, 'meta', '2026-06-18-waitworthy-process.md'),
    `---
title: "Waitworthy 운영 방식"
date: 2026-06-18
status: "verified"
category: "meta"
tags: ["waitworthy"]
---

# Waitworthy 운영 방식

## 한 줄 요약

Waitworthy 글을 공개 사이트에 자동으로 노출하는 운영 방식.

## 유용한 액션

- 전체 공개 정책을 적용한다.
`,
  )

  const result = syncWaitworthyNotes({ sourceDir, targetDir })

  assert.deepEqual(result.createdFiles.sort(), [
    '2026-06-17-korean-baby-naming-skill.md',
    '2026-06-18-waitworthy-process.md',
  ])

  const lifeNote = readFile(join(targetDir, '2026-06-17-korean-baby-naming-skill.md'))
  assert.match(lifeNote, /visibility: "public"/)
  assert.match(lifeNote, /status: "draft"/)
  assert.match(lifeNote, /category: "life"/)
  assert.match(lifeNote, /human_reviewed: true/)
  assert.match(lifeNote, /source_repository: "waitworthy"/)
  assert.match(lifeNote, /summary: "대한민국 출생신고 가능성과 인명용 한자 검증을 포함한 작명 절차 메모\."/)
  assert.match(lifeNote, /tags: \["baby-naming", "hanja", "life", "waitworthy"\]/)
  assert.doesNotMatch(lifeNote, /\n---\ntitle: "대한민국 아기 이름 짓기 Skill"/)
  assert.doesNotMatch(lifeNote, /C:\\Users\\hwick/)
  assert.match(lifeNote, /User-provided Markdown file: local uploaded file/)
  assert.doesNotMatch(lifeNote, /<details>/)
  assert.doesNotMatch(lifeNote, /private raw source/)

  const metaNote = readFile(join(targetDir, '2026-06-18-waitworthy-process.md'))
  assert.match(metaNote, /status: "evergreen"/)
  assert.match(metaNote, /category: "insights"/)
  assert.match(metaNote, /tags: \["waitworthy", "meta", "insights"\]/)
})

runTest('replaces stale generated notes without deleting manual public notes', (workspace) => {
  const sourceDir = join(workspace, 'waitworthy', 'wiki')
  const targetDir = join(workspace, 'site', 'src', 'content', 'notes')

  writeFile(
    join(sourceDir, 'tech', '2026-06-18-api-design.md'),
    `---
title: "API 설계 메모"
date: 2026-06-18
status: "refined"
category: "tech"
tags: []
---

# API 설계 메모

## 한 줄 요약

작은 API 설계를 정리한 메모.
`,
  )
  writeFile(
    join(targetDir, 'stale.md'),
    `---
title: "Old"
source_repository: "waitworthy"
---

Old generated note
`,
  )
  writeFile(
    join(targetDir, 'manual.md'),
    `---
title: "Manual"
---

Manual note
`,
  )

  const result = syncWaitworthyNotes({ sourceDir, targetDir })

  assert.deepEqual(result.removedFiles, ['stale.md'])
  assert.deepEqual(result.createdFiles, ['2026-06-18-api-design.md'])
  assert.match(readFile(join(targetDir, 'manual.md')), /Manual note/)
  assert.match(readFile(join(targetDir, '2026-06-18-api-design.md')), /status: "reviewed"/)
  assert.match(readFile(join(targetDir, '2026-06-18-api-design.md')), /tags: \["tech", "waitworthy"\]/)
})
