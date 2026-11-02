from flask import Blueprint, request
from app.repositories.plant_repository import PlantRepository
from app.services.plant_service import PlantService
from app.utils.response_helper import success_response, fail_response

plant_bp = Blueprint('plant_api', __name__, url_prefix='/api/v1/plants')
repo = PlantRepository()
service = PlantService(repo)

@plant_bp.route('', methods=['GET'])
def get_all_plants():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    search = request.args.get('search', None, type=str)
    status = request.args.get('status', None, type=str)

    plants_data, pagination = service.get_plants(page, per_page, search, status)
    return success_response(data=plants_data, pagination=pagination, code=200)

@plant_bp.route('/<int:plant_id>', methods=['GET'])
def get_plant_by_id(plant_id):
    plant_data, error_msg = service.get_plant_detail(plant_id)
    if error_msg:
        return fail_response({"plant": error_msg}, 404)
    return success_response(data=plant_data, code=200)

# POST BIASA: Tambah Tanaman di Lahan Eksisting
@plant_bp.route('', methods=['POST'])
def create_plant():
    data = request.get_json() if request.is_json else None
    result, code = service.create_plant(data)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(data=result["data"], message=result["message"], code=code)

# POST ATOMIK: Tambah Lahan Baru + Tanaman Baru Sekaligus (Tanpa Kesan Jual-Beli)
@plant_bp.route('/atomic', methods=['POST'])
def create_plant_and_land_atomic():
    data = request.get_json() if request.is_json else None
    result, code = service.create_plant_and_land_atomic(data)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(data=result["data"], message=result["message"], code=code)

# UPDATE PLANT (PUT)
@plant_bp.route('/<int:plant_id>', methods=['PUT'])
def update_plant(plant_id):
    data = request.get_json() if request.is_json else None
    result, code = service.update_plant(plant_id, data)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(data=result["data"], message=result["message"], code=code)

# DELETE PLANT (DELETE)
@plant_bp.route('/<int:plant_id>', methods=['DELETE'])
def delete_plant(plant_id):
    result, code = service.delete_plant(plant_id)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(message=result["message"], code=code)