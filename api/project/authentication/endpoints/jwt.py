from flask import Blueprint
from flask_jwt_extended import (
    jwt_refresh_token_required,
    get_jwt_identity,
    create_access_token,
)
from flask_restx import Resource, Namespace
from flask_restx._http import HTTPStatus

from project.app import api

jwt_bp = Blueprint("jwt", __name__)
jwt_ns = Namespace("jwt", description="Endpoints for JWT token management.")


@jwt_ns.route("/refresh_token")
class RefreshToken(Resource):
    @api.response(HTTPStatus.OK, HTTPStatus.OK.phrase)
    @api.response(HTTPStatus.UNAUTHORIZED, HTTPStatus.UNAUTHORIZED.phrase)
    @jwt_refresh_token_required
    def post(self):
        """ Generate new access token """
        current_user = get_jwt_identity()
        ret = {"access_token": create_access_token(identity=current_user, fresh=False)}
        return ret, 200


api.add_namespace(jwt_ns)
