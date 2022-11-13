from flask import Blueprint, render_template, jsonify, request
from ..forms import ChannelForm, ServerForm, EditServerForm, AddServerMember
from app.models.servers import db, ServerMember, Channel, Server, channel_schema, channels_schema, server_schema, servers_schema, server_member_schema
from app.models.user import User
from flask_login import current_user, login_required

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
    # return {'servers': [server.to_dict() for server in servers]}

    result = servers_schema.dump(servers)
    return (jsonify(result))

@server_routes.route('/public', methods=["GET"])
def get_public_servers():
    """Get all public servers"""
    public_servers = Server.query.filter(Server.private == False).all()
    result = servers_schema.dump(public_servers)
    return (jsonify(result))

@server_routes.route('', methods=["POST"])
def post_new_server():
    """Create a new server"""
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
    """Edit an existing server"""
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

# this route has bugs
# @server_routes.route('<int:server_id>/members', methods=["POST"])
# def post_server_member(server_id):
#     """Add a member to a server"""
#     form = AddServerMember()
#     form['csrf_token'].data = request.cookies['csrf_token']
#     server = Server.query.get(server_id)
#     if form.validate_on_submit():
#         data = form.data
#         new_member = ServerMember(
#             server_id = server_id,
#             user_id = data['user_id']
#         )
#         db.session.add(new_member)
#         db.session.commit()
#         result = server_member_schema.dump(new_member)
#         return (jsonify(result))
#     return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# KRIS' CODE BELOW (3x)

@server_routes.route('/<int:server_id>/members', methods=["POST"])
@login_required
def post_server_member(server_id):
    "Add User to server by user_id"
    form = AddServerMember()
    server = Server.query.get(server_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    # if not server:
    #     return {'errors': validation_errors_to_error_messages(form.errors)}, 404
    # if server and Member.query.filter(server_id == server).all():
    if server:
        data = form.data
        new_member = ServerMember(
            server_id = server_id,
            user_id = data['user_id']
        )
        db.session.add(new_member)
        db.session.commit()
        result = server_member_schema.dump(new_member)
        return (jsonify(result))
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
    # make sure the server is public
    # server admin can also add user

@server_routes.route('/<int:server_id>/members/:member_id', methods=["DELETE"])
@login_required
def current_user_delete_from_server(server_id, member_id):
    "Current User (current_user) deletes themselves from Server (server_id)"
    server = Server.query.get(server_id)
    member = ServerMember.query.get(id)
    # user = User.query.get(current_user)
    if server and member == member_id:
        db.session.delete(member)
        db.session.commit()
        result = server_member_schema.dump(member)
        return (jsonify(result))
    else:
        return "User not found."

@server_routes.route('/<int:server_id>/members/:member_id', methods=["DELETE"])
def server_admin_delete_user_from_server(server_id, member_id):
    "The Server Owner (admin_id) deletes User (user_id) from Server (server_id)"
    server = Server.query.get(server_id)
    server_admin = Server.query.get(server.admin_id)
    # user = User.query.get(current_user)
    if server and server_admin and current_user == member_id:
        db.session.delete(member_id)
        db.session.commit()
        result = server_member_schema.dump(member_id)
        return (jsonify(result))
    else:
        return "You are not the Server Admin / User not found."

@server_routes.route('/current', methods=["GET"])
def get_servers_by_current_user():
    # user = User.query.get(current_user)
    servers = Server.query.filter(Server.user_id == current_user.id).all()
    result = server_schema.dump(servers)
    return (jsonify(result))

# needs to be created
# add user by user_id (completed but not tested)
# delete user from server by user_id (completed but not tested)
# get servers by current user_id

# Servers | Completed
# get all public servers
# create new server
# edit an existing server
# delete server by id

# Channels | Completed in server_route
# create a new channel
# get all channels by server id
