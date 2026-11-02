from flask import Blueprint, request
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.utils.response_helper import success_response, fail_response

user_bp = Blueprint('user_api', __name__, url_prefix='/api/v1/users')
repo = UserRepository()
service = UserService(repo)

@user_bp.route('', methods=['GET'])
def get_all_users():
    users_data, code = service.get_users()
    return success_response(data=users_data, code=code)

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user_data, error_msg = service.get_user_by_id(user_id)
    if error_msg:
        return fail_response({"user": error_msg}, 404)
    return success_response(data=user_data, code=200)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() if request.is_json else None
    result, code = service.register_user(data)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(data=result["data"], message=result["message"], code=code)

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() if request.is_json else None
    result, code = service.login_user(data)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(data=result["data"], message=result["message"], code=code)

# UPDATE PROFIL USER (PUT)
@user_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json() if request.is_json else None
    result, code = service.update_user(user_id, data)
    if "errors" in result:
        return fail_response(result["errors"], code)
    return success_response(data=result["data"], message=result["message"], code=code)