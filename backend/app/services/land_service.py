class LandService:
    def __init__(self, land_repo):
        self.repo = land_repo

    def get_lands(self, page, per_page, search, status):
        paginated = self.repo.get_paginated_and_search(page, per_page, search, status)
        pagination_meta = {
            "current_page": paginated.page,
            "per_page": paginated.per_page,
            "total_pages": paginated.pages,
            "total_items": paginated.total
        }
        return [land.to_dict() for land in paginated.items], pagination_meta

    def get_land_detail(self, land_id):
        land = self.repo.get_by_id(land_id)
        if not land:
            return None, "Lahan tidak ditemukan"
        return land.to_dict(), None

    def create_land(self, data):
        errors = {}
        if not data or not data.get('land_name'):
            errors['land_name'] = "Nama lahan wajib diisi"
        if not data or not data.get('soil_type'):
            errors['soil_type'] = "Jenis tanah wajib dipilih"
        if not data or data.get('area_size') is None or float(data.get('area_size', 0)) <= 0:
            errors['area_size'] = "Luas lahan harus lebih besar dari 0 Ha"
        if not data or not data.get('user_id'):
            errors['user_id'] = "Pemilik lahan (user_id) wajib ditentukan"

        if errors:
            return {"errors": errors}, 400

        new_land = self.repo.create(
            land_name=data['land_name'],
            soil_type=data['soil_type'],
            area_size=float(data['area_size']),
            location=data.get('location', 'Banyuwangi'),
            user_id=int(data['user_id']),
            status=data.get('status', 'Aktif')
        )
        return {"message": "Lahan baru berhasil ditambahkan", "data": new_land.to_dict()}, 201

    def update_land(self, land_id, data):
        land = self.repo.get_by_id(land_id)
        if not land:
            return {"errors": {"land": "Lahan tidak ditemukan"}}, 404

        updated_land = self.repo.update(land, data)
        return {"message": "Data lahan berhasil diperbarui", "data": updated_land.to_dict()}, 200

    def delete_land(self, land_id):
        land = self.repo.get_by_id(land_id)
        if not land:
            return {"errors": {"land": "Lahan tidak ditemukan"}}, 404

        self.repo.delete(land)
        return {"message": "Lahan berhasil dihapus"}, 200