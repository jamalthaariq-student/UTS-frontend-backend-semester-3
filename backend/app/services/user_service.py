class UserService:
    def __init__(self, user_repo):
        self.repo = user_repo

    def get_users(self):
        users = self.repo.get_all()
        return [user.to_dict() for user in users], 200

    def get_user_by_id(self, user_id):
        user = self.repo.get_by_id(user_id)
        if not user:
            return None, "Pengguna tidak ditemukan"
        return user.to_dict(), None

    def register_user(self, data):
        errors = {}
        if not data or not data.get('username'):
            errors['username'] = "Field username wajib diisi"
        if not data or not data.get('email') or '@' not in data.get('email'):
            errors['email'] = "Email tidak valid"
        if not data or not data.get('password') or len(data.get('password')) < 6:
            errors['password'] = "Password minimal 6 karakter"

        if errors:
            return {"errors": errors}, 400

        existing_user = self.repo.get_by_email(data['email'])
        if existing_user:
            return {"errors": {"email": "Email sudah terdaftar!"}}, 400

        created = self.repo.create(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            role='Petani'
        )
        return {"message": "Registrasi pengguna berhasil", "data": created.to_dict()}, 201

    def login_user(self, data):
        if not data or not data.get('email') or not data.get('password'):
            return {"errors": {"auth": "Email dan password wajib diisi"}}, 400

        user = self.repo.get_by_email(data['email'])
        if not user or user.password != data['password']:
            return {"errors": {"auth": "Kredensial email atau password salah"}}, 401

        return {"message": "Login berhasil", "data": user.to_dict()}, 200

    def update_user(self, user_id, data):
        user = self.repo.get_by_id(user_id)
        if not user:
            return {"errors": {"user": "Pengguna tidak ditemukan"}}, 404

        errors = {}
        # Jika mengedit email, pastikan email baru belum dipakai pengguna lain
        if data.get('email') and data['email'] != user.email:
            if '@' not in data['email']:
                errors['email'] = "Format email tidak valid"
            elif self.repo.get_by_email(data['email']):
                errors['email'] = "Email sudah digunakan oleh pengguna lain!"

        if data.get('password') and len(data['password']) < 6:
            errors['password'] = "Password minimal 6 karakter"

        if errors:
            return {"errors": errors}, 400

        updated_user = self.repo.update(user, data)
        return {"message": "Profil pengguna berhasil diperbarui", "data": updated_user.to_dict()}, 200