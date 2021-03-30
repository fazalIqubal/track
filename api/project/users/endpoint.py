from flask import abort, Blueprint, request
from flask_restx import reqparse, Resource, Namespace
from project.users.model import users as usersModel
from project.app import api
from datetime import date
from http import HTTPStatus
from project.helpers.utility import Utility
from project.helpers.response import Response
from project.helpers.responseMessages import ResponseMessages
import random
from datetime import date
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
import os
from project.helpers.email_handler import EmailHandler
from project.helpers.email_template import EmailTemplate
from project.authentication.backends.decryption import decrypt, encrypt

parser = reqparse.RequestParser()
parser.add_argument("users")
users_bp = Blueprint("users", __name__)
users_ns = Namespace("users", description="Endpoints for users")

def get_user(id ):
    user = usersModel.get(id)
    if not user or user.is_deleted:
        return None
    return user

put_parser = api.parser()
put_parser.add_argument("first_name", required=True, location="json")
put_parser.add_argument("last_name", required=True, location="json")
put_parser.add_argument("address", required=True, location="json")
put_parser.add_argument("username", required=True, location="json")
put_parser.add_argument("mobile", required=True, location="json")
put_parser.add_argument("email", required=True, location="json")

@users_ns.route("/<int:id>")
class users(Resource):
    @jwt_required
    @api.doc(params={"id": "id of the  users to retrieve"})
    def get(self, id):
        """ Get a  users with a given id """
        user_data = get_user( id)
        try:
            user_data.created_at = Utility.date_month_year(self, user_data.created_at)
            if user_data.updated_at != None:
                user_data.updated_at = Utility.date_month_year(self, user_data.updated_at)
            else:
                user_data.updated_at = None
            return Response.createSuccessResponse( self, user_data.to_json(), ResponseMessages.get_success, HTTPStatus.OK)
        except:
            return Response.createFailResponse(self, ResponseMessages.get_fail, HTTPStatus.NOT_FOUND)

    @api.doc(params={"id": "id of the users to delete"})
    @jwt_required
    def delete(self, id):
        """ Delete a  users with a given id """
        user = get_user(id)
        try:
            user.delete()
            return Response.createDeleteSuccessResponse(self, ResponseMessages.delete_success, HTTPStatus.NO_CONTENT)
        except:
            return Response.createFailResponse(self, ResponseMessages.delete_fail, HTTPStatus.NOT_ACCEPTABLE)
            
    @api.expect(put_parser)
    @api.doc(params={"id": "id of the users to update/create"})
    @jwt_required
    def put(self, id):
        """ Update a users with a given id """
        args = put_parser.parse_args()
        first_name= args["first_name"]
        last_name= args["last_name"]
        address = args["address"]
        username= args["username"]
        mobile = args["mobile"]
        email= args["email"]
        
        user = get_user(id)
        try:
            user.first_name = first_name
            user.last_name = last_name
            user.address = address
            user.username = username
            user.mobile = mobile
            user.email = email
            user.updated_by = get_jwt_identity()
            user.updated_at = date.today()
            user.update()
            return Response.createSuccessResponse(self,user.to_json(), ResponseMessages.update_success, HTTPStatus.CREATED)
        except:
            return Response.createFailResponse(self, ResponseMessages.update_fail, HTTPStatus.BAD_REQUEST)

post_parser = api.parser()
post_parser.add_argument("first_name", required=True, location="json")
post_parser.add_argument("last_name", required=True, location="json")
post_parser.add_argument("address", required=True, location="json")
post_parser.add_argument("username", required=True, location="json")
post_parser.add_argument("mobile", required=True, location="json")
post_parser.add_argument("email", required=True, location="json")

@users_ns.route("/")
class usersList(Resource):
    __tablename__ = 'users'
    @jwt_required
    def get(self):
        search_data = request.args.get('searchData')
        """ Get all users. """
        try:
            data =  usersModel.all()
            for user in data:
                user.created_at = Utility.date_month_year(self, user.created_at)
                if user.updated_at != None:
                    user.updated_at = Utility.date_month_year(self, user.updated_at)
                else:
                    user.updated_at = None
            if search_data:
                data =  usersModel.all(search_data=search_data)
            return Response.createSuccessResponse(self, [users.to_json()  for users in data], ResponseMessages.get_success, HTTPStatus.OK)     
        except:
            return Response.createFailResponse(self, ResponseMessages.get_fail, HTTPStatus.NOT_FOUND)
    @api.expect(post_parser)
    @jwt_required
    def post(self):
        """ Add a new users. """
        args = post_parser.parse_args()
        first_name = args["first_name"]
        last_name = args["last_name"]
        address = args["address"]
        username = args["username"]
        mobile = args["mobile"]
        email = args["email"]
        created_by =  get_jwt_identity()
        temp = username+str(random.randint(1000,9999))

        emailAlreadyexist = usersModel.get_email(self, email)
        try:
            if emailAlreadyexist is None :
                data = {'email':email ,'password':temp}
                template = EmailTemplate.tenantEmailVerification(data)
                EmailHandler.send_email(email, "email verification", template)
                users = usersModel(first_name = first_name,  last_name= last_name, address = address, username = username, temp_password = temp, mobile = mobile, email = email, created_by = created_by)
                users.save()
                return Response.createSuccessResponse(self, users.to_json(), ResponseMessages.create_success, HTTPStatus.CREATED)
            else:
                return Response.createFailResponse(self, ResponseMessages.create_fail, HTTPStatus.BAD_REQUEST), HTTPStatus.BAD_REQUEST
        except:
            return Response.createFailResponse(self, ResponseMessages.create_fail, HTTPStatus.BAD_REQUEST), HTTPStatus.BAD_REQUEST

api.add_namespace(users_ns)