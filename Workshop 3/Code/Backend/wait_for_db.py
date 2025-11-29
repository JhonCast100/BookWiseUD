import socket
import time
import sys

HOST = 'db'
PORT = 5432
timeout = 1.0
max_wait = 60
start = time.time()
print(f"Waiting for DB at {HOST}:{PORT}...")
while True:
    try:
        with socket.create_connection((HOST, PORT), timeout=timeout):
            print("DB reachable")
            sys.exit(0)
    except Exception as e:
        elapsed = time.time() - start
        if elapsed > max_wait:
            print(f"Timed out waiting for DB after {max_wait}s: {e}")
            sys.exit(2)
        print('.', end='', flush=True)
        time.sleep(1)
