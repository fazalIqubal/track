from flask import abort, Blueprint
from flask_restx import reqparse, Resource, Namespace
from project.users.model import users as usersModel
from project.app import api
from http import HTTPStatus
from project.helpers.utility import Utility
from project.helpers.response import Response
from project.helpers.responseMessages import ResponseMessages
from flask import Flask, render_template, redirect, url_for, request
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
from project.authentication.backends.decryption import decrypt, encrypt
import jwt

parser = reqparse.RequestParser()
parser.add_argument("user_password")
userpassword_bp = Blueprint("user_password", __name__)
userpassword_ns = Namespace("user_password", description="Endpoints for users password for encryption column")

put_parser = api.parser()
put_parser.add_argument("temp_password", required=True, location="json")
put_parser.add_argument("user_newpassword", required=True, location="json")
put_parser.add_argument("user_confirm_password", required=True, location="json")
put_parser.add_argument("id", required=True, location="json")


def get_user(id ):
    user = usersModel.get(id)
    if not user or user.is_deleted:
        return None
    return user

@userpassword_ns.route("/")
class UserPassword(Resource):
    __tablename__ = 'users'
    @api.expect(put_parser)
    @jwt_required
    def put(self):
        """ Update a users with a given id """
        args = put_parser.parse_args()
        temp_password = args["temp_password"]
        user_newpassword = args["user_newpassword"]
        user_confirm_password = args['user_confirm_password']
        id = args['id']
        user = get_user(id)
        
        if temp_password == user.temp_password:
            key = 'abc123'.encode()
            newpassword = encrypt(key, user_newpassword.encode("latin-1") )
            user.encrypted_password = newpassword
            user.temp_password = ''
            user.isemail_verified = True
            user.update()
            return Response.createSuccessResponse(self, user.to_json(), ResponseMessages.update_success, HTTPStatus.CREATED)
        else :
            return Response.createFailResponse( self, ResponseMessages.update_fail, HTTPStatus.BAD_REQUEST),  HTTPStatus.BAD_REQUEST
      

api.add_namespace(userpassword_ns)