export default {
    async formSubmitted(event) {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const RESEND_EMAIL = process.env.RESEND_EMAIL;
        console.log("Event received in formSubmitted:", event);
        const { name, email, phone, message } = event.data;
        console.log("Received submission:", { name, email, phone, message });

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: RESEND_EMAIL,
                to: email,
                subject: `New submission from ${name}`,
                html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Message:</strong> ${message}</p>`
            })
        });

        if (!response.ok) {
            console.error(`Failed to send email: ${response.statusText}`);
        }

        console.log("Email sent successfully - ", (await response.json()).id);

        return new Response('OK', { status: 200 });
    },

    config: {
        path: '/submission-webhook',
        method: ['GET', 'POST']
    }
}