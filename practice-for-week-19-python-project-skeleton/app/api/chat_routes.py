from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Chat, db
from app.models.chat import chat_schema, chats_schema
from ..forms.chat_form import ChatForm

chat_routes = Blueprint('chat', __name__)


@chat_routes.route('/')
def chats():
    """
    Query for all chats belonging to logged in user and returns them in a list of user dictionaries
    """
    user = current_user
    # chats = Chat.query.filter_by(user_id=user.id).all()
    # print(chats)
    return jsonify(['hello from back'])
    return {'chats': [chat.todict() for chat in chats]}


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

        # TO DO GET CHAT MEMBERS IN LIST FORM
        chat_members_lst_str = data["chat_members_lst"].split(",")
        print(data)
        chat_members_lst = [int(chat_member)
                            for chat_member in chat_members_lst_str]
        # for chat_member in chat_members_lst:
        #     print(chat_member)
        #     member = User.query.get(chat_member)
        #     print(member)
        #     new_chat.chat_members.append(member)

        db.session.add(new_chat)
        db.session.commit()
        success_response = Chat.query.order_by(Chat.id.desc()).first()
        return jsonify(chat_schema.dump(success_response))
    print(form.errors)
    return jsonify(form.errors)
    return {'chats': [chat.todict() for chat in chats]}


# @ chat_routes.route('/<int:id>')
# def get_chat(id):
#     """
#     Query for a user by id and returns that user in a dictionary
#     """
#     user = User.query.get(id)
#     return user.to_dict()
