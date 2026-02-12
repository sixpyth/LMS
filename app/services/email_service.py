import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from app.core.config import settings
from app.templates.email_template import email_template


def send_email(to: str, subject: str, body: str):
    """Uses Google SMTP to send custom email"""
    smtp_host = settings.smtp_host
    smtp_port = settings.smtp_port
    smtp_user = settings.smtp_user
    smtp_password = settings.smtp_password

    msg = MIMEMultipart()
    msg["From"] = "dnk-studio.noreply@gmail.com"
    msg["To"] = to
    msg["Subject"] = subject

    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(smtp_host,smtp_port) as server:
        server.starttls()
        server.login(smtp_user,smtp_password)
        server.send_message(msg=msg)


subject, text, html = email_template()

