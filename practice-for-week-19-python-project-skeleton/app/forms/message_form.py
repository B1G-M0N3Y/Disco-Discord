from flask_wtf import FlaskForm
from wtforms import SubmitField, TextAreaField
from wtforms.validators import DataRequired

def message_exists(form, field):
    # Checking if message body exists
    body = field.data
    channel_message = ChannelMessages.query.filter(ChannelMessages.body == body).first()
    chat_message = ChatMessages.query.filter(ChatMessages.body == body).first()
    if not channel_message or chat_message:
        raise ValidationError('Message body must be provided.')

class MessageForm(FlaskForm):
    body = TextAreaField("Body",validators=[DataRequired(), message_exists])
    submit = SubmitField("Submit")