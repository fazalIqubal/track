import cx_Oracle
import importlib
import logging
import os
import pkgutil

from flask import Flask, Blueprint
from flask_api import FlaskAPI
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_restx import Api, abort
from flask_restx._http import HTTPStatus
from flask_jwt_extended import JWTManager

#from config import env_config, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
from project.config.settings import APP_SETTINGS, APP_NAME
from project.config.config import app_config

logger = logging.getLogger(__name__)
# initialize sql-alchemy
db = SQLAlchemy()

def _load_object(obj_type):
    """ Search recursively for obj_type assignments at module level inside each folder.

    Since this app is meant to be shared across all applications
    we don't know before hand which e.g. blueprints or dbs instances will be available.

    Windows vs UNIX bases systems have different paths representation so handle
    slashes/backslashes differently depending on the system.

    :return: list with all obj_types found
    """
    all_objects = []
    base_dir = os.path.dirname(os.path.realpath(__file__))

    for root, _, _ in os.walk(base_dir):
        if os.name == "nt":
            path_str = "\\".join(root.split("\\"))
        else:
            path_str = "/" + "/".join(root.split("/")[1:])
        for m in pkgutil.iter_modules([path_str]):
            if not m.ispkg:
                pkg_format = m.module_finder.path.replace(base_dir, "")
                if os.name == "nt":
                    pkg_format = pkg_format.replace("\\", ".")
                else:
                    pkg_format = pkg_format.replace("/", ".")
                pkg_format = pkg_format[1:]
                pkg_name = f"{pkg_format}.{m.name}" if pkg_format else f"{m.name}"
                pkg_name = 'project.' + pkg_name
                # TODO: deal with pytest-bdd import
                if "test" in pkg_name:
                    continue

                module = importlib.import_module(pkg_name)

                for attr in module.__dict__:
                    if isinstance(getattr(module, attr), obj_type):
                        all_objects.append(getattr(module, attr))

    return all_objects


env = os.getenv("ENV", "development")

# Register swagger docs API
api_blueprint = Blueprint("api", __name__, url_prefix="/api")
api = Api(
    api_blueprint,
    title=f'{APP_NAME} API Docs',
    doc=False if env == "production" else "/",  # Disable swagger docs in production,
    security="bearer",
    authorizations={
        "bearer": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token",
        },
    },
)

def create_app(config_name=None):
    # Setup Flask app
    assert env in (
        "development",
        "test",
        "production",
    ), f"{env} it not a valid environment."
    app = Flask(__name__)
    CORS(app)
    if config_name is None:
        app.config.from_object(app_config[APP_SETTINGS])
    else:
        app.config.from_object(app_config[config_name])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'admin'
    app.config['PROPAGATE_EXCEPTIONS'] = True
    db.init_app(app)
    jwt = JWTManager(app)
    jwt._set_error_handler_callbacks(api_blueprint)
    app.url_map.strict_slashes = app.config.get("STRICT_SLASHES", False)
    
    # Register blueprints
    blueprints = _load_object(Blueprint)
    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    authenticators = []
    for auth_backend in app.config.get("AUTH_BACKENDS", []):
        module_name, class_name = auth_backend.rsplit(".", 1)
        module_name = 'project.' + module_name
        auth_initialized = getattr(importlib.import_module(module_name), class_name)(
            app
        )
        authenticators.append(auth_initialized)

    app.authenticators = authenticators

    app.bcrypt = Bcrypt(app)

    user_model = app.config.get("USER_MODEL")
    if user_model:
        module_name, class_name = user_model.rsplit(".", 1)
        module_name = 'project.' + module_name
        app.user_model = getattr(importlib.import_module(module_name), class_name)(
            "",
            ""
        )


    return app
