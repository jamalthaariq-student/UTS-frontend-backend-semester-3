from app.models import db

class Land(db.Model):
    __tablename__ = 'lands'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    land_name = db.Column(db.String(100), nullable=False)
    soil_type = db.Column(db.String(50), nullable=False)
    area_size = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Aktif', nullable=False)
    location = db.Column(db.String(150), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relasi 1:N -> 1 Lahan memiliki Banyak Tanaman (Cascade Delete)
    plants = db.relationship('Plant', backref='land', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "land_name": self.land_name,
            "soil_type": self.soil_type,
            "area_size": self.area_size,
            "status": self.status,
            "location": self.location,
            "user_id": self.user_id,
            "owner_username": self.owner.username if self.owner else None,
            "total_plants": len(self.plants)
        }