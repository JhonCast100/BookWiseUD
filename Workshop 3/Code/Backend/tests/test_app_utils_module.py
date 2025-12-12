# tests/test_app_utils_module.py
import jwt
import pytest
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from app import utils

SECRET_KEY = utils.SECRET_KEY
ALGORITHM = utils.ALGORITHM


def test_create_and_get_user():
    # start from clean state
    utils._users_db.clear()
    data = {"username": "foo@example.com", "role": "user"}
    user = utils.create_user(data)
    assert user.username == "foo@example.com"
    fetched = utils.get_user_by_username("foo@example.com")
    assert fetched is user


def test_decode_jwt_valid():
    payload = {
        "username": "test@example.com",
        "id": 1,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    decoded = utils.decode_jwt(token)
    assert decoded["username"] == "test@example.com"


def test_decode_jwt_expired():
    payload = {
        "username": "test@example.com",
        "id": 1,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) - timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    with pytest.raises(HTTPException) as exc_info:
        utils.decode_jwt(token)
    assert exc_info.value.status_code == 401


def test_decode_jwt_invalid():
    with pytest.raises(HTTPException) as exc_info:
        utils.decode_jwt("not_a_valid_token")
    assert exc_info.value.status_code == 401


def test_get_current_user_auto_create():
    # clear users
    utils._users_db.clear()
    payload = {
        "username": "newuser@example.com",
        "id": 42,
        "rol": "USER",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    user = utils.get_current_user(token)
    assert user is not None
    assert user.username == "newuser@example.com"


def test_get_current_librarian_forbidden():
    user = utils.User("someone", role="user")
    with pytest.raises(HTTPException) as exc_info:
        utils.get_current_librarian(user)
    assert exc_info.value.status_code == 403


def test_optional_auth_none():
    assert utils.optional_auth(None) is None
