from .db import db


# Join Table For Users & Chat Members (Many to Many)
chat_members = db.Table(
    "chat_members",
    db.Column("chat_id",
              db.Integer(),
              db.ForeignKey('chats.id'),
              primary_key=True),
    db.Column("user_id",
              db.Integer(),
              db.ForeignKey('users.id'))
)


class Chat(db.Model):
    __tablename__ = 'chats'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    adminId = db.Column(db.Integer(), nullable=False)
    chat_members = db.relationship(
        "User", secondary=chat_members, back_populates="chat")
    # admin = db.relationship("User", viewonly=True)


class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    authorId = db.Column(db.Integer(), db.ForeignKey(
        'users.id'), nullable=False)
    chatId = db.Column(db.Integer(), nullable=False)
    body = db.Column(db.Text, nullable=False)
    createdAt = db.Column(db.DateTime(), nullable=False)
    updatedAt = db.Column(db.DateTime())
    # many to one (many chatmessages to one user/author)
    author = db.relationship("User", back_populates="chat_messages")