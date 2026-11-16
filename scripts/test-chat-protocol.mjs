import assert from 'node:assert/strict'
import { test } from 'node:test'
import { applyChatEvent, parseChatEvent, safeSourceUrl, updateAssistantMessage } from '../src/components/sections/ai-chat/chatProtocol.ts'
import { clearChatSession, loadChatSession } from '../src/components/sections/ai-chat/chatSession.ts'
import { buildAnswerFollowUpPrompts } from '../src/components/sections/ai-chat/followUpPrompts.ts'

const initial = () => ({ text: '', sources: [], status: 'streaming' })
const event = (type, fields = {}) => parseChatEvent(JSON.stringify({ type, requestId: 'request-1', ...fields }))

test('sources and whitespace wait for a visible answer without creating assistant rows', () => {
    const userMessages = [{ id: 'user', text: '질문', isUser: true }]
    for (const sources of [[], [{ id: 'p', title: '프로젝트', url: undefined }]]) {
        let response = applyChatEvent(initial(), event('SOURCES', { sources }))
        let messages = updateAssistantMessage(userMessages, 'answer', response)
        assert.equal(messages, userMessages)
        response = applyChatEvent(response, event('DELTA', { content: ' \n' }))
        messages = updateAssistantMessage(messages, 'answer', response)
        assert.equal(messages, userMessages)
        response = applyChatEvent(response, event('DELTA', { content: '첫 답변' }))
        messages = updateAssistantMessage(messages, 'answer', response)
        assert.equal(messages.length, 2)
        assert.deepEqual(messages[1].sources, sources)
        assert.equal(messages[1].status, 'streaming')
        response = applyChatEvent(response, event('DELTA', { content: '입니다.' }))
        messages = updateAssistantMessage(messages, 'answer', response)
        response = applyChatEvent(response, event('DONE'))
        messages = updateAssistantMessage(messages, 'answer', response)
        assert.equal(messages.length, 2)
        assert.equal(messages[1].text, ' \n첫 답변입니다.')
        assert.equal(messages[1].status, 'complete')
    }
})

test('early errors and empty completion leave no empty answer while partial failures stay visible', () => {
    const messages = [{ id: 'user', text: '질문', isUser: true }]
    const sourced = applyChatEvent(initial(), event('SOURCES', { sources: [{ id: 'p', title: '자료' }] }))
    for (const terminal of [event('ERROR', { code: 'TIMEOUT' }), event('DONE')]) {
        const response = applyChatEvent(sourced, terminal)
        assert.equal(response.status, 'failed')
        assert.equal(updateAssistantMessage(messages, 'answer', response), messages)
        assert.equal(applyChatEvent(response, event('DELTA', { content: '늦은 응답' })), response)
    }
    const partial = applyChatEvent(sourced, event('DELTA', { content: '일부 답변' }))
    const visible = updateAssistantMessage(messages, 'answer', partial)
    const failed = updateAssistantMessage(visible, 'answer', applyChatEvent(partial, event('ERROR', { code: 'TIMEOUT' })))
    assert.equal(failed.length, 2)
    assert.equal(failed[1].text, '일부 답변')
    assert.equal(failed[1].status, 'failed')
})

test('all token frames are accumulated and only DONE completes a response', () => {
    let state = applyChatEvent(initial(), event('SOURCES', { sources: [{ id: 'p', title: '프로젝트' }] }))
    for (const content of ['안녕', '하세', '요']) state = applyChatEvent(state, event('DELTA', { content }))
    assert.equal(state.text, '안녕하세요')
    assert.equal(state.status, 'streaming')
    assert.equal(state.sources[0].title, '프로젝트')
    state = applyChatEvent(state, event('DONE'))
    assert.equal(state.status, 'complete')
    assert.equal(applyChatEvent(state, event('DELTA', { content: 'late' })), state)
})

test('partial failure preserves text and ignores late or unrelated frames', () => {
    const partial = applyChatEvent(initial(), event('DELTA', { content: '일부 답변' }))
    assert.equal(applyChatEvent(partial, { type: 'DONE', requestId: 'other' }), partial)
    const failed = applyChatEvent(partial, event('ERROR', { code: 'TIMEOUT' }))
    assert.equal(failed.status, 'failed')
    assert.equal(failed.text, '일부 답변')
    assert.equal(applyChatEvent(failed, event('DONE')), failed)
})

