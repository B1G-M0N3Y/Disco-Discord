from sqlalchemy import func
from sqlalchemy.orm import validates
from .db import db, ma, environment, SCHEMA


class Server(db.Model):
    __tablename__ = "servers"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255))
    admin_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    channels = db.relationship("Channel", back_populates="server")
    users = db.relationship("User", back_populates="servers")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'admin_id': self.admin_id,
            'image_url': self.image_url
        }


class Channel(db.Model):
    __tablename__ = "channels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey(
        "servers.id"), nullable=False)

    messages = db.relationship("ChannelMessages")
    server = db.relationship("Server", back_populates="channels")

    def to_dict(self):
        return {
            id: self.id,
            name: self.name,
            server_id: self.server_id
        }


class ServerMember(db.Model):
    __tablename__ = "server_members"

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column("server_id", db.Integer, db.ForeignKey("servers.id"))
    user_id = db.Column("user_id", db.Integer, db.ForeignKey("users.id"))


class ChannelMessages(db.Model):
    __tablename__ = "channel_messages"

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    body = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    # channel = db.relationship("Channel")


class ServerSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "image_url",
            "name",
            "admin_id")


class ChannelSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "name",
            "server_id")


class ServerMemberSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "server_id",
            "user_id")


class ChannelMessagesSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "channel_id",
            "user_id",
            "body",
            "created_at",
            "updated_at")


server_schema = ServerSchema()
servers_schema = ServerSchema(many=True)

channel_schema = ChannelSchema()
channels_schema = ChannelSchema(many=True)

server_member_schema = ServerMemberSchema()
server_members_schema = ServerMemberSchema(many=True)

channel_message_schema = ChannelMessagesSchema()
channel_messages_schema = ChannelMessagesSchema(many=True)
