import pytest
from pytest_bdd import scenario, given, when, then
from pytest_bdd import parsers

import os
import sys
sys.path.append(os.getcwd())
from app import getApp

@given("I am a client")
def given_client():
    return getApp()

@when("I access the root route")
def when_access_root(client):
    return client.get("/")

@then(parsers.parse("I can see the message {msg:s}"))
def then_see_welcome(response):
    assert response.status_code == 200
    assert bytes(msg) in response.data