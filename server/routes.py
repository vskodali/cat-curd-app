from flask import Blueprint, request, jsonify
from models import db, Cat
import requests
from config import Config
from faker import Faker

fake = Faker()
api_bp = Blueprint('api', __name__)

@api_bp.route('/cats', methods=['GET'])
def get_cats():
    cats = Cat.query.all()
    return jsonify([cat.to_dict() for cat in cats])

@api_bp.route('/cats', methods=['POST'])
def add_cat():
    data = request.json
    new_cat = Cat(
        image_url=data['image_url'],
        name=data['name'],
        description=data['description'],
        origin=data['origin'],
        life_span=data['life_span'],
        breed=data['breed'],
        favorite=data.get('favorite', False)
    )
    db.session.add(new_cat)
    db.session.commit()
    return jsonify(new_cat.to_dict()), 201

@api_bp.route('/cats/<int:id>', methods=['GET'])
def get_cat(id):
    cat = Cat.query.get_or_404(id)
    return jsonify(cat.to_dict())

@api_bp.route('/cats/<int:id>', methods=['PUT'])
def update_cat(id):
    cat = Cat.query.get_or_404(id)
    data = request.json
    cat.name = data.get('name', cat.name)
    cat.description = data.get('description', cat.description)
    cat.origin = data.get('origin', cat.origin)
    cat.life_span = data.get('life_span', cat.life_span)
    cat.breed = data.get('breed', cat.breed)
    cat.favorite = data.get('favorite', cat.favorite)
    db.session.commit()
    return jsonify(cat.to_dict())

@api_bp.route('/cats/<int:id>', methods=['DELETE'])
def delete_cat(id):
    cat = Cat.query.get_or_404(id)
    db.session.delete(cat)
    db.session.commit()
    return '', 204

def fetch_and_store_cats():
    response = requests.get(
        'https://api.thecatapi.com/v1/images/search',
        params={'limit': 100, 'has_breeds': 1},
        headers={'x-api-key': Config.CAT_API_KEY}
    )
    cats_data = response.json()
    for cat_data in cats_data:
        if cat_data['breeds']:
            breed_data = cat_data['breeds'][0]
            new_cat = Cat(
                image_url=cat_data['url'],
                name=fake.name(),
                description=breed_data['description'],
                origin=breed_data['origin'],
                life_span=breed_data['life_span'],
                breed=breed_data['name']
            )
            db.session.add(new_cat)
    db.session.commit()
