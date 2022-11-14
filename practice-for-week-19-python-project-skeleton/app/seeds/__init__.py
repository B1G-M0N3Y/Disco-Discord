from flask.cli import AppGroup
from .users import seed_users, undo_users
from .servers import (
    seed_servers,
    undo_servers,
    seed_channels,
    undo_channels,
    seed_server_members,
    undo_server_members,
    seed_channel_messages,
    undo_channel_messages
)
from .chats import seed_chat_messages, undo_chat_messages, seed_chats, undo_chats
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_servers()
        undo_channels()
        undo_server_members()
        undo_channel_messages()
    seed_users()
    seed_servers()
    seed_channels()
    seed_server_members()
    seed_channel_messages()
    seed_chats()
    seed_chat_messages()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_servers()
    undo_channels()
    undo_server_members()
    undo_channel_messages()
    undo_chat_messages()
    undo_chats()
    # Add other undo functions here
