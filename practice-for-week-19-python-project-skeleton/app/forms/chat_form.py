from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField, FieldList, FormField, Form
from wtforms.validators import DataRequired, ValidationError


class ChatMemberForm(Form):
    chat_participants = IntegerField('Chat Membahs')


class ChatForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    admin_id = IntegerField("Admin ID")
    # chat_members = FieldList(IntegerField(
    #     'Chat Members', validators=[DataRequired()]))
    chat_members = IntegerField('Chat Members', validators=[DataRequired()])
    chat_members_lst = FieldList(FormField(IntegerField('Chat Members List')))


class EditChatForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
