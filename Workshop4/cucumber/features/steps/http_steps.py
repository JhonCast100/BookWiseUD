import json
import requests
from behave import given, when, then

BASE_URL = 'http://localhost:8000/api'


def _headers(context):
    # Ensure default headers exist and include Authorization if token present
    headers = getattr(context, 'headers', {})
    if 'Content-Type' not in headers:
        headers['Content-Type'] = 'application/json'
    token = getattr(context, 'token', None)
    if token:
        # Accept both Bearer token strings and raw tokens
        if token.startswith('Bearer '):
            headers['Authorization'] = token
        else:
            headers['Authorization'] = f'Bearer {token}'
    context.headers = headers
    return headers


@given('the registration payload:')
def step_given_registration_payload(context):
    # Build payload from table
    row = context.table[0]
    context.payload = dict(row.items())


@given('the book payload:')
def step_given_book_payload(context):
    row = context.table[0]
    context.payload = dict(row.items())


@given('a user with id "{user_id}"')
def step_given_user_id(context, user_id):
    context.user_id = user_id


@given('a book id "{book_id}"')
def step_given_book_id(context, book_id):
    context.book_id = book_id


@given('I set token to "{token}"')
def step_given_set_token(context, token):
    context.token = token
    _headers(context)


@when('I login with email "{email}" and password "{password}" to "{path}"')
def step_when_login(context, email, password, path):
    # posts credentials and stores token from response JSON (token or access_token)
    url = BASE_URL + path
    creds = {'email': email, 'password': password}
    headers = {'Content-Type': 'application/json'}
    resp = requests.post(url, headers=headers, data=json.dumps(creds))
    context.response = resp
    # try to capture token
    try:
        data = resp.json()
        token = data.get('token') or data.get('access_token') or data.get('accessToken')
        if token:
            context.token = token
            _headers(context)
    except Exception:
        # ignore JSON parse errors; no token stored
        pass


@when('I POST the payload to "{path}"')
def step_when_post(context, path):
    url = BASE_URL + path
    headers = _headers(context)
    response = requests.post(url, headers=headers, data=json.dumps(context.payload))
    context.response = response


@when('I POST the payload to "{path}" with:')
def step_when_post_with_table(context, path):
    payload = {row[0]: row[1] for row in context.table}
    headers = _headers(context)
    response = requests.post(BASE_URL + path, headers=headers, data=json.dumps(payload))
    context.response = response


@when('I GET "{path}"')
def step_when_get(context, path):
    headers = _headers(context)
    response = requests.get(BASE_URL + path, headers=headers)
    context.response = response


@when('I PUT the payload to "{path}"')
def step_when_put(context, path):
    headers = _headers(context)
    response = requests.put(BASE_URL + path, headers=headers, data=json.dumps(context.payload))
    context.response = response


@when('I DELETE "{path}"')
def step_when_delete(context, path):
    headers = _headers(context)
    response = requests.delete(BASE_URL + path, headers=headers)
    context.response = response


@then('the response status should be {status:d}')
def step_then_status(context, status):
    assert context.response is not None, 'No response available'
    assert context.response.status_code == status, f'Expected {status}, got {context.response.status_code}: {context.response.text}'


@then('the response JSON should contain "{key}"')
def step_then_json_contains(context, key):
    data = context.response.json()
    assert key in data, f'Key {key} not in response JSON: {data}'


@then('the response JSON should be an array')
def step_then_json_array(context):
    data = context.response.json()
    assert isinstance(data, list), f'Expected JSON array, got {type(data)}'

