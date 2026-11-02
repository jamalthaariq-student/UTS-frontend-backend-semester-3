from app.models import db

class Plant(db.Model):
    __tablename__ = 'plants'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plant_name = db.Column(db.String(100), nullable=False)
    plant_type = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    status = db.Column(db.String(50), default='Baik', nullable=False)
    land_id = db.Column(db.Integer, db.ForeignKey('lands.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "plant_name": self.plant_name,
            "plant_type": self.plant_type,
            "quantity": self.quantity,
            "status": self.status,
            "land_id": self.land_id,
            "land_name": self.land.land_name if self.land else None,
            "location": self.land.location if self.land else None
        }