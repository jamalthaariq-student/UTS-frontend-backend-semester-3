from app.models import db
from app.models.plant_model import Plant

class PlantRepository:
    def get_paginated_and_search(self, page=1, per_page=5, search_query=None, status_filter=None):
        query = Plant.query
        if search_query:
            query = query.filter(Plant.plant_name.ilike(f"%{search_query}%"))
        if status_filter and status_filter != 'Semua':
            query = query.filter(Plant.status == status_filter)

        return query.paginate(page=page, per_page=per_page, error_out=False)

    def get_by_id(self, plant_id):
        return db.session.get(Plant, plant_id)

    def create(self, plant_name, plant_type, quantity, land_id, status='Baik'):
        new_plant = Plant(
            plant_name=plant_name,
            plant_type=plant_type,
            quantity=quantity,
            land_id=land_id,
            status=status
        )
        db.session.add(new_plant)
        db.session.commit()
        return new_plant

    def update(self, plant, data):
        plant.plant_name = data.get('plant_name', plant.plant_name)
        plant.plant_type = data.get('plant_type', plant.plant_type)
        plant.quantity = int(data.get('quantity', plant.quantity))
        plant.status = data.get('status', plant.status)
        db.session.commit()
        return plant

    def delete(self, plant):
        db.session.delete(plant)
        db.session.commit()
        return True