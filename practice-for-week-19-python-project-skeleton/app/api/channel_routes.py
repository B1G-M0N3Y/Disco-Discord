from flask import Blueprint, render_template, jsonify, request
from ..forms import MessageForm, EditChannelForm
from app.models.servers import db, Channel, ChannelMessages, channel_schema, channels_schema, channel_message_schema,channel_messages_schema
from flask_login import login_required, current_user

channel_routes = Blueprint('channels', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@channel_routes.route('/<int:channel_id>', methods=["GET"])
def get_one_channel(channel_id):
    """
    Get channel details by id and all associated messages
    """
    one_channel = Channel.query.get(channel_id)
    channel_in_dict = one_channel.to_dict()
    return jsonify(channel_in_dict)

# no longer need this route because messages get loaded with channels
@channel_routes.route('/<int:channel_id>/messages', methods=["GET"])
def get_channel_messages(channel_id):
    """
    Get all messages by channel id
    """
    messages = ChannelMessages.query.filter(ChannelMessages.channel_id == channel_id).all()
    result = [message.to_dict() for message in messages]
    # result = channel_messages_schema.dump(messages)
    return (jsonify(result))

@channel_routes.route('/messages/<int:message_id>', methods=["DELETE"])
def delete_channel_message(message_id):
    """
    Delete message by id
    """
    message = ChannelMessages.query.get(message_id)
    if not message:
        return {"message": ["Message couldn't be found."]}, 404

    db.session.delete(message)
    db.session.commit()
    result = channel_message_schema.dump(message)
    return {"message": ["Message deleted."]}, 200

# TODO double check form setup for this route
@channel_routes.route('/<int:channel_id>', methods=["POST"])
def post_channel_message(channel_id):
    """
    Create a new channel message
    """
    channel_messages = ChannelMessages.query.filter_by(channel_id=channel_id).all()
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_message = ChannelMessages(
            body = data['body'],
            channel_id = channel_id,
            user_id = current_user.id
        )
        db.session.add(new_message)
        db.session.commit()
        result = channel_message_schema.dump(new_message)
        return (jsonify(result))
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@channel_routes.route('/<int:channel_id>', methods=["PUT"])
def edit_channel_details(channel_id):
    """
    Edit a channel by id
    """
    form = EditChannelForm()
    channel = Channel.query.get(channel_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if channel and form.validate_on_submit():
        data = form.data
        name = data['name']
        channel.name = name
        db.session.add(channel)
        db.session.commit()
        return jsonify(channel_schema.dump(channel))
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@channel_routes.route('/<int:channel_id>', methods=["DELETE"])
def delete_channel(channel_id):
    """
    Delete a channel by id
    """
    channel = Channel.query.get(channel_id)
    if channel:
        messages = channel.messages
        for message in messages:
                db.session.delete(message)
        db.session.delete(channel)
        db.session.commit()
        result = channel_schema.dump(channel)
        return {"message": ["Channel deleted."]}, 200
    else:
        return "Channel not found.", 404

# Channel Completed
# Get Details of Channel by Id
# Create a channel (server_route)
# Update Channel Details by id
# Delete a Channel

# Channel-Messages Completed
# Get all messages by channel id
# Delete message by id
# Post new channel message
