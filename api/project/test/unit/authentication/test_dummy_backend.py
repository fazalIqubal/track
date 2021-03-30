from unittest import mock

import pytest
import unittest

from authentication.backends.dummy import DummyBackend
from users.model import users
from flask import g


@pytest.mark.usefixtures("app")
class TestDummyBackend(unittest.TestCase):
    def setUp(self) -> None:
        self.backend = DummyBackend(self.app)

    @mock.patch("authentication.backends.dummy.post_parser.parse_args", return_value={"username": "invalid_user", "password": "invalid_user"})
    def test_authenticate_unsuccessful(self, mock_post_parser):
        self.backend.authenticate()
        assert "user" not in g

    @mock.patch("authentication.backends.dummy.post_parser.parse_args",
                return_value={"username": "FRD_OWNER", "password": "frd_owner"})
    def test_authenticate_successfully(self, mock_post_parser):
        self.backend.authenticate()
        assert "user" in g
        assert g.user.username.value == "FRD_OWNER"

    @mock.patch("authentication.backends.dummy.post_parser.parse_args",
                return_value={"username": "FRD_OWNER", "password": "frd_owner"})
    def test_authenticate_force_user_authentication(self, mock_post_parser):
        # First make sure it returns the current g user if it is not forced
        initial_user = "initial_user"
        g.user = User(username=initial_user)
        self.backend.authenticate()
        assert g.user.username.value == initial_user

        # Then let's force it to re-authenticate
        self.backend.authenticate(force=True)
        assert g.user.username.value == "FRD_OWNER"