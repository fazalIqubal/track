# coding=utf-8
"""authentication endpoints feature tests."""
import json

from flask_jwt_extended import get_jti
from pytest_bdd import (
    scenario,
    then,
    when,
)

from test.functional.conftest import make_request
from test.helpers import FEATURE_FILE_DIR
from config import API_URL


@scenario(
    FEATURE_FILE_DIR + "/features/authentication.feature",
    "Client ask for a new access token",
)
def test_client_ask_for_a_new_access_token():
    """Client ask for a new access token."""


@scenario(FEATURE_FILE_DIR + "/features/authentication.feature", "Client logs out")
def test_client_logs_out():
    """Client logs out."""


@scenario(
    FEATURE_FILE_DIR + "/features/authentication.feature",
    "Client tries to login with incorrect and correct credentials",
)
def test_client_tries_to_login_with_incorrect_and_correct_credentials():
    """Client tries to login with incorrect and correct credentials."""


@when("I login")
def i_login(context, client):
    """I login."""
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
    context["response"] = res


@when("I logout")
def i_logout(context, client):
    """I logout."""
    headers = {"Authorization": f"Bearer {context['access_token']}"}

    response = make_request(
        client=client,
        method="POST",
        endpoint="/api/auth/logout",
        payload={},
        headers=headers,
    )

    context["response"] = response


@when("I refresh a token providing my <token_for_refresh>")
def i_refresh_a_token_providing_my_token_for_refresh(
    context, client, token_for_refresh
):
    """I refresh a token providing my <token_for_refresh>."""
    headers = {"Authorization": f"Bearer {context.get(token_for_refresh)}"}

    response = make_request(
        client=client,
        method="POST",
        endpoint="/api/jwt/refresh_token",
        payload={},
        headers=headers,
    )

    context["response"] = response


@then("my access token should be revoked")
def my_access_token_should_be_revoked(app, context):
    """my access token should be revoked."""
    access_token = context.get("access_token")
    if not access_token:
        print(f'Skipping access_token revoke check for username {context["username"]}.')
        return
    access_token_jti = get_jti(access_token)
    assert app.redis_client.get(access_token_jti) is not None
