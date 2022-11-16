from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, FieldList, FormField, Field
from wtforms.validators import DataRequired, ValidationError


class ChatMember(Field):
    chat_participants = IntegerField('Chat Membahs')


class ChatForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    admin_id = IntegerField("Admin ID")
    chat_members_lst = StringField(
        'Chat Members List', validators=[DataRequired()])


class EditChatForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
