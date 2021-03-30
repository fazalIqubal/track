from flask import abort, Blueprint
from flask_restx import reqparse, Resource, Namespace
from project.membership_plan.model import MembershipPlan as MembershipPlanModel
from project.app import api
from datetime import date
from http import HTTPStatus
from project.helpers.utility import Utility 
from project.helpers.response import Response
from project.helpers.responseMessages import ResponseMessages
from flask_jwt_extended import (
    jwt_required, get_jwt_identity
)

parser = reqparse.RequestParser()
parser.add_argument("membership_plan")

membership_plan_bp = Blueprint("membership_plan", __name__)
membership_plan_ns = Namespace("membership_plan", description="Endpoints for membership_plan")

def get_membership_plan(id):
    membership_plan = MembershipPlanModel.get(id)
    if not membership_plan or membership_plan.is_deleted:
       return None
    return membership_plan

put_parser = api.parser()
put_parser.add_argument("name", required=True, location = "json")
put_parser.add_argument("description", required=True, location = "json")
put_parser.add_argument("price", required = True, location = "json")
put_parser.add_argument("project_limit", required = True, location = "json")
put_parser.add_argument("user_limit", required = True, location = "json")
put_parser.add_argument("plan_duration", required = True, location = "json")

@membership_plan_ns.route("/<int:id>")
class MembershipPlan(Resource):
    @api.doc(params={"id": "ID of the  membership_plan to retrieve"}) 
  
    def get(self, id):
        membership_plan_data = get_membership_plan(id)
        try:
            membership_plan_data.created_at = Utility.date_month_year(self, membership_plan_data.created_at)
            if membership_plan_data.updated_at != None:
                membership_plan_data.updated_at = Utility.date_month_year(self, membership_plan_data.updated_at)
            else:
                membership_plan_data.updated_at = None
            return Response.createSuccessResponse(self, membership_plan_data.to_json(), ResponseMessages.get_success, HTTPStatus.OK)
        except:
            return Response.createFailResponse(self, ResponseMessages.get_fail, HTTPStatus.NOT_FOUND)
    @api.doc(params={"id": "ID of the membership_plan to delete"})
 
    def delete(self, id):
        membership_plan = get_membership_plan(id)
        try:
            membership_plan.delete()
            return Response.createDeleteSuccessResponse(self, ResponseMessages.delete_success, HTTPStatus.NO_CONTENT)
        except:
            return Response.createFailResponse(self, ResponseMessages.delete_fail, HTTPStatus.NOT_ACCEPTABLE)
    @api.expect(put_parser)
    @api.doc(params={"id": "ID of the membership_plan to update/create"})
    
    @jwt_required
    def put(self, id):

        args = put_parser.parse_args()
        name = args["name"]
        description =  args["description"]
        price = args["price"]
        project_limit = args["project_limit"]
        user_limit = args["user_limit"]
        plan_duration = args["plan_duration"]
        
        
        membership_plan = get_membership_plan(id)
        try:
            membership_plan.name = name
            membership_plan.description = description
            membership_plan.price = price
            membership_plan.project_limit = project_limit
            membership_plan.user_limit = user_limit
            membership_plan.plan_duration = plan_duration
            membership_plan.updated_by = get_jwt_identity()
            membership_plan.updated_at = date.today()
            membership_plan.update()
            return Response.createSuccessResponse(self,membership_plan.to_json(), ResponseMessages.update_success, HTTPStatus.CREATED)
        except:
            return Response.createFailResponse(self, ResponseMessages.update_fail, HTTPStatus.BAD_REQUEST)
post_parser = api.parser()
post_parser.add_argument("name", required=True, location = "json")
post_parser.add_argument("description", required=True, location = "json")
post_parser.add_argument("price", required = True, location = "json")
post_parser.add_argument("project_limit", required = True, location = "json")
post_parser.add_argument("user_limit", required = True, location = "json")
post_parser.add_argument("plan_duration", required = True, location = "json")

@membership_plan_ns.route("/")
class MembershipPlanList(Resource):
    @jwt_required
    def get(self):
        try:
            data = [membership_plan for membership_plan in MembershipPlanModel.all()]
            for membership in data:
                membership.created_at = Utility.date_month_year(self, membership.created_at)
                if membership.updated_at != None:
                    membership.updated_at = Utility.date_month_year(self, membership.updated_at)
                else:
                    membership.updated_at = None
            return Response.createSuccessResponse(self, [membership_plan.to_json() for membership_plan in data], ResponseMessages.get_success, HTTPStatus.OK)
        except:
            return Response.createFailResponse(self, ResponseMessages.get_fail, HTTPStatus.NOT_FOUND)
    @api.expect(post_parser)

    @jwt_required
    def post(self):
        args = post_parser.parse_args()
        name = args["name"]
        description =  args["description"]
        price = args["price"]
        project_limit = args["project_limit"]
        user_limit = args["user_limit"]
        plan_duration = args["plan_duration"]
        created_by = get_jwt_identity()

        try:
            membership_plan = MembershipPlanModel( name = name, description = description, price = price, project_limit = project_limit, user_limit = user_limit, plan_duration = plan_duration, created_by = created_by, created_at = date.today())
            membership_plan.save()
            return Response.createSuccessResponse(self, membership_plan.to_json(), ResponseMessages.create_success, HTTPStatus.CREATED)
        except:
            return Response.createFailResponse(self, ResponseMessages.get_fail, HTTPStatus.NOT_FOUND)
 
api.add_namespace(membership_plan_ns)