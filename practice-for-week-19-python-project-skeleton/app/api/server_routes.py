from flask import Blueprint, render_template, jsonify, request
from ..forms import ChannelForm, ServerForm, EditServerForm, AddServerMember
from app.models.servers import db, Server, Channel, channel_schema, channels_schema, server_schema, servers_schema, server_members_schema
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

@server_routes.route('', methods=["POST"])
def create_server():
    """Create a new channel"""
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        new_server = Server(
            name = data['name'],
            admin_id = current_user.id,
            image_url = data['image_url']
        )

        server_members = [int(server_member)
                        for server_member in data["server_members_lst"].split(",")]
        for server_member in server_members:
            server_user = User.query.get(server_member)
            new_server.server_members.append(server_user)

        db.session.add(new_server)
        db.session.commit()

        success_response = Server.query.order_by(Server.id.desc()).first()
        return jsonify(server_schema.dump(success_response))

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# @server_routes.route('/', methods=["GET"])
# def get_all_servers():
#     """Get all servers"""
#     servers = Server.query.all()
#     # return {'servers': [server.to_dict() for server in servers]}

#     result = servers_schema.dump(servers)
#     return (jsonify(result))

@server_routes.route('/', methods=["GET"])
def user_servers():
    """
    Query for all servers belonging to logged in user and returns them in a list of user dictionaries
    """
    # user = User.query.get(current_user.id)
    user = User.query.get(1)
    servers = user.servers
    servers_list = []
    for server in servers:
        server_members = server.to_dict()["server_members"]
        server_users = [server_member.to_dict() for server_member in server_members]
        server_in_dict = server.to_dict()
        server_in_dict["server_members"] = server_users
        print(server_users, '**USERS**')
        servers_list.append(server_in_dict)
    return jsonify(servers_list)


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

@server_routes.route('<int:server_id>/members', methods=["GET"])
def get_server_members(server_id):
    """Get all server members"""
    server = Server.query.get(server_id)
    server_members = ServerMember.query.filter(ServerMember.server_id == server_id).all()
    if not server:
        return "Server does not exist.", 404
    if server_members:
        result = server_members_schema.dump(server_members)
        return (jsonify(result))
    else:
        return "This server does not have any members yet.", 404

