import os

class Config:
    # URL Koneksi MySQL via Driver PyMySQL ke database db_mytani_backend
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://root:admin@localhost:3306/db_mytani_backend'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SECRET_KEY = os.getenv('SECRET_KEY', 'mytani-secret-key-uts-2026')