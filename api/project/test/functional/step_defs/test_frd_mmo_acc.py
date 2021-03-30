# coding=utf-8
"""frd_mmo_acc endpoints feature tests."""
import ast
import json
from pytest_bdd import (
    scenario,
    then,
    when,
)

from app import get_db_session
from test.factories import FRDMmoAccFactory
from test.functional.conftest import make_request
from test.helpers import FEATURE_FILE_DIR


@scenario(
    FEATURE_FILE_DIR + "/features/frd_mmo_acc.feature",
    "User makes POST requests to /frd_mmo_acc endpoint",
)
def test_user_makes_post_requests_to_frd_mmo_acc_endpoint():
    """User makes POST requests to /frd_mmo_acc endpoint."""


@scenario(
    FEATURE_FILE_DIR + "/features/frd_mmo_acc.feature",
    "User makes requests to /frd_mmo_acc endpoint",
)
def test_user_makes_requests_to_frd_mmo_acc_endpoint():
    """User makes requests to /frd_mmo_acc endpoint."""


@when("I send a POST request to <endpoint> with payload <payload>")
def i_send_a_post_request_to_endpoint_with_payload_payload(
    client, context, endpoint, payload
):
    """I send a POST request to <endpoint> with payload <payload>."""

    headers = {"Authorization": f"Bearer {context['access_token']}"}

    payload = json.loads(payload)
    context["response"] = make_request(
        client=client,
        method="POST",
        endpoint=endpoint,
        payload=payload,
        headers=headers,
    )


@then("the new newly created entry with <payload> exists on the database")
def the_new_newly_created_entry_with_payload_exists_on_the_database(context, payload):
    """the new newly created entry with <payload> exists on the database."""
    if context["response"].status_code == 201:
        payload = json.loads(payload)
        row_id = json.loads(context["response"].data)["id"]
        db = get_db_session(context["username"])
        instance = FRDMmoAccFactory.get_by_id(db, row_id)
        assert instance.id.value == row_id
        assert all(payload[key] == getattr(instance, key).value for key in payload)
        assert instance.created_by.value == context["username"]
        assert instance.created_date is not None
        assert instance.last_updated_by.value == context["username"]
        assert instance.last_update_date.value == instance.created_date.value
    else:
        print(f"Skipping checking payload because response was not 2XX")
