from flask import g
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from functools import wraps

from flask_restx import abort
from flask_restx._http import HTTPStatus

#from project.app import get_db_session, pool
from project.users.model import users


def check_user_token_and_roles(roles):
    def wrapper(view_func):
        @wraps(view_func)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            username = get_jwt_identity()

            if not username:
                abort(HTTPStatus.FORBIDDEN, HTTPStatus.FORBIDDEN.phrase)

            g.user = users(username=username)

            db = get_db_session(username)
            user_roles = [
                role.granted_role.value
                for role in UserRole.get_user_roles(db, username)
            ]

            # connection are released only after the execution of the function where they are acquired
            # which means if the view_func acquires a connection, then a user request will use 2 connection
            # one here to get the roles and another one inside view_func execution. So let's release this one
            pool.release(db)

            permissions = []

            for role in roles:
                if isinstance(role, list):
                    permissions.append(any(r.name in user_roles for r in role))
                else:
                    permissions.append(role.name in user_roles)

            if all(permissions):
                return view_func(*args, **kwargs)

            return abort(
                HTTPStatus.FORBIDDEN, "User doesn't have the required permissions."
            )

        return decorator

    return wrapper
