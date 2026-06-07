// Netlify Function (TypeScript) - sendBooking
// Expects a POST with JSON: { name, email, phone, message, ... }
// Requires env vars in Netlify: SENDGRID_API_KEY, COMPANY_EMAIL

import { Handler } from '@netlify/functions'

const SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send'

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const data = JSON.parse(event.body || '{}')
    const { name, email, phone, message } = data

    if (!name || !email) {
      return { statusCode: 400, body: 'Missing required fields' }
    }

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL

    if (!SENDGRID_API_KEY || !COMPANY_EMAIL) {
      return { statusCode: 500, body: 'Mail config not set' }
    }

    // Build the email content
    const subject = `Nova reserva: ${name}`
    const text = `Nome: ${name}\nEmail: ${email}\nTelefone: ${phone || ''}\nMensagem: ${message || ''}`

    // Helper to send via SendGrid
    async function sendEmail(to: string, toName: string | null, personalText: string) {
      const payload = {
        personalizations: [{ to: [{ email: to, name: toName || undefined }], subject }],
        from: { email: COMPANY_EMAIL, name: 'O Pioneiro do Mondego' },
        content: [
          { type: 'text/plain', value: personalText },
          { type: 'text/html', value: `<pre>${escapeHtml(personalText)}</pre>` }
        ]
      }

      const res = await fetch(SENDGRID_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`SendGrid error: ${res.status} ${errText}`)
      }
    }

    // send to company
    await sendEmail(COMPANY_EMAIL, 'O Pioneiro', text)
    // send copy to user
    await sendEmail(email, name, `Obrigado pelo seu contacto!\n\nRecebemos a sua mensagem:\n\n${text}`)

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err: any) {
    console.error(err)
    return { statusCode: 500, body: String(err.message || err) }
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}

export { handler }
