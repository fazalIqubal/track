from flask import abort, Blueprint
from flask_restx import reqparse, Resource, Namespace
from http import HTTPStatus
from project.tenant.model import Tenant as TenantModel
from project.app import api
from datetime import date
from project.helpers.response import Response
from project.helpers.responseMessages import ResponseMessages
from project.helpers.email_handler import EmailHandler
from project.helpers.email_template import EmailTemplate
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)
parser = reqparse.RequestParser()
parser.add_argument("tenant")

tenant_bp = Blueprint("tenant", __name__)
tenant_ns = Namespace("tenant", description="Endpoints for tenants")

def get_tenant(id):
    tenant = TenantModel.get(id)
    if not tenant or tenant.isDeleted:
        return None
    return tenant

put_parser = api.parser()
put_parser.add_argument("mobile", required=True, location="json")
put_parser.add_argument("company_size", required=True, location="json")
put_parser.add_argument("primary_interest", required=True, location="json")
put_parser.add_argument("name", required=True, location="json")
put_parser.add_argument("email", required=True, location="json")
put_parser.add_argument("company_name", required=True, location="json")
put_parser.add_argument("country", required=True, location="json")
put_parser.add_argument("language", required=True, location="json")

@tenant_ns.route("/<int:id>")
class Tenant(Resource):

    @api.doc(params={"id": "ID of the tenant to retrieve"})
    
    def get(self, id):
        """ Get a tenant with a given ID """
        try:
            tenant_data = get_tenant(id).to_json()
            return Response.createSuccessResponse(self, tenant_data, ResponseMessages.get_success, HTTPStatus.OK)
        except:
            return Response.createFailResponse(self, ResponseMessages.get_fail, HTTPStatus.NOT_FOUND)
    @api.doc(params={"id": "ID of the tenant to delete"})
    
    def delete(self, id):
        """ Delete a tenant with a given ID """
        tenant = get_tenant(id)
        try:
            tenant.delete()
            return Response.createDeleteSuccessResponse(self, ResponseMessages.delete_success, HTTPStatus.NO_CONTENT)
        except:
            return Response.createFailResponse(self, ResponseMessages.delete_fail, HTTPStatus.NOT_ACCEPTABLE)
    @api.expect(put_parser)
    @api.doc(params={"id": "ID of the tenant to update/create"})
    
    def put(self, id):
        """ Update a tenant with a given ID """
        args = put_parser.parse_args()
        mobile = args["mobile"]
        company_size = args["company_size"]
        primary_interest = args["primary_interest"]
        name = args["name"]
        email = args["email"]
        company_name = args["company_name"]
        country = args["country"]
        language = args["language"]
        
        tenant = get_tenant(id)
        tenant.name = name
        tenant.email = email
        tenant.company_name = company_name
        tenant.mobile = mobile
        tenant.company_size = company_size
        tenant.country = country
        tenant.language = language
        tenant.primary_interest = primary_interest
        tenant.updated_at = date.today()
        tenant.updated_by = get_jwt_identity()
        try:
            tenant.update()
            return Response.createSuccessResponse(self,tenant.to_json(), ResponseMessages.update_success, HTTPStatus.CREATED)
        except:
            return Response.createFailResponse(self, ResponseMessages.update_fail, HTTPStatus.BAD_REQUEST)
post_parser = api.parser()
post_parser.add_argument("name", required=True, location="json")
post_parser.add_argument("email", required=True, location="json")
post_parser.add_argument("company_name", required=True, location="json")
post_parser.add_argument("mobile", required=True, location="json")
post_parser.add_argument("country", required=True, location="json")
post_parser.add_argument("language", required=True, location="json")
post_parser.add_argument("company_size", required=True, location="json")
post_parser.add_argument("primary_interest", required=True, location="json")


@tenant_ns.route("/")
class TenantList(Resource):
    @jwt_required
    def get(self):
        """ Get all tenants. """
        try:
            return Response.createSuccessResponse(self, [tenant.to_json() for tenant in TenantModel.all()], ResponseMessages.get_success, HTTPStatus.OK)
        except:
            return Response.createFailResponse(self, ResponseMessages.get_fail, HTTPStatus.NOT_FOUND)
    @api.expect(post_parser)
    @jwt_required
    def post(self):
        """ Add a new tenant. """
        args = post_parser.parse_args()
        name = args["name"]
        email = args["email"]
        company_name = args["company_name"]
        mobile = args["mobile"]
        country = args["country"]
        language = args["language"]
        company_size = args["company_size"]
        primary_interest = args["primary_interest"]
        created_by = get_jwt_identity()
        password = name+"123"
        data = {'email':email ,'password':password}
        template = EmailTemplate.tenantEmailVerification(data)
        EmailHandler.send_email(email, "email verification", template)
        tenant = TenantModel(name = name, email = email, company_name = company_name, mobile= mobile, country = country, language = language, company_size = company_size, primary_interest = primary_interest, created_by = created_by)
        try:
            tenant.save()
            return Response.createSuccessResponse(self, tenant.to_json(), ResponseMessages.create_success, HTTPStatus.CREATED)
        except:
            return Response.createFailResponse(self, ResponseMessages.create_fail, HTTPStatus.BAD_REQUEST)
@tenant_ns.route("/<string:includeDeleted>")
class TenantList(Resource):
    @api.doc(params={"includeDeleted": "To include isDeleted"})
    @jwt_required
    def get(self, includeDeleted):
        """ Get all tenants. """
        try:
            return Response.createSuccessResponse(self, [tenant.to_json() for tenant in TenantModel.all(includeDeleted)], ResponseMessages.get_success, HTTPStatus.OK)
        except:
            return Response.createFailResponse(self, ResponseMessages.get_fail, HTTPStatus.NOT_FOUND)
api.add_namespace(tenant_ns)