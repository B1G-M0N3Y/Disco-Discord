from flask_socketio import SocketIO, emit, join_room, leave_room, send
import os
import json
from .models import ChatMessage, User
from flask_login import current_user


# configure cors_allowed_origins
if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        'http://actual-app-url.herokuapp.com',
        'https://actual-app-url.herokuapp.com'
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
    data_dict = json.loads(data)
    print(data_dict, "PRIVATE CHAT DATA************")
    emit("newmessage", data_dict, room=data_dict["chat_id"])


@socketio.on("connect")
def connect():
    chats = [chat.to_dict_json()
             for chat in User.query.get(current_user.id).chats]
    print("******USER CONNECTED*******")
    # print(chats[0].id)
    for chat in chats:
        join_room(chat["id"])
        print('user', current_user.id, 'joined chat room ', chat["id"])
    emit("initialize", chats)


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
