import json
import requests
from behave import given, when, then

BASE_URL = 'http://localhost:8000/api'

@given('a user with email "{email}" and password "{password}"')
def step_impl_given_user(context, email, password):
    context.user = {"email": email, "password": password}

@when('the user submits valid credentials to "{path}"')
def step_impl_when_submit(context, path):
    url = BASE_URL + path
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, data=json.dumps(context.user))
    context.response = response
