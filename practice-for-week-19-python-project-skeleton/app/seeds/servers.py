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
