from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Chat, db, ChatMessage
from app.models.chat import chat_schema, chats_schema, chat_messages_schema, chat_message_schema
from ..forms.chat_form import ChatForm
from ..forms.message_form import ChatMessageForm
from sqlalchemy import func

chat_routes = Blueprint('chat', __name__)


@chat_routes.route('/')
def chats():
    """
    Query for all chats belonging to logged in user and returns them in a list of user dictionaries
    """
    # TODO UPDATE current_user_id
    current_user_id = 2
    user = User.query.get(current_user_id)
    print(user.chats)
    return jsonify(chats_schema.dump(user.chats))


@chat_routes.route('/', methods=["POST"])
def create_chat():
    """
    Create a new chat
    """
    form = ChatForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        # chat_members_lst = data["chat_members"]
        chat_to = data['chat_members']
        # TODO REMOVE HARDCODING ADMIN ID AND USE current_user
        new_chat = Chat(name=data['name'], adminId=1)
        chat_to_user = User.query.get(chat_to)
        new_chat.chat_members.append(chat_to_user)

        # TODO GET CHAT MEMBERS IN LIST FORM
        # chat_members_lst_str = data["chat_members_lst"].split(",")
        # print(data)
        # chat_members_lst = [int(chat_member)
        #                     for chat_member in chat_members_lst_str]
        # for chat_member in chat_members_lst:
        #     print(chat_member)
        #     member = User.query.get(chat_member)
        #     print(member)
        #     new_chat.chat_members.append(member)

        db.session.add(new_chat)
        db.session.commit()
        success_response = Chat.query.order_by(Chat.id.desc()).first()
        return jsonify(chat_schema.dump(success_response))
    return jsonify(form.errors)
    return {'chats': [chat.todict() for chat in chats]}


@ chat_routes.route('/<int:chat_id>', methods=["DELETE"])
def delete_chat(chat_id):
    """
    Query for chat messages by chat id and returns a list of chat messages (list of dictionary)
    """
    chat = Chat.query.get(chat_id)
    chat_messages = ChatMessage.query.filter_by(chat_id=chat_id).all()
    print(chat_messages, 'CHATMESSAGES***')
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
    return jsonify(chat_messages_schema.dumps(chat_messages))


@ chat_routes.route('/<int:chat_id>', methods=['POST'])
def post_chat_messages(chat_id):
    """
    Post a new chat message
    """
    chat_messages = ChatMessage.query.filter_by(chat_id=chat_id).all()
    form = ChatMessageForm()
    # TODO use current_user for id below
    current_user_id = 2
    data = form.data
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_message = ChatMessage(
            author_id=current_user_id, chat_id=chat_id, body=data['body'], createdAt=func.now())
        print(new_message)
        db.session.add(new_message)
        db.session.commit()
        created_message = ChatMessage.query.order_by(
            ChatMessage.id.desc()).first()
        return jsonify(chat_message_schema.dumps(created_message))
    return jsonify(form.errors)


@chat_routes.route('/<int:chat_id>', methods=["PUT"])
def edit_chat_details(chat_id):
    """Edit Chat"""
    form = ChatForm()
    chat = Chat.query.get(chat_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if chat and form.validate_on_submit():
        data = form.data
        name = data['name']
        chat.name = name
        # TODO EDIT MEMBERS LIST
        db.session.add(chat)
        db.session.commit()
        result = chat_schema.dump(chat)
        return (jsonify(result))
    return jsonify(form.errors, 'Edit Not Successful')


@chat_routes.route('/message/<int:chat_message_id>', methods=["PUT"])
def edit_chat_message(chat_message_id):
    """Edit Chat Message"""
    form = ChatMessageForm()
    chat_message = ChatMessage.query.get(chat_message_id)
    form['csrf_token'].data = request.cookies['csrf_token']
    if chat_message and form.validate_on_submit():
        data = form.data
        chat_message.body = data['body']
        chat_message.updatedAt = func.now()
        # TODO EDIT MEMBERS LIST
        db.session.add(chat_message)
        db.session.commit()
        result = chat_message_schema.dump(chat_message)
        return (jsonify(result))
    return jsonify(form.errors, 'Edit Not Successful')
