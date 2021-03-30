import pytest
import unittest
from unittest import mock

from flask_jwt_extended import create_access_token
from werkzeug.exceptions import Forbidden

from app import create_app
from authentication.decorators import check_user_token_and_roles
from test.factories import UserRoleFactory
from flask import request


def dummy_view(*args, **kwargs):
    return "view_called"


@mock.patch("authentication.decorators.pool")
@mock.patch("authentication.decorators.get_db_session")
@mock.patch("authentication.decorators.UserRole")
@pytest.mark.usefixtures("app")
class TestAuthenticationDecorators(unittest.TestCase):
    def setUp(self) -> None:
        self.username = "test_user"
        self.role_a = UserRoleFactory.get_instance({"username": self.username})
        self.role_b = UserRoleFactory.get_instance({"username": self.username})
        self.role_c = UserRoleFactory.get_instance({"username": self.username})

    def test_no_roles(self, mock_user_role, mock_db_session, mock_pool):
        access_token = create_access_token(self.username)
        request.headers = {"Authorization": f"Bearer {access_token}"}
        mock_user_role.get_user_roles.return_value = [self.role_a, self.role_b]

        res = check_user_token_and_roles([])(dummy_view)()
        assert res == "view_called"

    def test_partial_roles(self, mock_user_role, mock_db_session, mock_pool):
        access_token = create_access_token(self.role_a.username.value)
        request.headers = {"Authorization": f"Bearer {access_token}"}
        mock_user_role.get_user_roles.return_value = [self.role_a]
        test_role_a = mock.Mock()
        test_role_a.name = self.role_a.granted_role.value
        test_role_b = mock.Mock()
        test_role_b.name = self.role_b.granted_role.value

        with pytest.raises(Forbidden):
            check_user_token_and_roles([test_role_a, test_role_b])(dummy_view)()

    def test_all_and_roles(self, mock_user_role, mock_db_session, mock_pool):
        access_token = create_access_token(self.role_a.username.value)
        request.headers = {"Authorization": f"Bearer {access_token}"}
        test_role_a = mock.Mock()
        test_role_b = mock.Mock()
        test_role_a.name = self.role_a.granted_role.value
        test_role_b.name = self.role_b.granted_role.value
        mock_user_role.get_user_roles.return_value = [self.role_a, self.role_b]
        res = check_user_token_and_roles([test_role_a, test_role_b])(dummy_view)()
        assert res == "view_called"

    def test_all_or_roles(self, mock_user_role, mock_db_session, mock_pool):
        access_token = create_access_token(self.role_a.username.value)
        request.headers = {"Authorization": f"Bearer {access_token}"}
        test_role_a = mock.Mock()
        test_role_b = mock.Mock()
        test_role_a.name = self.role_a.granted_role.value
        test_role_b.name = self.role_b.granted_role.value
        mock_user_role.get_user_roles.return_value = [self.role_a]
        res = check_user_token_and_roles([[test_role_a, test_role_b]])(dummy_view)()
        assert res == "view_called"

    def test_all_and_and_or_roles(self, mock_user_role, mock_db_session, mock_pool):
        access_token = create_access_token(self.role_a.username.value)
        request.headers = {"Authorization": f"Bearer {access_token}"}
        test_role_a = mock.Mock()
        test_role_b = mock.Mock()
        test_role_c = mock.Mock()
        test_role_a.name = self.role_a.granted_role.value
        test_role_b.name = self.role_b.granted_role.value
        test_role_b.name = self.role_c.granted_role.value
        mock_user_role.get_user_roles.return_value = [self.role_a, self.role_c]
        res = check_user_token_and_roles([test_role_a, [test_role_b, test_role_c]])(
            dummy_view
        )()
        assert res == "view_called"

    def test_not_and_all_or_roles(self, mock_user_role, mock_db_session, mock_pool):
        access_token = create_access_token(self.role_a.username.value)
        request.headers = {"Authorization": f"Bearer {access_token}"}
        test_role_a = mock.Mock()
        test_role_b = mock.Mock()
        test_role_c = mock.Mock()
        test_role_a.name = self.role_a.granted_role.value
        test_role_b.name = self.role_b.granted_role.value
        test_role_b.name = self.role_c.granted_role.value
        mock_user_role.get_user_roles.return_value = [self.role_b, self.role_c]

        with pytest.raises(Forbidden):
            check_user_token_and_roles([test_role_a, [test_role_b, test_role_c]])(
                dummy_view
            )()
