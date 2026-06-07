// Netlify Function (JavaScript) - sendBooking
// Expects a POST with JSON: { name, email, phone, message }
// Requires env vars in Netlify: SENDGRID_API_KEY, COMPANY_EMAIL

const SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send'

exports.handler = async function(event, context) {
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
    // Force company recipient to rubem as requested
    const COMPANY_EMAIL = 'rubem.uchoa27@gmail.com'

    if (!SENDGRID_API_KEY) {
      return { statusCode: 500, body: 'Mail config not set' }
    }

  // use a subject and message suitable for a contact/booking form
  const subject = `Novo contacto/Reserva de: ${name}`
  const text = `Nome: ${name}\nEmail: ${email}\nTelefone: ${phone || ''}\nMensagem: ${message || ''}`

    async function sendEmail(to, toName, personalText) {
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

  // send to company (rubem) and confirmation to the user
  await sendEmail(COMPANY_EMAIL, 'O Pioneiro', text)
  await sendEmail(email, name, `Obrigado pelo seu contato!\n\nRecebemos a sua mensagem e responderemos em breve.\n\nResumo da sua mensagem:\n\n${text}`)

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: String(err.message || err) }
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
