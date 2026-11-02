from app.models import db
from app.models.land_model import Land

class LandRepository:
    def get_paginated_and_search(self, page=1, per_page=5, search_query=None, status_filter=None):
        query = Land.query
        if search_query:
            query = query.filter(
                (Land.land_name.ilike(f"%{search_query}%")) |
                (Land.location.ilike(f"%{search_query}%"))
            )
        if status_filter and status_filter != 'Semua':
            query = query.filter(Land.status == status_filter)

        return query.paginate(page=page, per_page=per_page, error_out=False)

    def get_by_id(self, land_id):
        return db.session.get(Land, land_id)

    def create(self, land_name, soil_type, area_size, location, user_id, status='Aktif'):
        new_land = Land(
            land_name=land_name,
            soil_type=soil_type,
            area_size=area_size,
            location=location,
            user_id=user_id,
            status=status
        )
        db.session.add(new_land)
        db.session.commit()
        return new_land

    def update(self, land, data):
        land.land_name = data.get('land_name', land.land_name)
        land.soil_type = data.get('soil_type', land.soil_type)
        land.area_size = float(data.get('area_size', land.area_size))
        land.status = data.get('status', land.status)
        land.location = data.get('location', land.location)
        db.session.commit()
        return land

    def delete(self, land):
        db.session.delete(land)
        db.session.commit()
        return True