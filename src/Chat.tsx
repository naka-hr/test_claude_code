import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './Chat.css'

type Message = {
  id: number
  sender: 'me' | 'other'
  text: string
  time: string
}

const PARTNER_NAME = 'ボット'
const REPLY_DELAY_MS = 800

function currentTime() {
  return new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 0,
      sender: 'other',
      text: 'こんにちは!メッセージを送ってみてください。',
      time: currentTime(),
    },
  ])
  const [text, setText] = useState('')
  const nextId = useRef(1)
  const timers = useRef<number[]>([])
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const addMessage = (sender: Message['sender'], body: string) => {
    const id = nextId.current++
    setMessages((prev) => [
      ...prev,
      { id, sender, text: body, time: currentTime() },
    ])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return

    addMessage('me', body)
    setText('')
    timers.current.push(
      window.setTimeout(
        () => addMessage('other', `「${body}」ですね!`),
        REPLY_DELAY_MS,
      ),
    )
  }

  return (
    <section className="chat">
      <header className="chat-header">
        <a href="#" className="chat-back" aria-label="TOPに戻る">
          ‹
        </a>
        <h1>{PARTNER_NAME}</h1>
      </header>

      <div className="chat-messages" ref={listRef} aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`chat-row ${message.sender}`}>
            {message.sender === 'other' && (
              <div className="chat-avatar" aria-hidden="true">
                {PARTNER_NAME.charAt(0)}
              </div>
            )}
            <div className="chat-body">
              {message.sender === 'other' && (
                <span className="chat-name">{PARTNER_NAME}</span>
              )}
              <div className="chat-line">
                <p className="chat-bubble">{message.text}</p>
                <time className="chat-time">{message.time}</time>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="メッセージを入力"
          aria-label="メッセージ"
          autoComplete="off"
        />
        <button type="submit" disabled={!text.trim()}>
          送信
        </button>
      </form>
    </section>
  )
}

export default Chat
