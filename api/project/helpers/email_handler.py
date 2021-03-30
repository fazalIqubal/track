from sendgrid.helpers.mail import Mail
from sendgrid import SendGridAPIClient

from project.config.settings import SENDGRID_API_KEY


class EmailHandler():
    def send_email(email, subject, template):
       
        message = Mail(
            from_email='no-replay@trackify.xcdify.com',
            to_emails=email,
            subject=subject,
            html_content=template
        )
        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            # print(response.status_code)
           
        except Exception as e:
            raise ValueError("invalid email")
            

