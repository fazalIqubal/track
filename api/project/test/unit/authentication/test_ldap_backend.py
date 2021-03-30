import pytest
import unittest

from authentication.backends.ldap import LDAPBackend


@pytest.mark.usefixtures("app")
class TestLDAPBackend(unittest.TestCase):
    def setUp(self) -> None:
        self.backend = LDAPBackend(self.app)

    def test_authenticate_token_unsuccessful(self):
        self.backend.authenticate()

    def test_authenticate_token_successfully(self):
        res = self.backend.authenticate()

    def test_authenticate_token_force_user_authentication(self):
        pass