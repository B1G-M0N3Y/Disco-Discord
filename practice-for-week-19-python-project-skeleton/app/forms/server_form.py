from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, ValidationError

class ServerForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    image_url = StringField("Image URL")
    private = BooleanField("Private")
    admin_id = IntegerField("Admin", validators=[DataRequired()])

class ChannelForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    server_id = IntegerField("Server ID")

class EditChannelForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])

class EditServerForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    image_url = StringField("Image URL")
    private = BooleanField("Private", default=True)
