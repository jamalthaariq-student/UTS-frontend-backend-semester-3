from app.models import db
from app.models.user_model import User

class UserRepository:
    def get_all(self):
        return User.query.all()

    def get_by_id(self, user_id):
        return db.session.get(User, user_id)

    def get_by_email(self, email):
        return User.query.filter_by(email=email).first()

    def create(self, username, email, password, role='Petani'):
        new_user = User(username=username, email=email, password=password, role=role)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    def update(self, user, data):
        # Hanya memperbarui username, email, dan password (role diabaikan/mutlak Petani)
        if 'username' in data and data['username']:
            user.username = data['username']
        if 'email' in data and data['email']:
            user.email = data['email']
        if 'password' in data and data['password']:
            user.password = data['password']
            
        db.session.commit()
        return user

    def delete(self, user):
        db.session.delete(user)
        db.session.commit()
        return True