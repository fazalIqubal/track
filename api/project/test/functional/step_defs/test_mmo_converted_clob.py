# coding=utf-8
"""mmo_converted_clob endpoints feature tests."""

from pytest_bdd import scenario

from test.helpers import FEATURE_FILE_DIR


@scenario(
    FEATURE_FILE_DIR + "/features/mmo_converted_clob.feature",
    "User makes requests to /mmo_converted_clob endpoint",
)
def test_user_makes_requests_to_mmo_converted_clob_endpoint():
    """User makes requests to /mmo_converted_clob endpoint."""