test('unsafe source links and malformed frames are rejected', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,hi', 'https://user:password@example.com', '/relative']) {
        assert.equal(safeSourceUrl(url), undefined)
    }
    assert.equal(safeSourceUrl('https://github.com/dd3ok/who-am-ai'), 'https://github.com/dd3ok/who-am-ai')
    for (const value of ['plain text', '{}', 'null', JSON.stringify({ type: 'DELTA', requestId: 'x', content: {} })]) {
        assert.equal(parseChatEvent(value), null)
    }
    const sources = event('SOURCES', { sources: [null, { id: 'p', title: '자료', url: 'javascript:alert(1)' }, { id: 'p', title: '중복' }] }).sources
    assert.deepEqual(sources, [{ id: 'p', title: '자료', url: undefined }])
})

test('session bootstrap is shared, cached, and renewed without browser storage', async () => {
    const originalFetch = globalThis.fetch
    let requests = 0
    const socket = 'wss://backend.example/ws/chat/events'
    globalThis.fetch = async (url, options) => {
        requests++
        assert.equal(url.href, 'https://backend.example/api/chat/sessions')
        assert.equal(options.method, 'POST')
        assert.equal(url.search, '')
        return Response.json({ conversationId: `session-${requests}`, sessionToken: 'a'.repeat(43), expiresAt: new Date(Date.now() + 86400000).toISOString() })
    }
    try {
        const [a, b] = await Promise.all([loadChatSession(socket), loadChatSession(socket)])
        assert.deepEqual(a, b)
        assert.equal(requests, 1)
        assert.deepEqual(await loadChatSession(socket), a)
        clearChatSession(socket)
        assert.notEqual((await loadChatSession(socket)).conversationId, a.conversationId)
        assert.equal(requests, 2)
    } finally {
        clearChatSession(socket)
        globalThis.fetch = originalFetch
    }
})

test('failed session issuance can be retried explicitly', async () => {
    const originalFetch = globalThis.fetch
    const socket = 'wss://retry.example/ws/chat/events'
    let requests = 0
    globalThis.fetch = async () => { requests++; return new Response('', { status: 429 }) }
    try {
        await assert.rejects(loadChatSession(socket), /1분/)
        await assert.rejects(loadChatSession(socket), /1분/)
        assert.equal(requests, 2)
    } finally { globalThis.fetch = originalFetch }
})

test('follow-up prompts derive from completed assistant answers and skip already asked questions', () => {
    assert.deepEqual(buildAnswerFollowUpPrompts([{ id: 'welcome', text: '안녕하세요', isUser: false }]), [])
    assert.deepEqual(buildAnswerFollowUpPrompts([
        { id: 'welcome', text: '안녕하세요', isUser: false },
        { id: 'u1', text: 'who-am-ai 설명해줘', isUser: true },
        { id: 'a1', text: 'who-am-ai는 Spring AI와 RAG 기반입니다.', isUser: false, status: 'streaming' },
    ]), [])

    const turnOne = buildAnswerFollowUpPrompts([
        { id: 'welcome', text: '안녕하세요', isUser: false },
        { id: 'u1', text: 'who-am-ai 설명해줘', isUser: true },
        { id: 'a1', text: 'who-am-ai는 Spring AI와 RAG 기반입니다.', isUser: false, status: 'complete' },
    ])
    assert.equal(turnOne.length, 3)

    const turnTwo = buildAnswerFollowUpPrompts([
        { id: 'welcome', text: '안녕하세요', isUser: false },
        { id: 'u1', text: 'who-am-ai 설명해줘', isUser: true },
        { id: 'a1', text: 'who-am-ai는 Spring AI와 RAG 기반입니다.', isUser: false, status: 'complete' },
        { id: 'u2', text: turnOne[0], isUser: true },
        { id: 'a2', text: 'RAG 검색 정확도를 높이기 위해 규칙 기반 검색과 Gemini 임베딩을 함께 씁니다.', isUser: false, status: 'complete' },
    ])
    assert.equal(turnTwo.length, 3)
    assert.ok(!turnTwo.includes(turnOne[0]))
    assert.notDeepEqual(turnOne, turnTwo)
})
