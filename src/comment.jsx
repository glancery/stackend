import React, { useEffect, useState } from 'react'

export default function CommentPage() {
  const [params, setParams] = useState({ url: '', comment: '' })
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sp = new URLSearchParams(window.location.search || '')

    const read = (key) => {
      const raw = sp.get(key) || ''
      return raw.replace(/\+/g, ' ').trim()
    }

    setParams({
      url: read('url'),
      comment: read('comment'),
    })
  }, [])

  const commentText = params.comment || 'No comment provided'
  const targetUrl = params.url || 'https://google.com'

  const copyAndGo = async () => {
    try {
      setCopying(true)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(commentText)
      } else {
        const ta = document.createElement('textarea')
        ta.value = commentText
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      // redirect to the provided url
      window.location.href = targetUrl
    } catch (err) {
      console.error('Copy failed', err)
      setCopying(false)
      alert('Failed to copy comment to clipboard')
    }
  }

  return (
    <div className="copy-page">
      <h2 style={{ marginTop: 0 }}>Comment</h2>
      <pre className="copy-message">{commentText}</pre>

      <div className="copy-actions">
        <button className="copy-button" onClick={copyAndGo} disabled={copying}>
          {copying ? 'Copying...' : 'Copy comment & Open'}
        </button>
      </div>
    </div>
  )
}
