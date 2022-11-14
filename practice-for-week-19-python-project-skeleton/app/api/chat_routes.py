from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Chat, db, ChatMessage
from app.models.chat import chat_schema, chats_schema, chat_messages_schema, chat_message_schema
from ..forms.chat_form import ChatForm
from ..forms.message_form import ChatMessageForm
from sqlalchemy import func
from .server_routes import validation_errors_to_error_messages

chat_routes = Blueprint('chat', __name__)


@chat_routes.route('/')
def chats():
    """
    Query for all chats belonging to logged in user and returns them in a list of user dictionaries
    """
    user = User.query.get(current_user.id)
    chats = user.chats
    chats_list = []
    for chat in chats:
        chat_members = chat.to_dict()["chat_members"]
        chat_users = [chat_member.to_dict() for chat_member in chat_members]
        chat_in_dict = chat.to_dict()
        chat_in_dict["chat_members"] = chat_users
        chats_list.append(chat_in_dict)
    return jsonify(chats_list)


@ chat_routes.route('/', methods=["POST"])
def create_chat():
    """
    Create a new chat
    """
    form = ChatForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        # chat_to = data['chat_members']
        new_chat = Chat(name=data['name'], adminId=current_user.id)
        # chat_to_user = User.query.get(chat_to)
        # new_chat.chat_members.append(chat_to_user)

        chat_members = [int(chat_member)
                        for chat_member in data["chat_members_lst"].split(",")]
        for chat_member in chat_members:
            chat_user = User.query.get(chat_member)
            new_chat.chat_members.append(chat_user)
        db.session.add(new_chat)
        db.session.commit()
        success_response = Chat.query.order_by(Chat.id.desc()).first()
        return jsonify(chat_schema.dump(success_response))
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@ chat_routes.route('/<int:chat_id>', methods=["DELETE"])
def delete_chat(chat_id):
    """
    Query for chat messages by chat id and returns a list of chat messages (list of dictionary)
    """
    chat = Chat.query.get(chat_id)
    chat_messages = ChatMessage.query.filter_by(chat_id=chat_id).all()
    if chat:
        num_of_messages = 0
        for chat_message in chat_messages:
            db.session.delete(chat_message)
            num_of_messages += 1
        db.session.delete(chat)
        db.session.commit()
        return 'Deleted Chat {}, which had {} messages'.format(chat_id, num_of_messages)
    return 'Delete Not Successful'


@ chat_routes.route('/<int:chat_id>')
def get_chat_messages(chat_id):
    """
    Query for chat messages by chat id and returns a list of chat messages (list of dictionary)
    """
    chat_messages = ChatMessage.query.filter_by(chat_id=chat_id).all()
    chat_message_list = [chat_message.to_dict()
                         for chat_message in chat_messages]
    return jsonify(chat_message_list)


@ chat_routes.route('/<int:chat_id>', methods=['POST'])
def post_chat_messages(chat_id):
    """
    Post a new chat message
    """
    chat_messages = ChatMessage.query.filter_by(chat_id=chat_id).all()
    form = ChatMessageForm()
    data = form.data
    print(data, 'FORMDATA****')
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_message = ChatMessage(
            author_id=current_user.id, chat_id=chat_id, body=data['body'], createdAt=func.now())
        db.session.add(new_message)
        db.session.commit()
        created_message = ChatMessage.query.order_by(
            ChatMessage.id.desc()).first()
        return jsonify(chat_message_schema.dumps(created_message))
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@ chat_routes.route('/<int:chat_id>', methods=["PUT"])
def edit_chat_details(chat_id):
    """Edit Chat Name & Chat Members"""
    form = ChatForm()
    chat = Chat.query.get(chat_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if chat and form.validate_on_submit():
        data = form.data
        name = data['name']
        chat.name = name
        chat.chat_members = []
        chat_members = [int(chat_member)
                        for chat_member in data["chat_members_lst"].split(",")]
        for chat_member in chat_members:
            chat_user = User.query.get(chat_member)
            chat.chat_members.append(chat_user)
        db.session.add(chat)
        db.session.commit()
        result = chat_schema.dump(chat)
        return (jsonify(result))
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@ chat_routes.route('/message/<int:chat_message_id>', methods=["PUT"])
def edit_chat_message(chat_message_id):
    """Edit Chat Message"""
    form = ChatMessageForm()
    chat_message = ChatMessage.query.get(chat_message_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if chat_message and form.validate_on_submit():
        data = form.data
        chat_message.body = data['body']
        chat_message.updatedAt = func.now()
        db.session.add(chat_message)
        db.session.commit()
        result = chat_message_schema.dump(chat_message)
        return (jsonify(result))
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@ chat_routes.route('/<int:chat_id>/members')
def get_chat_members(chat_id):
    """
    Query for chat members by chat id
    """
    chat = Chat.query.get(chat_id)
    response = [members.to_dict() for members in chat.chat_members]
    return jsonify(response)
