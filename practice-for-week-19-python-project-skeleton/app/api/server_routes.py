from flask import Blueprint, render_template, jsonify, request
from ..forms import ServerForm
from app.models.servers import db, Channel, Server, channel_schema, channels_schema, server_schema, servers_schema

server_routes = Blueprint('servers', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@channel_routes.route('/<int:server_id>/channels', methods=["POST"])
def post_new_channel(server_id):
    """Create a new channel"""
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_channel = Channel(
            name = data['name'], 
            image_url = data['image_url'], 
            server_id = data['server_id']
        )
        db.session.add(new_channel)
        db.session.commit()
        # response = ChannelMessages.query.order_by(ChannelMessages.id.desc()).first()
        result = channel_message_schema.dump(new_message)
        return (jsonify(result))
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

