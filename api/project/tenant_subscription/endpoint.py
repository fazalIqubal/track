from flask import abort, Blueprint
from flask_restx import reqparse, Resource, Namespace
from project.tenant_subscription.model import TenantSubscription as TenantSubscriptionModel
from project.app import api
from http import HTTPStatus
from datetime import date
from project.helpers.utility import Utility
from project.helpers.response import Response
from project.helpers.responseMessages import ResponseMessages

parser = reqparse.RequestParser()
parser.add_argument("tenant_subscription")

tenant_subscription_bp = Blueprint("tenant_subscription", __name__)
tenant_subscription_ns = Namespace("tenant_subscription", description="Endpoints for tenant_subscription")

def get_tenant_subscription(self, id):
    tenant_subscription = TenantSubscriptionModel.get(id)
    if not tenant_subscription or tenant_subscription.is_deleted:
        return None
    return tenant_subscription

put_parser = api.parser()
put_parser.add_argument("membership_plan_id", required=True, location = "json")
put_parser.add_argument("tenant_id", required=True, location = "json")
put_parser.add_argument("status", required = True, location = "json")
put_parser.add_argument("updated_by", required=True, location = "json")

@tenant_subscription_ns.route("/<int:id>")
class TenantSubscription(Resource):

    @api.doc(params={"id": "ID of the  tenant_subscription to retrieve"})
  
    def get(self, id):
        tenant_subscription_data = get_tenant_subscription(self, id)
        tenant_subscription_data.effective_from = Utility.date_month_year(self, tenant_subscription_data.effective_from)
        tenant_subscription_data.effective_to = Utility.date_month_year(self, tenant_subscription_data.effective_to)
        tenant_subscription_data.created_at = Utility.date_month_year(self, tenant_subscription_data.created_at)
        if tenant_subscription_data.updated_at != None:
            tenant_subscription_data.updated_at = Utility.date_month_year(self, tenant_subscription_data.updated_at)
        else:
            tenant_subscription_data.updated_at = None
        return Response.createSuccessResponse(self, tenant_subscription_data.to_json(), ResponseMessages.get_success, HTTPStatus.OK)
 
    @api.doc(params={"id": "ID of the tenant_subscription to delete"})
 
    def delete(self, id):
        tenant_subscription = get_tenant_subscription(self, id)
        if not tenant_subscription:
            return Response.createFailResponse(self, ResponseMessages.not_exist, HTTPStatus.NO_CONTENT)
        tenant_subscription.delete()
        return Response.createDeleteSuccessResponse(self, ResponseMessages.delete_success, HTTPStatus.NO_CONTENT)

    @api.expect(put_parser)
    @api.doc(params={"id": "ID of the tenant_subscription to update/create"})

    def put(self, id):
        args = put_parser.parse_args()
        tenant_id = args["tenant_id"]
        membership_plan_id = args["membership_plan_id"]
        status = args["status"]
        updated_by = args["updated_by"]
        
        tenant_subscription = get_tenant_subscription(self, id)
        if not tenant_subscription:
            return Response.createFailResponse(self, ResponseMessages.not_exist, HTTPStatus.NO_CONTENT)
        tenant_subscription.tenant_id = tenant_id
        tenant_subscription.membership_plan_id =  membership_plan_id
        tenant_subscription.status = status
        tenant_subscription.updated_by = updated_by
        tenant_subscription.updated_at = date.today()


        tenant_subscription.update()
        return Response.createSuccessResponse(self,tenant_subscription.to_json(), ResponseMessages.update_success, HTTPStatus.CREATED)

post_parser = api.parser()
post_parser.add_argument("tenant_id", required=True, location = "json")
post_parser.add_argument("membership_plan_id", required=True, location = "json")
post_parser.add_argument("status", required= True, location= "json")
post_parser.add_argument("created_by", required=True, location="json")

@tenant_subscription_ns.route("/")
class TenantSubscriptionList(Resource):

    def get(self):
        data = [tenant_subscription for tenant_subscription in TenantSubscriptionModel.all()]
        for tenant in data:
            tenant.effective_from = Utility.date_month_year(self, tenant.effective_from)
            tenant.effective_to = Utility.date_month_year(self, tenant.effective_to)
            tenant.created_at = Utility.date_month_year(self, tenant.created_at)
            if tenant.updated_at != None:
                tenant.updated_at = Utility.date_month_year(self, tenant.updated_at)
            else:
                tenant.updated_at = None
        return Response.createSuccessResponse(self, [tenant_subscription.to_json() for tenant_subscription in data], ResponseMessages.get_success, HTTPStatus.OK)

    @api.expect(post_parser)

    def post(self):
        args = post_parser.parse_args()
        tenant_id = args["tenant_id"]
        membership_plan_id = args["membership_plan_id"]
        status = args["status"]
        created_by = args["created_by"]

        tenant_subscription = TenantSubscriptionModel(effective_from = date.today(), tenant_id = tenant_id, membership_plan_id = membership_plan_id, status= status, created_by = created_by, created_at = date.today())
        tenant_subscription.save()
        return Response.createSuccessResponse(self, tenant_subscription.to_json(), ResponseMessages.create_success, HTTPStatus.CREATED)

api.add_namespace(tenant_subscription_ns)