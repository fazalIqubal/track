from typing import List, Union
from project.app import db
import uuid 
import json
from sqlalchemy.orm import relationship
from sqlalchemy.sql import text
from project.utils.util import default_proc
from datetime import date
from sqlalchemy import Column, Integer, String, ForeignKey, Date

class TenantSubscription(db.Model):
    __tablename__ = 'tenant_subscription'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    effective_from = db.Column(db.DateTime)
    effective_to = db.Column(db.DateTime)
    auto_renew = db.Column(db.Boolean, default = True)
    status = db.Column(db.Enum("Active", "Inactive", "Suspended"), default = 'Active')
    created_at = db.Column(db.DateTime)
    created_by = db.Column(db.String(50))
    updated_at =  db.Column(db.DateTime)
    updated_by = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default = True)
    is_deleted = db.Column(db.Boolean, default = False)
    tenant_id = db.Column(db.Integer,  ForeignKey('tenant.id'))
    tenant = relationship("Tenant", backref="tenant_subscription")
    membership_plan_id = db.Column(db.Integer,  ForeignKey('membership_plan.id'))
    membershipPlan = relationship("MembershipPlan", backref="tenant_subscription")
    
    def __init__(self, id = None, effective_from = "", effective_to = "", status = "", tenant_id = None,  membership_plan_id = None, created_by = "", created_at = "", is_active = "", is_deleted = "" ):

        self.id = id
        self.effective_from = effective_from
        self.effective_to =  date.today()
        self.status = status
        self.tenant_id = tenant_id
        self.membership_plan_id = membership_plan_id
        self.created_at = created_at
        self.created_by = created_by

    @classmethod
    def get(cls, id: int):
        return TenantSubscription.query.get(id)
    
    @classmethod
    def all(cls):
        return cls.query.filter_by(is_active = True, is_deleted = False).order_by(cls.created_at)
    
    def to_json(self):
        return json.loads(json.dumps({ "id": self.id, "effective_from" : self.effective_from, "effective_to" : self.effective_to, "auto_renew" : self.auto_renew, "status" : self.status, "tenant_id" : self.tenant_id, "membership_plan_id" : self.membership_plan_id, "created_by" : self.created_by, "created_at" : self.created_at, "updated_at" : self.updated_at, "updated_by" : self.updated_by, "is_active" : self.is_active }, default=default_proc))
        
    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def update(self):
        db.session.commit()
        
    def exists(self, id):
        return db.session.query(db.exists().where(id == id)).scalar()

    def delete(self):
        if self.is_deleted:
            return Response.createFailResponse(self, ResponseMessages.not_found, HTTPStatus.NO_CONTENT)
        self.is_deleted = True
        db.session.commit()

    def __repr__(self):
        return "<name: {}>".format(self.name)