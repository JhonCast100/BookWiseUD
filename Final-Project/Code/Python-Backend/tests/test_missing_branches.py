import pytest
from datetime import date


def test_create_loan_user_not_found(client, sample_book, admin_headers):
    body = {"book_id": sample_book.book_id, "user_id": 99999}
    resp = client.post("/loans/", json=body, headers=admin_headers)
    assert resp.status_code == 404


def test_create_loan_user_not_active(client, db_session, sample_book, sample_user, admin_headers):
    # make user inactive
    sample_user.status = "inactive"
    db_session.commit()

    body = {"book_id": sample_book.book_id, "user_id": sample_user.user_id}
    resp = client.post("/loans/", json=body, headers=admin_headers)
    assert resp.status_code == 400


def test_create_loan_book_not_found(client, sample_user, admin_headers):
    body = {"book_id": 99999, "user_id": sample_user.user_id}
    resp = client.post("/loans/", json=body, headers=admin_headers)
    assert resp.status_code == 404


def test_create_loan_book_not_available(client, db_session, sample_book, sample_user, admin_headers):
    # mark book as loaned
    sample_book.status = "loaned"
    db_session.commit()

    body = {"book_id": sample_book.book_id, "user_id": sample_user.user_id}
    resp = client.post("/loans/", json=body, headers=admin_headers)
    assert resp.status_code == 400


def test_return_loan_not_found(client, admin_headers):
    resp = client.put("/loans/return/99999", headers=admin_headers)
    assert resp.status_code == 404


def test_return_loan_already_returned(client, db_session, sample_book, sample_user, admin_headers):
    # create a returned loan
    from app.models.loan import Loan
    loan = Loan(book_id=sample_book.book_id, user_id=sample_user.user_id, loan_date=date.today(), status="returned")
    db_session.add(loan)
    db_session.commit()

    resp = client.put(f"/loans/return/{loan.loan_id}", headers=admin_headers)
    assert resp.status_code == 400


def test_get_loan_not_found(client, admin_headers):
    resp = client.get("/loans/99999", headers=admin_headers)
    assert resp.status_code == 404


def test_delete_loan_not_found(client, admin_headers):
    resp = client.delete("/loans/99999", headers=admin_headers)
    assert resp.status_code == 404


def test_delete_loan_active_updates_book(client, db_session, sample_book, sample_user, admin_headers):
    from app.models.loan import Loan
    # ensure book is available then create loan
    sample_book.status = "available"
    db_session.commit()
    loan = Loan(book_id=sample_book.book_id, user_id=sample_user.user_id, loan_date=date.today(), status="active")
    sample_book.status = "loaned"
    db_session.add(loan)
    db_session.commit()

    resp = client.delete(f"/loans/{loan.loan_id}", headers=admin_headers)
    assert resp.status_code == 200
    # refresh book
    db_session.refresh(sample_book)
    assert sample_book.status == "available"


def test_get_user_not_found(client, admin_headers):
    resp = client.get("/users/99999", headers=admin_headers)
    assert resp.status_code == 404


def test_create_user_duplicate_email(client, sample_user, admin_user, admin_headers):
    body = {
        "full_name": "Dup",
        "email": sample_user.email,
        "phone": "123",
        "status": "active"
    }
    resp = client.post("/users/", json=body, headers=admin_headers)
    assert resp.status_code == 400


def test_create_user_duplicate_auth_id(client, sample_user, admin_user, admin_headers):
    body = {
        "full_name": "Dup",
        "email": "other@example.com",
        "phone": "123",
        "status": "active",
        "auth_id": sample_user.auth_id
    }
    resp = client.post("/users/", json=body, headers=admin_headers)
    assert resp.status_code == 400


def test_update_user_not_found(client, admin_headers):
    body = {"full_name": "X", "email": "x@x.com", "phone": "1", "status": "active"}
    resp = client.put("/users/99999", json=body, headers=admin_headers)
    assert resp.status_code == 404


def test_update_user_duplicate_email(client, db_session, sample_user, admin_user, admin_headers):
    # create another user
    from app.models.user import User
    other = User(auth_id=500, full_name="Other", email="other@ex.com", phone="0", status="active")
    db_session.add(other)
    db_session.commit()

    body = {"full_name": "New", "email": sample_user.email, "phone": "1", "status": "active"}
    resp = client.put(f"/users/{other.user_id}", json=body, headers=admin_headers)
    assert resp.status_code == 400


def test_delete_user_not_found(client, admin_headers):
    resp = client.delete("/users/99999", headers=admin_headers)
    assert resp.status_code == 404
