from flask_socketio import SocketIO, emit, join_room, leave_room, send
import os
import json


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
    emit("chat", data, broadcast=True);

@socketio.on("privatechat")
def handle_chat(data):
    data_dict = json.loads(data)
    print(data_dict, "PRIVATE CHAT DATA************")
    emit("privatechat", data_dict, room=data_dict["chat_id"]);

 
@socketio.on("connect")
def connect(socket):
    print("******USER CONNECTED*******")

    
    
@socketio.on("join")
def on_join(data):
    if data["chat_id"] > 0:
        join_room(data["chat_id"])
        print('******USER JOINED ROOM****', data["chat_id"])
        emit( "join", {"ROOM": "JOINED"})
    else:
        emit("join", {"ROOM": "NOT JOINED"}, broadcast=True)

