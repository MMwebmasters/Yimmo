const nodemailer = require('nodemailer');

let transporter = null;

// Initialize email transporter
function initializeEmailTransporter() {
  if (transporter) return transporter;

  // Check if email configuration is provided
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  Email configuration not set. Emails will be logged to console only.');
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT) || 587;
  const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionUrl: `${isSecure ? 'smtps' : 'smtp'}://${process.env.SMTP_USER}:***@${process.env.SMTP_HOST}:${port}`,
  });

  console.log(`📧 Email transporter initialized on ${process.env.SMTP_HOST}:${port} (secure: ${isSecure})`);

  return transporter;
}

// Send appointment confirmation email to client
async function sendAppointmentConfirmation(clientEmail, clientName, appointmentDetails, responseMessage) {
  const transporter = initializeEmailTransporter();

  const appointmentDate = new Date(appointmentDetails.preferred_date);
  const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `
    <h2>Confirmation de votre rendez-vous</h2>
    <p>Bonjour ${clientName},</p>
    <p>Votre rendez-vous a été confirmé. Voici les détails:</p>

    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Heure:</strong> ${appointmentDetails.preferred_time}</p>
      <p><strong>Téléphone de contact:</strong> <a href="tel:${appointmentDetails.phone}">${appointmentDetails.phone}</a></p>
    </div>

    ${responseMessage ? `
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; border-left: 4px solid #4caf50; margin: 20px 0;">
        <p><strong>Message de confirmation:</strong></p>
        <p>${responseMessage.replace(/\n/g, '<br>')}</p>
      </div>
    ` : ''}

    <p style="color: #666; margin-top: 30px; font-size: 14px;">
      Si vous ne pouvez pas vous présenter à ce rendez-vous, veuillez nous contacter au plus tôt.
    </p>

    <p style="color: #999; margin-top: 20px; font-size: 12px;">
      <em>Yimmo Menuiserie - Spécialiste en portes EI30 et cuisines</em>
    </p>
  `;

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'Yimmo'} <${process.env.SMTP_FROM_EMAIL}>`,
    to: clientEmail,
    subject: 'Confirmation de votre rendez-vous - Yimmo Menuiserie',
    html: htmlContent,
  };

  if (!transporter) {
    console.log('📧 Email confirmation (logged to console - SMTP not configured):');
    console.log(`To: ${clientEmail}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Message: ${htmlContent}`);
    return { success: true, message: 'Email logged to console (SMTP not configured)' };
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Appointment confirmation email sent to ${clientEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending appointment confirmation email:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);

    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      console.error('   ⚠️  Network connection issue - unable to reach SMTP server');
      console.error('   Possible causes:');
      console.error('     - Firewall blocking port 587/465');
      console.error('     - ISP blocking SMTP connections');
      console.error('     - Network connectivity issue');
      console.error('   Solution: Try changing SMTP_PORT to 465 and SMTP_SECURE to true');
    } else if (error.code === 'EAUTH') {
      console.error('   ⚠️  Authentication failed - check email/password');
    }

    return { success: false, error: error.message };
  }
}

// Send appointment rejection email to client
async function sendAppointmentRejection(clientEmail, clientName, appointmentDetails, responseMessage) {
  const transporter = initializeEmailTransporter();

  const appointmentDate = new Date(appointmentDetails.preferred_date);
  const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `
    <h2>À propos de votre rendez-vous</h2>
    <p>Bonjour ${clientName},</p>
    <p>Malheureusement, votre demande de rendez-vous ne peut pas être confirmée.</p>

    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Date demandée:</strong> ${formattedDate}</p>
      <p><strong>Heure demandée:</strong> ${appointmentDetails.preferred_time}</p>
    </div>

    ${responseMessage ? `
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ff9800; margin: 20px 0;">
        <p><strong>Raison:</strong></p>
        <p>${responseMessage.replace(/\n/g, '<br>')}</p>
      </div>
    ` : ''}

    <p style="color: #666; margin-top: 30px;">
      Si vous avez des questions, n'hésitez pas à nous contacter directement pour proposer une autre date.
    </p>

    <p style="color: #999; margin-top: 20px; font-size: 12px;">
      <em>Yimmo Menuiserie - Spécialiste en portes EI30 et cuisines</em>
    </p>
  `;

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'Yimmo'} <${process.env.SMTP_FROM_EMAIL}>`,
    to: clientEmail,
    subject: 'Votre demande de rendez-vous - Yimmo Menuiserie',
    html: htmlContent,
  };

  if (!transporter) {
    console.log('📧 Email rejection (logged to console - SMTP not configured):');
    console.log(`To: ${clientEmail}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Message: ${htmlContent}`);
    return { success: true, message: 'Email logged to console (SMTP not configured)' };
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Appointment rejection email sent to ${clientEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending appointment rejection email:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);

    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      console.error('   ⚠️  Network connection issue - unable to reach SMTP server');
      console.error('   Solution: Try changing SMTP_PORT to 465 and SMTP_SECURE to true');
    } else if (error.code === 'EAUTH') {
      console.error('   ⚠️  Authentication failed - check email/password');
    }

    return { success: false, error: error.message };
  }
}

// Send contact form confirmation email
async function sendContactFormConfirmation(clientEmail, clientName) {
  const transporter = initializeEmailTransporter();

  const htmlContent = `
    <h2>Merci pour votre message</h2>
    <p>Bonjour ${clientName},</p>
    <p>Nous avons bien reçu votre message. Notre équipe y répondra dans les meilleurs délais.</p>

    <p style="color: #666; margin-top: 30px;">
      Merci de nous avoir contactés!
    </p>

    <p style="color: #999; margin-top: 20px; font-size: 12px;">
      <em>Yimmo Menuiserie - Spécialiste en portes EI30 et cuisines</em>
    </p>
  `;

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME || 'Yimmo'} <${process.env.SMTP_FROM_EMAIL}>`,
    to: clientEmail,
    subject: 'Accusé de réception - Yimmo Menuiserie',
    html: htmlContent,
  };

  if (!transporter) {
    console.log('📧 Contact form confirmation (logged to console - SMTP not configured):');
    console.log(`To: ${clientEmail}`);
    console.log(`Subject: ${mailOptions.subject}`);
    return { success: true, message: 'Email logged to console (SMTP not configured)' };
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Contact form confirmation email sent to ${clientEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending contact form confirmation email:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);

    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      console.error('   ⚠️  Network connection issue - unable to reach SMTP server');
      console.error('   Solution: Try changing SMTP_PORT to 465 and SMTP_SECURE to true');
    } else if (error.code === 'EAUTH') {
      console.error('   ⚠️  Authentication failed - check email/password');
    }

    return { success: false, error: error.message };
  }
}

module.exports = {
  initializeEmailTransporter,
  sendAppointmentConfirmation,
  sendAppointmentRejection,
  sendContactFormConfirmation,
};
