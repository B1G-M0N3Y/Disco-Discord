from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, Chat

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


# @ chat_routes.route('/<int:id>')
# def user(id):
#     """
#     Query for a user by id and returns that user in a dictionary
#     """
#     user = User.query.get(id)
#     return user.to_dict()
