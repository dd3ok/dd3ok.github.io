import assert from 'node:assert/strict'
import { test } from 'node:test'
import { applyChatEvent, parseChatEvent, safeSourceUrl } from '../src/components/sections/ai-chat/chatProtocol.ts'
import { clearChatSession, loadChatSession } from '../src/components/sections/ai-chat/chatSession.ts'

const initial = () => ({ text: '', sources: [], status: 'streaming' })
const event = (type, fields = {}) => parseChatEvent(JSON.stringify({ type, requestId: 'request-1', ...fields }))

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
