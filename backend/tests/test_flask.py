import pytest

import os
import sys
sys.path.append(os.getcwd())
from app import getApp

class TestAppSetup:
    def test_getApp_for_unit_testing(self):
        """
        Test the getApp function to ensure it returns a Flask app instance.
        """
        a = getApp()
        try:
            assert a is not None
            assert hasattr(a, 'run')
        except AssertionError:
            assert False, "getApp() did not return a valid Flask app instance. Are you sure you ran the tests in the correct directory?"

@pytest.fixture(scope="session")
def app():
    """
    Create a test client for the Flask app.
    """

    return getApp()

@pytest.mark.usefixtures('client_class')
class TestRoutes:
    def test_root_route(self):
        """
        Test the root route of the Flask app.
        """
        response = self.client.get("/")
        assert response.status_code == 200
        assert b"Welcome!" in response.data