from ..models.chat import Chat, ChatMessage, db
from ..models import SCHEMA, environment
from sqlalchemy import func


def seed_chats():
    chat1 = Chat(name='Chat 1', adminId=2)
    chat2 = Chat(name='Chat 2', adminId=1)
    chat3 = Chat(name='Chat 3', adminId=3)
    chat4 = Chat(name='Chat 4', adminId=1)
    chat5 = Chat(name='Chat 5', adminId=1)
    chat6 = Chat(name='Chat 6', adminId=3)
    chat7 = Chat(name='Chat 7', adminId=2)

    db.session.add(chat1)
    db.session.add(chat2)
    db.session.add(chat3)
    db.session.add(chat4)
    db.session.add(chat5)
    db.session.add(chat6)
    db.session.add(chat7)
    db.session.commit()


def seed_chat_members():
    chat1 = Chat(name='Chat 1', adminId=2)
    chat2 = Chat(name='Chat 2', adminId=1)
    chat3 = Chat(name='Chat 3', adminId=3)
    chat4 = Chat(name='Chat 4', adminId=1)
    chat5 = Chat(name='Chat 5', adminId=1)
    chat6 = Chat(name='Chat 6', adminId=3)
    chat7 = Chat(name='Chat 7', adminId=2)

    db.session.add(chat1)
    db.session.add(chat2)
    db.session.add(chat3)
    db.session.add(chat4)
    db.session.add(chat5)
    db.session.add(chat6)
    db.session.add(chat7)
    db.session.commit()


def seed_chat_messages():
    msg1 = ChatMessage(
        chat_id=1,
        author_id=1,
        body="Let's boogie, everybody!",
        createdAt=func.now()
    )
    msg2 = ChatMessage(
        chat_id=2,
        author_id=1,
        body="I'll buy everyone a round!",
        createdAt=func.now()
    )
    msg3 = ChatMessage(
        chat_id=1,
        author_id=2,
        body="Shake yo booty!",
        createdAt=func.now()
    )
    msg4 = ChatMessage(
        chat_id=2,
        author_id=3,
        body="Orange juice, no pulp.",
        createdAt=func.now()
    )
    msg5 = ChatMessage(
        chat_id=3,
        author_id=3,
        body="And here's Wonderwall!",
        createdAt=func.now()
    )
    msg6 = ChatMessage(
        chat_id=4,
        author_id=3,
        body="I am SPEED",
        createdAt=func.now()
    )

    db.session.add(msg1)
    db.session.add(msg2)
    db.session.add(msg3)
    db.session.add(msg4)
    db.session.add(msg5)
    db.session.add(msg6)
    db.session.commit()


def undo_chat_messages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.chat_messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM chat_messages")
    db.session.commit()


def undo_chats():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.chats RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM chats")
    db.session.commit()
