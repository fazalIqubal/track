import os
from datetime import timedelta
from project.config.settings import SECRET, DATABASE_URL, DATABASE_TEST_URL

DATE_FMT = "%Y/%m/%d"
DATETIME_FMT = "%Y-%m-%dT%H:%M:%S"

class Config(object):
    """Parent configuration class."""
    DEBUG = False
    CSRF_ENABLED = True
    SECRET = SECRET
    STRICT_SLASHES = False
    AUTH_BACKENDS = [
        "authentication.backends.jwt.JWTBackend",
    ]
    JWT_ALGORITHM = "HS512"
    JWT_BLACKLIST_ENABLED = True
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    USER_MODEL = 'users.model.users'


class DevelopmentConfig(Config):
    """Configurations for Development."""
    DEBUG = True
    JWT_ACCESS_TOKEN_EXPIRES = 18000  # 30 minutes


class TestingConfig(Config):
    """Configurations for Testing, with a separate test database."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = DATABASE_TEST_URL
    DEBUG = True
    AUTH_BACKENDS = [
        "authentication.backends.jwt.JWTBackend",
    ]

class StagingConfig(Config):
    """Configurations for Staging."""
    DEBUG = True
    JWT_ACCESS_TOKEN_EXPIRES = 18000  # 30 minutes


class ProductionConfig(Config):
    """Configurations for Production."""
    DEBUG = False
    TESTING = False
    JWT_ACCESS_TOKEN_EXPIRES = 18000  # 30 minutes


app_config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'staging': StagingConfig,
    'production': ProductionConfig,
}

key = Config.SECRET