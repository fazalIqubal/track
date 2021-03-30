from flask import Blueprint, current_app, g ,session
from flask_restx import Resource, Namespace
from flask_restx._http import HTTPStatus

from project.app import api
from project.authentication.decorators import check_user_token_and_roles

auth_bp = Blueprint("auth", __name__)
auth_ns = Namespace("auth", description="Endpoints for authentication.")


# Parser only for API docs purposes so we show what is expected as input
# even though each backend is responsible by parsing the specific input they need
# e.g. JWT backend reads from request header, LDAP backend reads username/password from json
post_parser = api.parser()
post_parser.add_argument("username", required=True, location="json")
post_parser.add_argument("password", required=True, location="json")


@auth_ns.route("/login")
class Login(Resource):
    @api.response(HTTPStatus.OK, HTTPStatus.OK.phrase)
    @api.response(HTTPStatus.UNAUTHORIZED, HTTPStatus.UNAUTHORIZED.phrase)
    @api.expect(post_parser, validate=True, strict=True)
    def post(self):
        """ Login user """
        response_data = {}
        for backend in current_app.authenticators:
            result = backend.authenticate()
            if result and isinstance(result, dict):
                response_data.update(result)
                return response_data
        # if "user" in g:            
        #     return response_data
        # return {'User is not available'}, HTTPStatus.UNAUTHORIZED 
        return result, HTTPStatus.UNAUTHORIZED


# Only for API docs purposes. Should be parsed on each backend
# if they expect payload
logout_post_parser = api.parser()
logout_post_parser.add_argument("refresh_token", required=False, location="json")


@auth_ns.route("/logout")
class Logout(Resource):
    @api.response(HTTPStatus.OK, HTTPStatus.OK.phrase)
    @api.response(HTTPStatus.UNAUTHORIZED, HTTPStatus.UNAUTHORIZED.phrase)
    @api.expect(logout_post_parser)
    @check_user_token_and_roles([])
    def post(self):
        """ Logout user """
        for backend in current_app.authenticators:
            backend.logout()
        return {}

api.add_namespace(auth_ns)
