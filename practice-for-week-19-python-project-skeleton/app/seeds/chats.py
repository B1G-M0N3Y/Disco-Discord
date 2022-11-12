from ..models.chat import ChatMessage, db
from ..models import SCHEMA, environment
from sqlalchemy import func


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
            f"TRUNCATE table {SCHEMA}.channel_messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM chat_messages")
    db.session.commit()
