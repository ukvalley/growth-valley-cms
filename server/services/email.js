const nodemailer = require('nodemailer');
const config = require('../config');

// Create transporter
const createTransporter = () => {
  // In development, use console transport
  if (config.nodeEnv === 'development' && !config.smtp.user) {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }
  
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: config.smtp.user ? {
      user: config.smtp.user,
      pass: config.smtp.pass
    } : undefined
  });
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

/**
 * Send email
 */
const sendEmail = async (options) => {
  const { to, subject, html, text, attachments } = options;
  
  const mailOptions = {
    from: config.smtp.from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
    attachments
  };
  
  try {
    const transport = getTransporter();
    
    // In development without SMTP, log the email
    if (config.nodeEnv === 'development' && !config.smtp.user) {
      console.log('\n📧 Email (Development Mode):');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Body:', text || html.replace(/<[^>]*>/g, ''));
      console.log('');
      return { success: true, messageId: 'dev-' + Date.now() };
    }
    
    const info = await transport.sendMail(mailOptions);
    
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  const subject = 'Password Reset Request - Growth Valley';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Growth Valley</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you did not request this password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Growth Valley. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({ to: email, subject, html });
};

/**
 * Send new enquiry notification to admin
 */
const sendEnquiryNotification = async (enquiry, adminEmail) => {
  const subject = `New Enquiry from ${enquiry.name} - Growth Valley`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .info-row { padding: 10px; border-bottom: 1px solid #ddd; }
        .label { font-weight: bold; color: #667eea; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Enquiry</h1>
        </div>
        <div class="content">
          <div class="info-row">
            <span class="label">Name:</span> ${enquiry.name}
          </div>
          <div class="info-row">
            <span class="label">Email:</span> ${enquiry.email}
          </div>
          <div class="info-row">
            <span class="label">Phone:</span> ${enquiry.phone}
          </div>
          <div class="info-row">
            <span class="label">Company:</span> ${enquiry.company}
          </div>
          <div class="info-row">
            <span class="label">Service:</span> ${enquiry.service || 'Not specified'}
          </div>
          <div class="info-row">
            <span class="label">Message:</span>
            <p>${enquiry.message}</p>
          </div>
        </div>
        <div class="footer">
          <p>Received at ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({ to: adminEmail, subject, html });
};

/**
 * Send enquiry confirmation to user
 */
const sendEnquiryConfirmation = async (enquiry) => {
  const subject = 'Thank you for contacting Growth Valley';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Growth Valley</h1>
        </div>
        <div class="content">
          <h2>Thank You for Reaching Out!</h2>
          <p>Hi ${enquiry.name},</p>
          <p>Thank you for contacting Growth Valley. We have received your enquiry and will get back to you within 24-48 hours.</p>
          <p>Here's a summary of your message:</p>
          <ul>
            <li><strong>Company:</strong> ${enquiry.company}</li>
            <li><strong>Service:</strong> ${enquiry.service || 'General Enquiry'}</li>
            <li><strong>Message:</strong> ${enquiry.message.substring(0, 100)}${enquiry.message.length > 100 ? '...' : ''}</li>
          </ul>
          <p>In the meantime, feel free to explore our <a href="https://growthvalley.com/case-studies">case studies</a> to see how we've helped businesses like yours.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Growth Valley. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({ to: enquiry.email, subject, html });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendEnquiryNotification,
  sendEnquiryConfirmation
};