export default {
    formSubmitted(event) {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const RESEND_EMAIL = process.env.RESEND_EMAIL;
        const { name, email, message } = JSON.parse(event.body);
        console.log("Received submission:", event);
        console.log("Time: ", new Date().toISOString());
        fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: RESEND_EMAIL,
                to: email,
                subject: `New submission from ${name}`,
                html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
            })
        });
    },

    config: {
        path: '/submission-webhook',
        method: ['GET', 'POST']
    }
}