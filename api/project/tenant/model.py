from typing import List, Union
from flask import abort
from project.app import db
import uuid 
import json
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import text
from project.utils.util import default_proc

class Tenant(db.Model):
    """This class represents the tenant table."""

    __tablename__ = 'tenant'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text)
    email = db.Column(db.Text, unique=True)
    company_name = db.Column(db.Text)
    mobile = db.Column(db.Numeric(precision=10))
    country = db.Column(db.Text)
    language = db.Column(db.Text)
    company_size = db.Column(db.Text)
    primary_interest = db.Column(db.Text)
    created_at = db.Column(db.TIMESTAMP)
    created_by = db.Column(db.Text)
    updated_at = db.Column(db.Date)
    updated_by = db.Column(db.Text)
    isEmailValidated = db.Column(db.Boolean(), default=False)
    isActive = db.Column(db.Boolean(), default=True)
    isDeleted = db.Column(db.Boolean(), default=False)
    
    def __init__(self, id = None, name = "", email = "", created_by = "", updated_at = "", updated_by = "", company_name = "", mobile = None, country= "", language = "", company_size = "", primary_interest = ""):
        """initialize with id."""
        
        self.id = id
        self.name = name
        self.email = email
        self.company_name = company_name
        self.mobile = mobile
        self.country = country
        self.language = language
        self.company_size = company_size
        self.primary_interest = primary_interest
        self.created_at = datetime.now() 
        self.created_by = created_by
        self.updated_by = updated_by
    @classmethod
    def get(cls, id: int):
        """ Get a tenant for a given ID.
        :param id: the ID of the tenant to retrieve
        :return: the tenant
        """
        return Tenant.query.get(id)
    
    @classmethod
    def all(cls, includeDeleted = 'False'):
        """ Get all available tenant.
        :return: list with all tenant
        """
        if includeDeleted == 'True': 
            return cls.query.order_by(cls.created_at.desc())
        return cls.query.filter_by(isDeleted = False).order_by(cls.created_at.desc())

    
    def to_json(self):
        """ Convert a Tenant object to JSON
        :return: the Tenant JSON representation
        """
        return json.loads(json.dumps({ "id": self.id, "name": self.name, "email": self.email, "company_name": self.company_name, "mobile": self.mobile, "country": self.country, "language": self.language, "company_size": self.company_size, "primary_interest": self.primary_interest, "created_at": self.created_at, "created_by": self.created_by, "updated_at": self.updated_at, "updated_by": self.updated_by, "isEmailValidated": self.isEmailValidated, "isActive": self.isActive, "isDeleted": self.isDeleted}, default=default_proc))
        
    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def update(self):
        db.session.commit()
        
    def exists(self, id):
        return db.session.query(db.exists().where(Tenant.id == id)).scalar()

    def delete(self):
        if self.isDeleted:
            abort(404)
        self.isDeleted = True
        db.session.commit()

    def __repr__(self):
        return "<Tenant: {}>".format(self.name)