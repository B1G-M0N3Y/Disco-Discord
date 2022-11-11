from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

class Server(db.Model):
    __tablename__ = "servers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    image_url = db.Column(db.String(255))
    admin_id = db.Column(db.Integer, nullable=False)
    private = db.Column(db.Boolean)

    channels = db.relationship("Channel")
    users = db.relationship("User", back_populates="servers")

class Channel(db.Model):
    __tablename__ = "channels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey("servers.id"), nullable=False)

class ServerMember(db.Model):
    __tablename__ = "server_members"

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column("server_id", db.Integer, db.ForeignKey("server.id"))
    user_id = db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
