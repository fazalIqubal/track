# coding=utf-8
"""mmo_msg_log endpoints feature tests."""

from pytest_bdd import scenario

from test.helpers import FEATURE_FILE_DIR


@scenario(
    FEATURE_FILE_DIR + "/features/mmo_msg_log.feature", "User makes requests to /mmo_msg_log endpoint"
)
def test_user_makes_requests_to_mmo_msg_log_endpoint():
    """User makes requests to /mmo_msg_log endpoint."""
