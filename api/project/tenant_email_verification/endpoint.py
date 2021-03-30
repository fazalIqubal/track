from flask import abort, Blueprint
from flask_restx import reqparse, Resource, Namespace
from http import HTTPStatus
from project.tenant.model import Tenant as TenantModel
from project.app import api
from datetime import date
from project.helpers.response import Response
from project.helpers.responseMessages import ResponseMessages
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
import os
from project.helpers.email_handler import EmailHandler
from project.helpers.email_template import EmailTemplate

parser = reqparse.RequestParser()
parser.add_argument("tenant_email")

tenantemail_bp = Blueprint("tenant_email", __name__)
tenantemail_ns = Namespace("tenant_email", description="Endpoints for tenants")

post_parser = api.parser()
post_parser.add_argument("email", required=True, location="json")

@tenantemail_ns.route("/email_verify")
class TenantEmailCheck(Resource):
    __tablename__ = 'tenant'
    @api.expect(post_parser)
    def post(self):
        """ check the tenant email. """
        args = post_parser.parse_args()
        email = args["email"]
        password = "password@123"
        data = {'email':email ,'password':password}
        
        try:
            template = EmailTemplate.tenantEmailVerification(data)
            EmailHandler.send_email(email, "email verification", template)
            return Response.createSuccessResponse(self, data, ResponseMessages.email_sent, HTTPStatus.CREATED), HTTPStatus.OK
        except:
            return Response.createFailResponse(self,ResponseMessages.email_fail, HTTPStatus.BAD_REQUEST),  HTTPStatus.BAD_REQUEST
         
api.add_namespace(tenantemail_ns)