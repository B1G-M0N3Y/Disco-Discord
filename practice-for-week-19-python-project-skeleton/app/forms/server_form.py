from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, ValidationError

def name_exists(form, field):
    # Checking if message body exists
    name = form.data['name']
    if not name:
        raise ValidationError('Channel name must be provided.')

class ServerForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()], name_exists)
    image_url = StringField("Image URL")
    private = BooleanField("Private")
    admin_id = IntegerField("Admin", validators=[DataRequired()])

class ChannelForm(FlaskForm):
    name = StringField("Name",validators=[DataRequired(), name_exists])
    server_id = IntegerField("Channel ID", validators=[DataRequired()])
