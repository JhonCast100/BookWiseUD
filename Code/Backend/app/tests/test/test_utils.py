from app import utils  # o desde donde tengas tus funciones

def test_add():
    assert 2 + 3 == 5

def test_fail_example():
    assert "a".upper() == "A"
