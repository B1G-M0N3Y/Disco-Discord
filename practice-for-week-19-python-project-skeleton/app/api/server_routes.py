from flask import Blueprint, render_template, jsonify, request
from ..forms import ChannelForm, ServerForm, EditServerForm
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

@server_routes.route('/<int:server_id>/channels', methods=["POST"])
def post_new_channel(server_id):
    """Create a new channel"""
    form = ChannelForm()
    server = Server.query.get(server_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if server and form.validate_on_submit():
        data = form.data
        new_channel = Channel(
            name = data['name'], 
            server_id = server_id
        )
        db.session.add(new_channel)
        db.session.commit()
        result = channel_schema.dump(new_channel)
        return (jsonify(result))
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@server_routes.route('/<int:server_id>/channels', methods=["GET"])
def get_all_channels(server_id):
    """Get all channels by server id"""
    channels = Channel.query.filter(Channel.server_id == server_id).all()
    result = channels_schema.dump(channels)
    return (jsonify(result))

@server_routes.route('/', methods=["GET"])
def get_all_servers():
    """Get all servers"""
    servers = Server.query.all()
    return {'servers': [server.to_dict() for server in servers]}

    # result = servers_schema.dump(servers)
    # return (jsonify(result))     

@server_routes.route('/public', methods=["GET"])
def get_public_servers():
    """Get all public servers"""
    public_servers = Server.query.filter(Server.private == False).all()
    result = servers_schema.dump(public_servers)
    return (jsonify(result))    

@server_routes.route('', methods=["POST"])
def post_new_server():
    """Create a new channel"""
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_server = Server(
            name = data['name'], 
            admin_id = data['admin_id'], 
            image_url = data['image_url']
        )
        db.session.add(new_server)
        db.session.commit()
        result = server_schema.dump(new_server)
        return (jsonify(result))
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@server_routes.route('/<int:server_id>', methods=["PUT"])
def edit_server_details(server_id):
    """Create a new channel"""
    form = EditServerForm()
    server = Server.query.get(server_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if server and form.validate_on_submit():
        data = form.data
        name = data['name']
        image_url = data['image_url']
        server.name = name
        server.image_url = image_url
        db.session.add(server)
        db.session.commit()
        result = server_schema.dump(server)
        return (jsonify(result))
    return "Server not found", 404

@server_routes.route('/<int:server_id>', methods=["DELETE"])
def delete_server(server_id):
    """Delete a server by id"""
    server = Server.query.get(server_id)
    if server:
        db.session.delete(server)
        db.session.commit()
        result = channel_schema.dump(server)
        return (jsonify(result))
    else: 
        return "Server not found.", 404