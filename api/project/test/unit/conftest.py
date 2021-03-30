import pytest

from app import create_app


@pytest.fixture(scope="class")
def app(request):
    """Create flask application (session scope)."""
    app = create_app()

    # prepare the application context
    ctx = app.test_request_context()
    ctx.push()

    def teardown():
        ctx.pop()

    request.addfinalizer(teardown)
    request.cls.app = app

    return app
