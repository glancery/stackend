import React, { useEffect, useState } from 'react'

function unicodeFancyTransform(text) {
  // Translate letters and digits to a 'fancy' Unicode alphabet similar to
  // the provided Python implementation (mathematical bold for letters,
  // fullwidth digits as fallback).
  const out = []
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const code = text.charCodeAt(i)
    if (ch >= 'A' && ch <= 'Z') {
      out.push(String.fromCodePoint(0x1d400 + (code - 'A'.charCodeAt(0))))
    } else if (ch >= 'a' && ch <= 'z') {
      out.push(String.fromCodePoint(0x1d41a + (code - 'a'.charCodeAt(0))))
    } else if (ch >= '0' && ch <= '9') {
      out.push(String.fromCodePoint(0xff10 + (code - '0'.charCodeAt(0))))
    } else {
      out.push(ch)
    }
  }
  return out.join('')
}

export default function Copy() {
  const [params, setParams] = useState({ title: '', moment: '', sentence: '' })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sp = new URLSearchParams(window.location.search || '')

    const read = (key) => {
      const raw = sp.get(key) || ''
      // Replace plus with space (handle application/x-www-form-urlencoded style)
      return raw.replace(/\+/g, ' ').trim()
    }

    setParams({
      title: read('title'),
      moment: read('moment'),
      sentence: read('sentence'),
    })
  }, [])

  const title = params.title || 'Untitled'
  const sentence = params.sentence || 'No sentence provided'
  const bold_title = unicodeFancyTransform(title)

  const link = "@watchspot"

  const message = `${unicodeFancyTransform('Movie : ')}${bold_title}\n${sentence}\nJoin our community for movie lovers : ${link}`

  const [copying, setCopying] = useState(false)

  const handleCopyAndRedirect = async () => {
    try {
      setCopying(true)
      // copy the full message to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message)
      } else {
        // fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = message
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      // redirect to google.com after successful copy
      window.location.href = 'https://www.substack.com'
    } catch (err) {
      console.error('Copy failed', err)
      setCopying(false)
      alert('Failed to copy to clipboard')
    }
  }

  return (
    <div className="copy-page">
      {/* use pre so newlines are preserved and wrapping is allowed */}
      <pre className="copy-message">{message}</pre>

      <div className="copy-actions">
        <button
          className="copy-button"
          onClick={handleCopyAndRedirect}
          disabled={copying}
        >
          {copying ? 'Copying...' : 'Copy & Continue'}
        </button>
      </div>
    </div>
  )
}
