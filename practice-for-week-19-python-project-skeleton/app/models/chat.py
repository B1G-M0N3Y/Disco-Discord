from .db import db, ma, environment, SCHEMA, add_prefix_for_prod


# Join Table For Users & Chat Members (Many to Many)
chat_members = db.Table(
    "chat_members",
    db.Column("chat_id",
              db.Integer(),
              db.ForeignKey(add_prefix_for_prod('chats.id')),
              primary_key=True),
    db.Column("user_id",
              db.Integer(),
              db.ForeignKey(add_prefix_for_prod('users.id')),
              primary_key=True)
)

if environment == "production":
    chat_members.schema = SCHEMA


class Chat(db.Model):
    __tablename__ = 'chats'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    adminId = db.Column(db.Integer(), db.ForeignKey(add_prefix_for_prod(
        'users.id')), nullable=False)
    last_message_sent = db.Column(db.DateTime)
    chat_members = db.relationship(
        "User", secondary=chat_members, back_populates="chats")
    # admin = db.relationship("User", viewonly=True)
    chat_messages = db.relationship("ChatMessage", backref="chat")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'adminId': self.adminId,
            'chat_members': self.chat_members,
            'chat_messages': [messages.to_dict() for messages in self.chat_messages],
            'last_message_sent': str(self.last_message_sent)
        }

    def to_dict_json(self):
        unsorted_messages = [messages.to_dict()
                             for messages in self.chat_messages]
        return {
            'id': self.id,
            'name': self.name,
            'adminId': self.adminId,
            'chat_messages': sorted(unsorted_messages, key=lambda message: message["createdAt"]),
            'chat_members': [member.to_dict() for member in self.chat_members]
        }


class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer(), db.ForeignKey(
        add_prefix_for_prod('users.id')), nullable=False)
    chat_id = db.Column(db.Integer(), db.ForeignKey(
        add_prefix_for_prod('chats.id')), nullable=False)
    body = db.Column(db.Text, nullable=False)
    createdAt = db.Column(db.DateTime(), nullable=False)
    updatedAt = db.Column(db.DateTime())
    # many to one (many chatmessages to one user/author)
    author = db.relationship("User", back_populates="chat_messages")

    def to_dict(self):
        return {
            'id': self.id,
            'author_id': self.author_id,
            'chat_id': self.chat_id,
            'body': self.body,
            'createdAt': str(self.createdAt),
            'updatedAt': str(self.updatedAt),
            'author': self.author.to_dict()
        }


class ChatSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "adminId")


class ChatMessageSchema(ma.Schema):
    class Meta:
        fields = ("id", "author_id", "chat_id",
                  "body", "createdAt", "updatedAt")


chat_schema = ChatSchema()
chats_schema = ChatSchema(many=True)

chat_message_schema = ChatMessageSchema()
chat_messages_schema = ChatMessageSchema(many=True)
