from flask_socketio import SocketIO, emit, join_room, leave_room, send
import os
import json
from .models import ChatMessage, User
from flask_login import current_user


# configure cors_allowed_origins
if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        'http://disco-ord.onrender.com',
        'https://disco-ord.onrender.com'
    ]
else:
    origins = "*"

# initialize your socket instance
socketio = SocketIO(cors_allowed_origins=origins)


# handle chat messages
@socketio.on("chat")
def handle_chat(data):
    emit("chat", data, broadcast=True)


@socketio.on("newmessage")
def handle_chat(data):
    print(data, type(data), "DATA*******")
    # data_dict = json.loads(data)
    # print(data_dict, "PRIVATE CHAT DATA************")
    emit("newmessage", data,
         room=data["chat_id"], include_self=False)

@socketio.on("newchat")
def handle_new_chat(data):
    print(data, type(data), "NEW CHAT DATA*******")
    # data_dict = json.loads(data)
    # print(data_dict, "PRIVATE CHAT DATA************")
    emit("newchats", {"data":"new_chat"}, broadcast=True)


@socketio.on("connect")
def connect():
    chats = [chat.to_dict_json()
             for chat in User.query.get(current_user.id).chats]
    print("******USER CONNECTED*******")
    for chat in chats:
        join_room(chat["id"])
        print('user', current_user.id, 'joined chat room ', chat["id"])
    servers = [server.to_dict_json()
               for server in User.query.get(current_user.id).servers]
    for server in servers:
        for channel in server["channels"]:
            print(channel, 'Channel**')
            join_room(channel["id"])
            print('**USER JOINED CHANNEL ROOM ***channel:',
                  channel["id"], 'user:', current_user.id)
    emit("initialize", chats)


# @socketio.on("connect", namespace="/channel")
# def connect_channels():
#     print('CONNECT CHANNEL**')
#     servers = [server.to_dict_json()
#                for server in User.query.get(current_user.id).servers]
#     for server in servers:
#         for channel in server["channels"]:
#             join_room(channel["id"], namespace="/channel",)
#             print('**USER JOINED CHANNEL ROOM ***channel:',
#                   channel["id"], 'user:', current_user.id)
#     emit("initialize", "User joined channel", namespace="/channel")

@socketio.on("channelmessage")
def new_channel_message(message):
    emit("channelmessage", message,
         room=message["channel_id"], include_self=False)


@socketio.on("join")
def on_join(data):
    print(data, "JOIN DATA*****")
    if data["chat_id"] and data["chat_id"] > 0:
        join_room(data["chat_id"])
        print('******USER JOINED ROOM****', "chat:",
              data["chat_id"], "userid:", current_user.id)
        chats = [chat.to_dict_json()
                 for chat in User.query.get(current_user.id).chats]
        print(chats, '**CURRENT USERS CHATS****')
        emit("join", chats)
    else:
        emit("join", {"ROOM": "NOT JOINED"}, broadcast=True)
