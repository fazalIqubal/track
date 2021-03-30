from typing import List, Union
from project.app import db
import uuid 
import json
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import text
from project.utils.util import default_proc
from operator import itemgetter 
from http import HTTPStatus
from project.helpers.response import Response
from project.helpers.responseMessages import ResponseMessages

class users(db.Model):
    """This class represents the users table."""
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(200))
    last_name = db.Column(db.String(200))
    address= db.Column(db.String(200))
    username = db.Column(db.String(200))
    encrypted_password = db.Column(db.String(200))
    temp_password = db.Column(db.String(200))
    isreset_password = db.Column(db.Boolean, default= True)
    mobile = db.Column(db.String(200))
    ismobile_verified = db.Column(db.Boolean, default= True)
    email = db.Column(db.Integer)
    isemail_verified = db.Column(db.Boolean, default= False)
    created_at = db.Column(db.TIMESTAMP)
    created_by  = db.Column(db.String(200))
    updated_at = db.Column(db.TIMESTAMP)
    updated_by = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default= True)
    is_deleted = db.Column(db.Boolean, default= False)
    
    def __init__(self,id = None, first_name = "", last_name = "", address="", username= "", 
    encrypted_password="",temp_password = "", mobile="", email="",isemail_verified="", ismobile_verified="",
    created_by="" ):
        """initialize with id."""
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.address = address
        self.username = username
        self.encrypted_password = encrypted_password
        self.temp_password = temp_password
        self.mobile = mobile
        self.email = email
        self.created_at = datetime.now() 
        self.created_by = created_by
    
    @classmethod
    def get(cls, id: int ):
        """ Get a users for a given id.
        :param id: the id of the name to retrieve
        :return: the users
        """
        return users.query.get(id)
    
    @classmethod
    def all(cls,search_data=None):
        """ Get all available users.
        :return: list with all users
        """
        
        if search_data != None:
            return cls.query.filter_by( is_active= True, is_deleted = False).filter( 
                cls.first_name.ilike('%'+search_data+'%') | 
                cls.last_name.ilike('%'+search_data+'%') |
                cls.address.ilike('%'+search_data+'%') |
                cls.username.ilike('%'+search_data+'%') |
                cls.email.ilike('%'+search_data+'%')).order_by(cls.created_at.desc()
                )    
        else:
            return cls.query.filter_by( is_active= True, is_deleted = False).order_by(cls.created_at.desc())

    def to_json(self):
        """ Convert a name object to JSON
        :return: the name JSON representation
        """
        return json.loads(json.dumps({ "id": self.id, "first_name": self.first_name,  "last_name": self.last_name, "address": self.address, "username":self.username,
        "mobile":self.mobile, "email": self.email, "created_by": self.created_by, "created_at": self.created_at, "updated_by":self.updated_by, "updated_at": self.updated_at, "is_active": self.is_active}, default=default_proc))
        
    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def update(self):
        db.session.commit()
        
    def exists(self, id):
        return db.session.query(db.exists().where(id == id)).scalar()
    
    def get_user(self, username):
        query = 'SELECT * FROM users WHERE username ilike :username'.format(
            table_name=self.__tablename__
        )
        params = {"username": username}
        with db.engine.connect() as con:
            result = con.execute(text(query), **params)
        return result.first()

    def get_email(self, email):
        query = 'SELECT * FROM users WHERE email ilike :email'.format(
            table_name=self.__tablename__
        )
        params = {"email": email}
        with db.engine.connect() as con:
            result = con.execute(text(query), **params)
        return result.first()

    def delete(self):
        if self.is_deleted:
            return Response.createFailResponse( self, ResponseMessages.not_exist, HTTPStatus.NO_CONTENT)
        self.is_deleted = True
        db.session.commit()

    def __repr__(self):
        return "<username: {}>".format(self.username)