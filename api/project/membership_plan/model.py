from typing import List, Union
from datetime import datetime
from project.app import db
import uuid 
import json
from sqlalchemy.orm import relationship
from sqlalchemy.sql import text
from project.utils.util import default_proc
from datetime import date


class MembershipPlan(db.Model):

    __tablename__ = 'membership_plan'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name =  db.Column(db.String(100))
    description =  db.Column(db.String(1000))
    price = db.Column(db.Numeric)
    project_limit = db.Column(db.Integer)
    user_limit = db.Column(db.Integer)
    plan_duration = db.Column(db.Text)
    created_at = db.Column(db.TIMESTAMP)
    created_by = db.Column(db.String(50))
    updated_at =  db.Column(db.Date)
    updated_by = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default = True)
    is_deleted = db.Column(db.Boolean, default = False)
    
    def __init__(self, id = None, name = "", description = "", price = None, project_limit = None, user_limit = None, plan_duration = None, created_by = "", created_at = "", is_active = "", is_deleted = ""):
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.project_limit = project_limit
        self.user_limit = user_limit
        self.plan_duration = plan_duration
        self.created_at = datetime.now()
        self.created_by = created_by

    @classmethod
    def get(cls, id: int):
        return MembershipPlan.query.get(id)
     
    @classmethod
    def all(cls):
        return cls.query.filter_by(is_deleted = False, is_active = True).order_by(cls.created_at.desc())
    
    def to_json(self):
        return json.loads(json.dumps({ "id": self.id, "name" : self.name, "description":self.description, "price":self.price, "project_limit" : self.project_limit, "user_limit" : self.user_limit, "plan_duration" : self.plan_duration, "created_by" : self.created_by, "created_at" : self.created_at, "updated_at" : self.updated_at, "updated_by" : self.updated_by, "is_active" : self.is_active }, default=default_proc))
        
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