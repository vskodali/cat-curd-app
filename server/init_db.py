from app import create_app
from models import db
from routes import fetch_and_store_cats

app = create_app()
with app.app_context():
    db.create_all()
    fetch_and_store_cats()
