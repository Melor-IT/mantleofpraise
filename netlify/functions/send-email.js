import nodemailer from 'nodemailer';

export async function handler(event, context) {
  // Allow only POST
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // or your domain instead of *
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: 'OK'
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: 'Method Not Allowed'
    };
  }

  try {
    const { firstName, lastName, email } = JSON.parse(event.body);
    const data = JSON.parse(event.body);

    // Format the message in a "nice" way
    const messageText = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const messageHtml = `
      <h2>New Contact Form Submission</h2>
      <ul>
        ${Object.entries(data)
          .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
          .join('')}
      </ul>
    `;

    const transporterConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    // Only add tls config for local development
    if (process.env.NODE_ENV !== 'production') {
      transporterConfig.tls = {
        rejectUnauthorized: false // allow self-signed certificates
      };
    }

    let transporter = nodemailer.createTransport(transporterConfig);

    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New message from ${firstName} ${lastName}`,
      text: messageText, // plain text fallback
      html: messageHtml // nicely formatted HTML
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // allow frontend
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true, message: 'Email sent!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
}
