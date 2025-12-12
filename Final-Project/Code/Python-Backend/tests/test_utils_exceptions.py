import pytest
from fastapi import HTTPException


def test_decode_jwt_handles_expired(monkeypatch):
    import jwt
    from app import utils

    def fake_decode(token, key, algorithms):
        raise jwt.ExpiredSignatureError()

    monkeypatch.setattr(jwt, "decode", fake_decode)

    with pytest.raises(HTTPException) as exc:
        utils.decode_jwt("any")
    assert exc.value.status_code == 401


def test_decode_jwt_handles_invalid(monkeypatch):
    import jwt
    from app import utils

    def fake_decode(token, key, algorithms):
        raise jwt.InvalidTokenError()

    monkeypatch.setattr(jwt, "decode", fake_decode)

    with pytest.raises(HTTPException) as exc:
        utils.decode_jwt("any")
    assert exc.value.status_code == 401
