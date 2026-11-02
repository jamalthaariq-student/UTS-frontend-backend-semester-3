from flask import Flask
from app.config import Config
from app.models import db
from app.models.user_model import User
from app.models.land_model import Land
from app.models.plant_model import Plant
from app.routes.user_routes import user_bp
from app.routes.land_routes import land_bp
from app.routes.plant_routes import plant_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inisialisasi Database ORM
    db.init_app(app)

    # Registrasi Blueprints RESTful API
    app.register_blueprint(user_bp)
    app.register_blueprint(land_bp)
    app.register_blueprint(plant_bp)

    # Otomatis buat seluruh tabel MySQL di db_mytani_backend
    with app.app_context():
        db.create_all()

    return app