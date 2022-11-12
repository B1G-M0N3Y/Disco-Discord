from flask_wtf import FlaskForm
from wtforms import SubmitField, TextAreaField, IntegerField, DateTimeField
from wtforms.validators import DataRequired, ValidationError
from app.models.servers import ChannelMessages
from sqlalchemy import func


def message_exists(form, field):
    # Checking if message body exists
    body = form.data['body']
    # channel_message = ChannelMessages.query.filter(ChannelMessages.body == body).first()
    # chat_message = ChatMessages.query.filter(ChatMessages.body == body).first()
    if not body:
        raise ValidationError('Message body must be provided.')


class MessageForm(FlaskForm):
    body = TextAreaField("Body", validators=[DataRequired(), message_exists])
    # body = TextAreaField("Body")
    channel_id = IntegerField("Channel ID", validators=[DataRequired()])
    user_id = IntegerField("User ID", validators=[DataRequired()])
    # submit = SubmitField("Submit")


class ChatMessageForm(FlaskForm):
    body = TextAreaField("Body", validators=[DataRequired(), message_exists])
    body = TextAreaField("Body")
    # chat_id = IntegerField("Chat ID", validators=[DataRequired()])
    createdAt = DateTimeField(
        "Created At", default=func.now())
    updatedAt = DateTimeField()
    # submit = SubmitField("Submit")
