import pytest
from fastapi import HTTPException
from app import schemas


def test_get_user_direct_not_found(db_session):
    from app.routers.users import get_user
    with pytest.raises(HTTPException) as exc:
        get_user(99999, db=db_session, current_user=object())
    assert exc.value.status_code == 404


def test_create_user_direct_duplicate_email(db_session, sample_user):
    from app.routers.users import create_user
    data = schemas.UserCreate(full_name="X", email=sample_user.email, phone="1", status="active")
    with pytest.raises(HTTPException) as exc:
        create_user(data, db=db_session, current_user=object())
    assert exc.value.status_code == 400


def test_update_user_direct_not_found(db_session):
    from app.routers.users import update_user
    data = schemas.UserCreate(full_name="X", email="x@x.com", phone="1", status="active")
    with pytest.raises(HTTPException) as exc:
        update_user(99999, data, db=db_session, current_user=object())
    assert exc.value.status_code == 404


def test_update_user_direct_duplicate_email(db_session, sample_user):
    from app.routers.users import update_user
    from app.models.user import User

    other = User(auth_id=501, full_name="Other", email="other@ex.com", phone="0", status="active")
    db_session.add(other)
    db_session.commit()

    data = schemas.UserCreate(full_name="N", email=sample_user.email, phone="1", status="active")
    with pytest.raises(HTTPException) as exc:
        update_user(other.user_id, data, db=db_session, current_user=object())
    assert exc.value.status_code == 400


def test_delete_user_direct_not_found(db_session):
    from app.routers.users import delete_user
    with pytest.raises(HTTPException) as exc:
        delete_user(99999, db=db_session, current_user=object())
    assert exc.value.status_code == 404


def test_users_direct_success_paths(db_session):
    from app.routers.users import get_all_users, create_user, update_user, delete_user
    from app.models.user import User
    # ensure no users
    # create a user via create_user
    data = schemas.UserCreate(full_name="A", email="a@e.com", phone="1", status="active")
    created = create_user(data, db=db_session, current_user=object())
    assert created.email == "a@e.com"

    users = get_all_users(db=db_session, current_user=object())
    assert any(u.email == "a@e.com" for u in users)

    # update user
    update_data = schemas.UserCreate(full_name="AA", email="a@e.com", phone="2", status="active")
    updated = update_user(created.user_id, update_data, db=db_session, current_user=object())
    assert updated.full_name == "AA"

    # delete user
    resp = delete_user(created.user_id, db=db_session, current_user=object())
    assert resp["message"]
