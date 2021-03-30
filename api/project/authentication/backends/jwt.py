import logging
from project.helpers.response import Response
from project.helpers.responseMessages import ResponseMessages
from http import HTTPStatus
from flask import current_app, g
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    get_raw_jwt,
    get_jti,
)
from project.authentication.backends.decryption import decrypt, encrypt
from project.app import api 

logger = logging.getLogger(__name__)

post_parser = api.parser()
post_parser.add_argument("username", required=True, location="json")
post_parser.add_argument("password", required=True, location="json")


logout_post_parser = api.parser()
logout_post_parser.add_argument("refresh_token", required=False, location="json")


class JWTBackend:
    def __init__(self, app):
        self.jwt = JWTManager(app)
        self.jwt.token_in_blacklist_loader(self.check_if_token_in_blacklist)
        self.jwt.expired_token_loader(self.error_token_callback)
        self.jwt.invalid_token_loader(self.error_token_callback)
        self.jwt.revoked_token_loader(self.error_token_callback)

    @staticmethod
    def error_token_callback(error_msg=None):
        return {"message": "Not authorized."}, 401

    @staticmethod
    def check_if_token_in_blacklist(decrypted_token):
        """ Check if a given token was revoked.

        Revoked tokens are tokens that are still valid for the JWT algorithm (they are
        within the expiry time window) but were revoked for some reason (e.g. user logged out).

        Revoked tokens are kept on redis so if JWT blacklist is disabled OR
        redis_client is not set as 'current_app' attribute the blacklist won't be active.

        :param decrypted_token: the token sent by the user to be checked
        :return: if the token is revoked or not
        """
        if not hasattr(current_app, "redis_client"):
            return False

        revoked_token = current_app.redis_client.get(decrypted_token["jti"])
        if not revoked_token:
            return False

        return revoked_token.decode("utf-8") == "true"

    def _authenticate_credentials(self):
       
        """ Authenticate a user through username/password credentials.

        Independent from DB technology as far as the model User implements
        own query to retrieve a user by providing a username.

        Expects username and password attributed in User model.

        The authentication is done by encrypting the input password
        and comparing it with the stored password.

        :return: authenticated user or None
        """
        user_model = getattr(current_app, "user_model")
        bcrypt = getattr(current_app, "bcrypt")
      

        if not user_model or not hasattr(user_model, "get_user"):
            logger.info("User model doesn't implement get_by_username function.")
            return None

        if not bcrypt:
            logger.info("bcrypt is not set in current_app")
            return None

        args = post_parser.parse_args()
        username = args.get("username")
        password = args.get("password")
        user = user_model.get_user(username)
        
        if user is None:
            return Response.createFailResponse( self, ResponseMessages.not_found, HTTPStatus.NOT_FOUND)
        else:
            if user.isemail_verified == False:
                if user.temp_password == password:
                    return user
                
            elif user.isemail_verified == True:
                key = 'abc123'.encode()
                decrypted_password = decrypt(key, user.encrypted_password)
                if decrypted_password.decode() == password:
                    return user  
        return None 

    def authenticate(self, force: bool = False) -> dict:
        """ Authenticate a user.

        If no other backend authenticated the user previously, then
        try to authenticate the user with the username/password provided
        and generate access_token + refresh_token.

        If the user was previously authenticated by other backend,
        then generate access_token + refresh_token only.

        :param force: if authentication previously made by other backends
            should be ignored
        :return: dict containing access_token and refresh_token
        """

        if force or "user" not in g:
            user = self._authenticate_credentials()
            if not user:
                return
            g.user = user

        return {
            "access_token": create_access_token(identity=g.user.username),
            "refresh_token": create_refresh_token(identity=g.user.username ),
            "email_verified": g.user.isemail_verified,
            "user_id": g.user.id
        }

    def logout(self):
        """ Logout a user by adding its token to the blacklist.

        A token is only revoked and blacklisted if JWT_BLACKLIST_ENABLED config is active
        and 'current_app' has an attribute redis_client which is a client for Redis.

        Optionally, a client can pass the current refresh_token to be revoked as well
        together with the current access_token.
        """
        if current_app.config.get("JWT_BLACKLIST_ENABLED", False) and hasattr(
            current_app, "redis_client"
        ):
            args = logout_post_parser.parse_args()
            if args.get("refresh_token"):
                current_app.redis_client.set(get_jti(args.get("refresh_token")), "true")
            jti = get_raw_jwt()["jti"]
            current_app.redis_client.set(jti, "true")
