# coding=utf-8
import ast

from flask import json
from pytest_bdd import (
    given,
    then,
    when,
)
import pytest

from app import create_app
from app.config.config import API_URL


@pytest.fixture(scope="class")
def app(request):
    """Create flask application (session scope)."""
    app = create_app()

    # prepare the application context
    ctx = app.app_context()
    ctx.push()

    def teardown():
        ctx.pop()

    request.addfinalizer(teardown)

    return app


@pytest.fixture
def client(app):
    with app.test_client() as c:
        yield c


@pytest.fixture
def context():
    return {}


def make_request(client, method, endpoint, payload, headers=None):
    method = method.lower()
    action = getattr(client, method, None)

    if not action:
        raise TypeError(f"Invalid HTTP method {method}")

    res = action(
        endpoint, json=payload if method in ("post", "put") else None, headers=headers
    )

    return res


##################################################################


@given("I am a client <username> and password <password>")
def i_am_a_client_username_and_password_password(username, password, context):
    """I am a client <username> and password <password>."""

    context["username"] = username
    context["password"] = password


@given("I am logged in")
def i_am_logged_in(context, client):
    """I am logged in."""
    payload = {"username": context["username"], "password": context["password"]}

    res = make_request(
        client=client,
        method="POST",
        endpoint=f"{API_URL}/api/auth/login",
        payload=payload,
    )
    data = json.loads(res.data)
    context["access_token"] = data.get("access_token")
    context["refresh_token"] = data.get("refresh_token")


@when("I send a <method> request to <endpoint> with payload <payload>")
def i_send_a_method_request_to_endpoint_with_payload_payload(
    client, context, method, endpoint, payload
):
    """I send a <method> request to <endpoint> with payload <payload>."""

    headers = {"Authorization": f"Bearer {context.get('access_token')}"}

    try:
        context["response"] = make_request(
            client=client,
            method=method,
            endpoint=endpoint,
            payload=payload,
            headers=headers,
        )
    except TypeError:
        assert False, f"Invalid HTTP method {method}"


@then("the HTTP response status should be <response_status>")
def the_http_response_status_should_be_response_status(context, response_status):
    """the HTTP response status should be <response_status>."""
    assert context["response"].status_code == int(response_status)


@then("the JSON response payload should contain the keys <response_keys>")
def the_json_response_payload_should_contain_the_keys_response_keys(
    context, response_keys
):
    """the JSON response payload should contain the keys <response_keys>."""
    if response_keys:
        response_keys = ast.literal_eval(response_keys)
        assert isinstance(
            response_keys, list
        ), f"Invalid response_keys input: {response_keys}"
    data = json.loads(context["response"].data)
    assert all(expected_key in data for expected_key in response_keys)


@then("the response payload should be <response_data> <check_meta_only>")
def the_response_payload_should_be_response_data_check_meta_only(
    context, response_data, check_meta_only
):
    """the response payload should be <json>."""
    response = json.loads(context["response"].data)
    if response_data:
        if check_meta_only and check_meta_only == "True":
            assert "data" in response
            assert len(response["data"]) > 0
        else:
            assert json.loads(context["response"].data) == json.loads(response_data)
    else:
        print("Response data not set, skipping assert.")
