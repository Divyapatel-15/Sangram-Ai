"""Outbound email for auth flows (Developer 2).

`console` backend logs messages (development only; blocked in production by config).
`smtp` backend sends through any SMTP relay (Mailtrap, SES SMTP, SendGrid SMTP, ...).
"""

import logging
from email.message import EmailMessage
from typing import Protocol

from app.core.config import get_settings

logger = logging.getLogger("sangram_ai.email")


class IEmailSender(Protocol):
    async def send(self, to: str, subject: str, body: str) -> None: ...


class ConsoleEmailSender:
    async def send(self, to: str, subject: str, body: str) -> None:
        logger.warning("DEV EMAIL to=%s subject=%s\n%s", to, subject, body)


class SmtpEmailSender:
    async def send(self, to: str, subject: str, body: str) -> None:
        import aiosmtplib

        s = get_settings()
        msg = EmailMessage()
        msg["From"] = s.EMAIL_FROM
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(body)
        await aiosmtplib.send(
            msg,
            hostname=s.SMTP_HOST,
            port=s.SMTP_PORT,
            username=s.SMTP_USERNAME or None,
            password=s.SMTP_PASSWORD or None,
            start_tls=s.SMTP_STARTTLS,
            timeout=10,
        )


def build_email_sender() -> IEmailSender:
    return SmtpEmailSender() if get_settings().EMAIL_BACKEND == "smtp" else ConsoleEmailSender()
