# coding=utf-8
"""mmo_ext_data_file endpoints feature tests."""

from pytest_bdd import scenario

from test.helpers import FEATURE_FILE_DIR


@scenario(
    FEATURE_FILE_DIR + "/features/mmo_ext_data_file.feature",
    "User makes requests to /mmo_ext_data_file endpoint",
)
def test_user_makes_requests_to_mmo_ext_data_file_endpoint():
    """User makes requests to /mmo_ext_data_file endpoint."""
