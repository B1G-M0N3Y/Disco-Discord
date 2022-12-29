from app.models import db, User, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo',
        email='demo@aa.io',
        password='password',
        first_name='Demo',
        last_name='User',
        image_url='https://disco-ord.s3.us-west-1.amazonaws.com/Appacademylogo.png')
    marnie = User(
        username='marnie',
        email='marnie@aa.io',
        password='password',
        first_name='Marnie',
        last_name='User',
        image_url='https://i.gyazo.com/7b76c00f918ad31422b7d904912fe749.png')
    bobbie = User(
        username='bobbie',
        email='bobbie@aa.io',
        password='password',
        first_name='Bob',
        last_name='User',
        image_url='https://i1.sndcdn.com/avatars-fmUjIuJXtnxsyFei-rniA7g-t500x500.jpg')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")

    db.session.commit()
