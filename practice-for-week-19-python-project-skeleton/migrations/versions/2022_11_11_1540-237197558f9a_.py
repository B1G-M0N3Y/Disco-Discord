"""empty message

Revision ID: 237197558f9a
Revises: daa0f4d51744
Create Date: 2022-11-11 15:40:27.029241

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '237197558f9a'
down_revision = 'daa0f4d51744'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('servers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('image_url', sa.String(length=255), nullable=True),
    sa.Column('admin_id', sa.Integer(), nullable=False),
    sa.Column('private', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('channels',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('server_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['server_id'], ['servers.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('server_members',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('server_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['server_id'], ['servers.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('server_members')
    op.drop_table('channels')
    op.drop_table('servers')
    # ### end Alembic commands ###
