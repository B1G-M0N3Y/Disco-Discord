from flask import Blueprint, render_template, jsonify, request
from ..forms import ChannelForm, ServerForm, EditServerForm, AddServerMember
from app.models.servers import db, Server, Channel, channel_schema, channels_schema, server_schema, servers_schema
from flask_login import login_required, current_user
from app.models import User

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
    # if server.admin_id != 1:
    if server.admin_id != current_user.id:
        return {'errors': "authorization required"}, 403
    if server and form.validate_on_submit():
        data = form.data
        new_channel = Channel(
            name=data['name'],
            server_id=server_id
        )

        db.session.add(new_channel)
        db.session.commit()

        success_response = Channel.query.order_by(Channel.id.desc()).first()
        return jsonify(channel_schema.dump(success_response))

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# Get user's servers route handles this now
@server_routes.route('/<int:server_id>/channels', methods=["GET"])
def get_all_channels(server_id):
    """Get all channels by server id"""
    channels = Channel.query.filter(Channel.server_id == server_id).all()
    result = channels_schema.dump(channels)
    return (jsonify(result))

@server_routes.route('/all', methods=["GET"])
def get_all_servers():
    """Get all servers"""
    servers = Server.query.all()

    result = servers_schema.dump(servers)
    return (jsonify(result))

# We are not currently using "public"/"private" servers
@server_routes.route('/public', methods=["GET"])
def get_public_servers():
    """Get all public servers"""
    public_servers = Server.query.filter(Server.private == False).all()
    result = servers_schema.dump(public_servers)
    return (jsonify(result))


@server_routes.route('/<int:server_id>', methods=["GET"])
def get_one_server(server_id):
    """Get one server, include channels"""

    one_server = Server.query.get(server_id)
    if not one_server:
            return {"message": ["Server couldn't be found."]}, 404
    members = one_server.server_members
    channels = one_server.channels

    server_members = one_server.to_dict()["server_members"]
    server_channels = one_server.to_dict()["channels"]
    server_users = [server_member.to_dict() for server_member in server_members]
    channels = [server_channel.to_dict() for server_channel in server_channels]
    server_in_dict = one_server.to_dict()
    server_in_dict["server_members"] = server_users
    server_in_dict["channels"] = channels

    return server_in_dict


@server_routes.route('', methods=["POST"])
def post_new_server():
    """Create a new server"""
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        new_server = Server(
            name = data['name'],
            admin_id = current_user.id,
            image_url = data['image_url'],
        )

        # server_members = [int(server_member)
        #                 for server_member in data["server_members_lst"].split(",")]
        # for server_member in server_members:
        #     server_user = User.query.get(server_member)
        #     new_server.server_members.append(server_user)

        db.session.add(new_server)
        db.session.commit()

        success_response = Server.query.order_by(Server.id.desc()).first()
        return jsonify(server_schema.dump(success_response))

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

@server_routes.route('', methods=["GET"])
def user_servers():
    """
    Get all logged in user's servers, include members, channels, and messages
    """
    user = User.query.get(current_user.id)
    if not user:
            return {"message": ["User couldn't be found."]}, 404
    servers = user.servers
    servers_list = []
    for server in servers:
        server_members = server.to_dict()["server_members"]
        server_channels = server.to_dict()["channels"]
        channels = [server_channel.to_dict() for server_channel in server_channels]
        server_users = [server_member.to_dict() for server_member in server_members]
        server_in_dict = server.to_dict()
        server_in_dict["server_members"] = server_users
        server_in_dict["channels"] = channels
        print(server_users, '**USERS**')
        print(channels, '**CHANNELS**')
        servers_list.append(server_in_dict)
    return jsonify(servers_list)

@server_routes.route('/<int:server_id>/members', methods=["POST"])
@login_required
def post_current_user_add_public_server(server_id):
    "Add User to server by user_id"
    form = AddServerMember()
    server = Server.query.get(server_id)
    # server_members = ServerMember.query.filter_by(server_id=server_id).all()

    members = server.server_members
    server_members = server.to_dict()["server_members"]
    print(server_members, "***SERVER_MEMBERS***")
    server_users = [server_member.to_dict() for server_member in server_members]
    print(server_users, "***SERVER_USERS***")
    server_in_dict = server.to_dict()
    print(server_in_dict, "***SERVER_IN_DICT***")
    # server_in_dict["server_members"] = server_users

    user_exists = User.query.filter(User.id == form.data["user_id"]).all()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not server:
        return {"message": ["Server couldn't be found."]}, 404

    for member in server_users:
        print(member, "MEMBER IN SERVER_USERS")
        print("This is Member User Id:", member["id"])
        # if user doesn't exist (404)
        if not user_exists:
            return {"message": ["User couldn't be found."]}, 404
        # if current user is NOT the admin for this server and current user is NOT the user attempting to be added (403)
        if not current_user.id == server.admin_id and not current_user.id == form.data["user_id"]:
            return {"message": ["You don't have access to add members to this server."]}, 403
        # if current user ALREADY EXISTS, they can not add themselves again (401)
        if member["id"] == current_user.id and not current_user.id == server.admin_id:
            return {"message": ["User is already a member!"]}, 401
            # return {'errors': validation_errors_to_error_messages(form.errors)}, 401
        # if current user is the server admin and userId inputed is already a member in server, they cannot add this new user (401)
        if current_user.id == server.admin_id and member["id"] == form.data["user_id"]:
            return {"message": ["User is already a member!"]}, 401

    # successfully add user if you are either the server admin or the current user adding yourself to server (200)
    if server.admin_id == current_user.id or current_user:
        data = form.data

        id = data['user_id']
        user_to_add = User.query.get(id)

        server_members.append(user_to_add)
        print(server_users, "***APPENDED USERS")

        server.to_dict()["server_members"] = server_members

        db.session.add(server)
        db.session.commit()

        result = server_schema.dump(server)
        return (jsonify(result))

@server_routes.route('/<int:server_id>/members/<int:member_id>', methods=["DELETE"])
@login_required
def delete_user_from_server(server_id, member_id):
    "Delete User from Server (server_id) | Admin (server_admin) can delete user | Current user (current_user) can delete themselves"
    server = Server.query.get(server_id)
    member = User.query.get(member_id)
    server_admin = server.admin_id

    if not server:
        return {"message": ["Server couldn't be found."]}, 404
    if not member:
        return {"message": ["User couldn't be found."]}, 404

    members = server.server_members
    server_members = server.to_dict()["server_members"]
    print(server_members, "***SERVER_MEMBERS***")

    server_users = [server_member.to_dict() for server_member in server_members]
    print(server_users, "***SERVER_USERS***")

    if current_user.id == member_id or current_user.id == server_admin:
        for item in server_members:
            user = item.to_dict()
            print(user, "THIS IS THE USER")
            print(user["id"], "ID")
            if user["id"] == member_id:
                server_members.remove(item)
                print(server_members, "***AFTER DELETE: SERVER_MEMBERS***")

                server.to_dict()["server_members"] = server_members

                db.session.add(server)
                db.session.commit()

                return {"message": ["Successfully Deleted."]}, 200
    return {"message": ["You don't have access to delete members to this server."]}, 403
