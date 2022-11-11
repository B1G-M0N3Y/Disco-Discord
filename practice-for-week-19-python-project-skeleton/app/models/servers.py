from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.orm import validates
from flask_marshmallow import Marshmallow
from .db import db

ma = Marshmallow()

class Server(db.Model):
    __tablename__ = "servers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    image_url = db.Column(db.String(255))
    private = db.Column(db.Boolean)
    admin_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    channels = db.relationship("Channel")
    users = db.relationship("User", back_populates="servers")

class Channel(db.Model):
    __tablename__ = "channels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey("servers.id"), nullable=False)

    messages = db.relationship("ChannelMessages")
    server = db.relationship("Server")

class ServerMember(db.Model):
    __tablename__ = "server_members"

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column("server_id", db.Integer, db.ForeignKey("servers.id"))
    user_id = db.Column("user_id", db.Integer, db.ForeignKey("users.id"))

class ChannelMessages(db.Model):
    __tablename__ = "channel_messages"

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    body = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
