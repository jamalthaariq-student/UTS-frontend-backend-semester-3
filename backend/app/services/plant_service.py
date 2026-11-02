from sqlalchemy.exc import SQLAlchemyError
from app.models import db
from app.models.land_model import Land
from app.models.plant_model import Plant

class PlantService:
    def __init__(self, plant_repo):
        self.repo = plant_repo

    def get_plants(self, page, per_page, search, status):
        paginated = self.repo.get_paginated_and_search(page, per_page, search, status)
        pagination_meta = {
            "current_page": paginated.page,
            "per_page": paginated.per_page,
            "total_pages": paginated.pages,
            "total_items": paginated.total
        }
        return [plant.to_dict() for plant in paginated.items], pagination_meta

    def get_plant_detail(self, plant_id):
        plant = self.repo.get_by_id(plant_id)
        if not plant:
            return None, "Tanaman tidak ditemukan"
        return plant.to_dict(), None

    # Transaksi Atomik Multi-Tabel (Lahan Baru + Tanaman Baru)
    def create_plant_and_land_atomic(self, data):
        if not data or not data.get('land_name') or not data.get('plant_name') or not data.get('user_id'):
            return {"errors": {"atomic_process": "land_name, plant_name, dan user_id wajib diisi"}}, 400

        try:
            # 1. Tambah Lahan Baru dan Flush ke Session Buffer
            new_land = Land(
                land_name=data['land_name'],
                soil_type=data.get('soil_type', 'Andosol'),
                area_size=float(data.get('area_size', 1.0)),
                location=data.get('location', 'Banyuwangi'),
                user_id=int(data['user_id']),
                status='Aktif'
            )
            db.session.add(new_land)
            db.session.flush()  # Mendapatkan ID Lahan sebelum commit[cite: 48]

            # 2. Tambah Tanaman Terikat dengan ID Lahan Baru
            new_plant = Plant(
                plant_name=data['plant_name'],
                plant_type=data.get('plant_type', 'Hortikultura'),
                quantity=int(data.get('quantity', 100)),
                status='Baik',
                land_id=new_land.id
            )
            db.session.add(new_plant)

            # 3. Commit Transaksi Sekaligus (ACID Atomik)
            db.session.commit()
            return {
                "message": "Pembuatan Lahan & Tanaman Baru Berhasil Disimpan",
                "data": {
                    "land": new_land.to_dict(),
                    "plant": new_plant.to_dict()
                }
            }, 201

        except (SQLAlchemyError, ValueError, TypeError) as e:
            db.session.rollback()  # Batal total jika ada galat[cite: 48]
            return {"errors": {"atomic_process": f"Proses atomik dibatalkan server: {str(e)}"}}, 500

    # POST BIASA: Tambah Tanaman ke Lahan yang Sudah Ada
    def create_plant(self, data):
        errors = {}
        if not data or not data.get('plant_name'):
            errors['plant_name'] = "Nama tanaman wajib diisi"
        if not data or not data.get('plant_type'):
            errors['plant_type'] = "Jenis tanaman wajib dipilih"
        if not data or data.get('quantity') is None or int(data.get('quantity', 0)) <= 0:
            errors['quantity'] = "Jumlah tanaman harus lebih dari 0"
        if not data or not data.get('land_id'):
            errors['land_id'] = "ID Lahan (land_id) wajib ditentukan"

        if errors:
            return {"errors": errors}, 400

        # Cek apakah ID Lahan benar-benar ada di database
        land = Land.query.get(data['land_id'])
        if not land:
            return {"errors": {"land_id": "Lahan tidak ditemukan"}}, 404

        new_plant = self.repo.create(
            plant_name=data['plant_name'],
            plant_type=data['plant_type'],
            quantity=int(data['quantity']),
            land_id=int(data['land_id']),
            status=data.get('status', 'Baik')
        )
        return {"message": "Tanaman berhasil ditambahkan ke lahan", "data": new_plant.to_dict()}, 201

    def update_plant(self, plant_id, data):
        plant = self.repo.get_by_id(plant_id)
        if not plant:
            return {"errors": {"plant": "Tanaman tidak ditemukan"}}, 404

        updated_plant = self.repo.update(plant, data)
        return {"message": "Data tanaman berhasil diperbarui", "data": updated_plant.to_dict()}, 200

    def delete_plant(self, plant_id):
        plant = self.repo.get_by_id(plant_id)
        if not plant:
            return {"errors": {"plant": "Tanaman tidak ditemukan"}}, 404

        self.repo.delete(plant)
        return {"message": "Tanaman berhasil dihapus"}, 200