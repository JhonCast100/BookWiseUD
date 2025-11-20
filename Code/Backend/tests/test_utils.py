# tests/test_utils.py
import pytest
from fastapi import HTTPException
from app import utils

# 🔹 decode_jwt
def test_decode_jwt_valid(monkeypatch):
    monkeypatch.setattr(utils.jwt, "decode", lambda token, key, algorithms: {"username": "test"})
    payload = utils.decode_jwt("valid_token")
    assert payload["username"] == "test"

def test_decode_jwt_expired(monkeypatch):
    monkeypatch.setattr(utils.jwt, "decode", lambda token, key, algorithms: {"username": "test", "exp": 0})
    with pytest.raises(HTTPException):
        utils.decode_jwt("expired_token")

def test_decode_jwt_invalid(monkeypatch):
    def raise_invalid(*args, **kwargs):
        raise utils.jwt.InvalidTokenError()
    monkeypatch.setattr(utils.jwt, "decode", raise_invalid)
    with pytest.raises(HTTPException):
        utils.decode_jwt("invalid_token")

# 🔹 get_current_user
def test_get_current_user_existing(monkeypatch):
    class DummyUser:
        role = "user"
    monkeypatch.setattr(utils, "get_user_by_username", lambda x: DummyUser())
    user = utils.get_current_user("dummy_token")
    assert user.role == "user"

def test_get_current_user_auto_create(monkeypatch):
    class DummyUser:
        role = "user"
    monkeypatch.setattr(utils, "get_user_by_username", lambda x: None)
    monkeypatch.setattr(utils, "create_user", lambda x: DummyUser())
    user = utils.get_current_user("dummy_token")
    assert user.role == "user"

# 🔹 get_current_librarian
def test_get_current_librarian_admin():
    class DummyAdmin:
        role = "admin"
    assert utils.get_current_librarian(DummyAdmin()).role == "admin"

def test_get_current_librarian_forbidden():
    class DummyUser:
        role = "user"
    with pytest.raises(HTTPException):
        utils.get_current_librarian(DummyUser())

# 🔹 optional_auth
def test_optional_auth_with_token(monkeypatch):
    class DummyUser:
        role = "user"
    monkeypatch.setattr(utils, "get_current_user", lambda x: DummyUser())
    user = utils.optional_auth("dummy_token")
    assert user.role == "user"

def test_optional_auth_without_token():
    assert utils.optional_auth(None) is None
