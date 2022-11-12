from app.models import db, Server, Channel, ServerMember, ChannelMessages, environment, SCHEMA

def seed_servers():
    odyssey = Server(
        name ="The Odyssey",
        image_url = "image.jpg",
        admin_id = 1,
        private=True,
    )
    dance_city = Server(
        name ="Dance City",
        image_url = "image.jpg",
        admin_id = 2,
        private=False,
    )
    cars = Server(
        name ="The Movie Cars",
        image_url = "image.jpg",
        admin_id = 3,
        private=True,
    )

    db.session.add(odyssey)
    db.session.add(dance_city)
    db.session.add(cars)
    db.session.commit()

def undo_servers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM servers")

    db.session.commit()

def seed_channels():
    dance_floor=Channel(
        name="Dance-Floor",
        server_id=1
    )
    bar=Channel(
        name="The Bar",
        server_id=1
    )
    booth=Channel(
        name="DJ Booth",
        server_id=2
    )
    racetrack=Channel(
        name="The Piston Cup",
        server_id=3
    )

    db.session.add(dance_floor)
    db.session.add(bar)
    db.session.add(booth)
    db.session.add(racetrack)
    db.session.commit()

def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM channels")
    db.session.commit()

def seed_server_members():
    user1 = ServerMember(
        server_id = 1,
        user_id = 1
    )
    user2 = ServerMember(
        server_id = 2,
        user_id = 1
    )
    user3 = ServerMember(
        server_id = 2,
        user_id = 2
    )
    user4 = ServerMember(
        server_id = 3,
        user_id = 2
    )
    user5 = ServerMember(
        server_id = 1,
        user_id = 3
    )
    user6 = ServerMember(
        server_id = 3,
        user_id = 3
    )

    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.add(user4)
    db.session.add(user5)
    db.session.add(user6)
    db.session.commit()

def undo_server_members():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.server_members RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM server_members")
    db.session.commit()

def seed_channel_messages():
    msg1 = ChannelMessages(
        channel_id = 1,
        user_id = 1,
        body = "Let's boogie, everybody!"
    )
    msg2 = ChannelMessages(
        channel_id = 2,
        user_id = 1,
        body = "I'll buy everyone a round!"
    )
    msg3 = ChannelMessages(
        channel_id = 1,
        user_id = 2,
        body = "Shake yo booty!"
    )
    msg4 = ChannelMessages(
        channel_id = 2,
        user_id = 3,
        body = "Orange juice, no pulp."
    )
    msg5 = ChannelMessages(
        channel_id = 3,
        user_id = 3,
        body = "And here's Wonderwall!"
    )
    msg6 = ChannelMessages(
        channel_id = 4,
        user_id = 3,
        body = "I am SPEED"
    )

    db.session.add(msg1)
    db.session.add(msg2)
    db.session.add(msg3)
    db.session.add(msg4)
    db.session.add(msg5)
    db.session.add(msg6)
    db.session.commit()

def undo_channel_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channel_messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM channel_messages")
    db.session.commit()