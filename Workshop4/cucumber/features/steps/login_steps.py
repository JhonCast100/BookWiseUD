import json
import requests
from behave import given, when, then

BASE_URL = 'http://localhost:8000'

@given('a user with email "{email}" and password "{password}"')
def step_impl_given_user(context, email, password):
    context.user = {"email": email, "password": password}

@when('the user submits valid credentials to "{path}"')
def step_impl_when_submit(context, path):
    url = BASE_URL + path
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, data=json.dumps(context.user))
    context.response = response

@then('the response status should be {status:d}')
def step_impl_then_status(context, status):
    assert context.response is not None, 'No response stored in context'
    assert context.response.status_code == status, f'Expected {status} got {context.response.status_code} - {context.response.text}'

@then('the response JSON should contain "{key}"')
def step_impl_then_json_contains(context, key):
    data = context.response.json()
    assert key in data, f'Key "{key}" not found in response JSON: {data}'
