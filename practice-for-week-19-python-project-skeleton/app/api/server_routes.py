from flask import Blueprint, render_template, jsonify, request
from ..forms import ChannelForm, ServerForm, EditServerForm, AddServerMember
from app.models.servers import db, ServerMember, Channel, Server, channel_schema, channels_schema, server_schema, servers_schema, server_member_schema, server_members_schema
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
            name=data['name'],
            server_id=server_id
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


@server_routes.route('/members', methods=["GET"])
def get_all_members():
    """Get all servers"""
    servers = ServerMember.query.all()
    result = server_members_schema.dump(servers)
    return (jsonify(result))


@server_routes.route('/public', methods=["GET"])
def get_public_servers():
    """Get all public servers"""
    public_servers = Server.query.filter(Server.private == False).all()
    result = servers_schema.dump(public_servers)
    return (jsonify(result))


@server_routes.route('/<int:server_id>', methods=["GET"])
def get_one_server(server_id):
    """Get one server"""
    one_server = Server.query.get(server_id)
    result = server_schema.dump(one_server)
    return (jsonify(result))


@server_routes.route('', methods=["POST"])
def post_new_server():
    """Create a new server"""
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_server = Server(
            name=data['name'],
            admin_id=data['admin_id'],
            image_url=data['image_url']
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


@server_routes.route('/<int:server_id>/members', methods=["POST"])
@login_required
def post_current_user_add_public_server(server_id):
    "Add User to server by user_id"
    form = AddServerMember()
    server = Server.query.get(server_id)
    server_members = ServerMember.query.filter_by(server_id=server_id).all()
    user_exists = User.query.filter(User.id == form.data["user_id"]).all()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not server:
        return {"message": ["Server couldn't be found."]}, 404

    for member in server_members:
        print("This is Member User Id:", member.user_id)
        # if user doesn't exist (404)
        if not user_exists:
            return {"message": ["User couldn't be found."]}, 404
        # if current user is NOT the admin for this server and current user is NOT the user attempting to be added (403)
        if not current_user.id == server.admin_id and not current_user.id == form.data["user_id"]:
            return {"message": ["You don't have access to add members to this server."]}, 403
        # if current user ALREADY EXISTS, they can not add themselves again (401)
        if member.user_id == current_user.id and not current_user.id == server.admin_id:
            return {"message": ["User is already a member!"]}, 401
            # return {'errors': validation_errors_to_error_messages(form.errors)}, 401
        # if current user is the server admin and userId inputed is already a member in server, they cannot add this new user (401)
        if current_user.id == server.admin_id and member.user_id == form.data["user_id"]:
            return {"message": ["User is already a member!"]}, 401

    # successfully add user if you are either the server admin or the current user adding yourself to server (200)
    if server.admin_id == current_user.id or current_user:
        data = form.data
        new_member = ServerMember(
            user_id=data['user_id'],
            server_id=server_id
        )
        db.session.add(new_member)
        db.session.commit()
        result = server_member_schema.dump(new_member)
        return (jsonify(result))


@server_routes.route('/<int:server_id>/members/<int:member_id>', methods=["DELETE"])
@login_required
def delete_user_from_server(server_id, member_id):
    "Delete User from Server (server_id) | Admin (server_admin) can delete user | Current user (current_user) can delete themselves"
    server = Server.query.get(server_id)
    server_admin = server.admin_id
    member = db.session.query(ServerMember).filter(
        ServerMember.user_id == member_id).filter(ServerMember.server_id == server_id).first()

    if not server:
        return {"message": ["Server couldn't be found."]}, 404
    if not member:
        return {"message": ["User couldn't be found."]}, 404

    if current_user.id == member_id or current_user.id == server_admin:
        db.session.delete(member)
        db.session.commit()
        return {"message": ["Successfully Deleted."]}, 200
    return {"message": ["You don't have access to delete members to this server."]}, 403


@server_routes.route('/current', methods=["GET"])
@login_required
def get_servers_by_current_user():
    "Get Servers owner by current user"
    servers = Server.query.filter_by(admin_id=current_user.id).all()
    result = servers_schema.dump(servers)
    return (jsonify(result))

# Servers | Completed
# get all public servers
# create new server
# edit an existing server
# delete server by id
# add user by user_id (2x)
    # Add User to server by user_id: Current User adds themselves to public server
    # Add User to server by user_id: Must be Server admin
# delete user from server by user_id (2x)
    # Current User (current_user) deletes themselves from Server (server_id)
    # Add User to server by user_id: Must be Server admin
# get servers by current user_id

# Channels | Completed in server_route
# create a new channel
# get all channels by server id


@server_routes.route('<int:server_id>/members', methods=["GET"])
def get_server_members(server_id):
    """Get all server members"""
    server = Server.query.get(server_id)
    server_members = ServerMember.query.filter(
        ServerMember.server_id == server_id).all()
    if not server:
        return "Server does not exist.", 404
    if server_members:
        result = server_members_schema.dump(server_members)
        return (jsonify(result))
    else:
        return "This server does not have any members yet.", 404

# TODO - this route has bugs
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
