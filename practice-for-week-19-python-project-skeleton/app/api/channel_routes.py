from flask import Blueprint, render_template, jsonify, request, json
# from .forms import MessageForm
from app.models.servers import db, Channel, ChannelMessages, channel_schema, channels_schema, channel_message_schema,channel_messages_schema

channel_routes = Blueprint('channels', __name__)

@channel_routes.route('/<int:channel_id>', methods=["GET"])
def get_one_channel(channel_id): 
    one_channel = Channel.query.get(channel_id)
    return channel_schema.jsonify(one_channel)   

@channel_routes.route('/<int:channel_id>/messages', methods=["GET"])
def get_channel_messages(channel_id):
    messages = ChannelMessages.query.filter(ChannelMessages.channel_id == channel_id).all()
    result = channel_messages_schema.dump(messages)
    return (jsonify(result))


# @bp.route('/<int:pokemon_id>', methods=['PUT'])
# def update_one_pokemon(pokemon_id):
#     form = PokemonForm()
#     form['csrf_token'].data = request.cookies['csrf_token']
    
#     if form.validate_on_submit(): 
#         data = form.data

#         poke = Pokemon.query.get(pokemon_id)

#         number = data['number']
#         attack = data['attack']
#         defense = data['defense']
#         image_url = data['image_url']
#         name = data['name']
#         type = data['type']
#         moves = data['moves']
        
#         poke.number = number
#         poke.attack = attack
#         poke.defense = defense
#         poke.image_url = image_url
#         poke.name = name
#         poke.type = type
#         poke.moves = moves

#         db.session.add(poke)
#         db.session.commit()

#         return jsonify(pokemon_schema.dump(poke))
