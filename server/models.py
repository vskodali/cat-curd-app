from flask_sqlalchemy import SQLAlchemy
from faker import Faker

db = SQLAlchemy()
fake = Faker()

class Cat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String, nullable=True)
    name = db.Column(db.String, default=fake.name)
    description = db.Column(db.String)
    origin = db.Column(db.String)
    life_span = db.Column(db.String)
    breed = db.Column(db.String)
    favorite = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'image_url': self.image_url,
            'name': self.name,
            'description': self.description,
            'origin': self.origin,
            'life_span': self.life_span,
            'breed': self.breed,
            'favorite': self.favorite
        }
