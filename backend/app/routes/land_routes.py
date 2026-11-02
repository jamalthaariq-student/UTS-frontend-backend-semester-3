from flask import Blueprint, request
from app.repositories.land_repository import LandRepository
from app.services.land_service import LandService
from app.utils.response_helper import success_response, fail_response

land_bp = Blueprint('land_api', __name__, url_prefix='/api/v1/lands')
repo = LandRepository()
service = LandService(repo)

@land_bp.route('', methods=['GET'])
def get_all_lands():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    search = request.args.get('search', None, type=str)
    status = request.args.get('status', None, type=str)

    lands_data, pagination = service.get_lands(page, per_page, search, status)
    return success_response(data=lands_data, pagination=pagination, code=200)

@land_bp.route('/<int:land_id>', methods=['GET'])
def get_land_by_id(land_id):
    land_data, error_msg = service.get_land_detail(land_id)
    if error_msg:
        return fail_response({"land": error_msg}, 404)
    return success_response(data=land_data, code=200)

@land_bp.route('', methods=['POST'])
def create_land():
    data = request.get_json() if request.is_json else None
    result, code = service.create_land(data)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(data=result["data"], message=result["message"], code=code)

# UPDATE LAND (PUT)
@land_bp.route('/<int:land_id>', methods=['PUT'])
def update_land(land_id):
    data = request.get_json() if request.is_json else None
    result, code = service.update_land(land_id, data)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(data=result["data"], message=result["message"], code=code)

# DELETE LAND (DELETE)
@land_bp.route('/<int:land_id>', methods=['DELETE'])
def delete_land(land_id):
    result, code = service.delete_land(land_id)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(message=result["message"], code=code)