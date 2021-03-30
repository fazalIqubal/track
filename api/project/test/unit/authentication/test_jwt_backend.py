from unittest import mock

from flask_bcrypt import Bcrypt
import pytest
import unittest
from flask import g

from authentication.backends.jwt import JWTBackend
from users.model import users


@pytest.mark.usefixtures("app")
class TestJWTBackend(unittest.TestCase):
    def setUp(self) -> None:
        self.backend = JWTBackend(self.app)

    @mock.patch("authentication.backends.jwt.JWTBackend._authenticate_credentials", return_value=None)
    def test_authenticate_token_unsuccessful(self, mock__authenticate_credentials):
        self.backend.authenticate()
        assert "user" not in g

    @mock.patch("authentication.backends.jwt.JWTBackend._authenticate_credentials", return_value=User(username="FRD_OWNER"))
    def test_authenticate_token_successfully(self, mock_post_parser):
        res = self.backend.authenticate()
        assert "user" in g
        assert g.user.username.value == "FRD_OWNER"
        assert "access_token" in res
        assert "refresh_token" in res

    @mock.patch("authentication.backends.jwt.JWTBackend._authenticate_credentials", return_value=User(username="FRD_OWNER"))
    def test_authenticate_token_force_user_authentication(self, mock_post_parser):

        # First make sure it returns the current g user if it is not forced
        initial_user = "initial_user"
        g.user = User(username=initial_user)
        res_initial = self.backend.authenticate()
        assert g.user.username.value == initial_user
        assert "access_token" in res_initial
        assert "refresh_token" in res_initial

        # Then let's force it to re-authenticate
        res_after = self.backend.authenticate(force=True)
        assert g.user.username.value == "FRD_OWNER"
        assert "access_token" in res_after
        assert "refresh_token" in res_after
        assert res_after["access_token"] != res_initial["access_token"]
        assert res_after["refresh_token"] != res_initial["refresh_token"]

    @mock.patch("authentication.backends.jwt.current_app")
    @mock.patch("authentication.backends.jwt.post_parser.parse_args",
                return_value={"username": "FRD_OWNER", "password": "frd_owner"})
    def test__authenticate_credentials_unsuccessful(self, mock_post_parser, mock_current_app):
        username = 'FRD_OWNER'
        password = 'password'
        encrypted_password = self.app.bcrypt.generate_password_hash(password)
        returned_user = User(username=username, password=encrypted_password)
        mock_current_app.bcrypt.check_password_hash = self.app.bcrypt.check_password_hash
        mock_current_app.user_model.get_user.return_value = returned_user

        res = self.backend._authenticate_credentials()

        assert res is None

    @mock.patch("authentication.backends.jwt.current_app")
    @mock.patch("authentication.backends.jwt.post_parser.parse_args",
                return_value={"username": "FRD_OWNER", "password": "frd_owner"})
    def test__authenticate_credentials_successful(self, mock_post_parser, mock_current_app):
        username = 'FRD_OWNER'
        password = 'frd_owner'
        encrypted_password = self.app.bcrypt.generate_password_hash(password)
        returned_user = User(username=username, password=encrypted_password)
        mock_current_app.bcrypt.check_password_hash = self.app.bcrypt.check_password_hash
        mock_current_app.user_model.get_user.return_value = returned_user

        res = self.backend._authenticate_credentials()

        assert isinstance(res, User)
        assert res.username.value == username