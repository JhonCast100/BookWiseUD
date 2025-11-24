import sys
import yaml
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
files = [repo / 'docker-compose.yml', repo / '.github' / 'workflows' / 'e2e-ci.yml', repo / '.github' / 'workflows' / 'ci.yml']
ok = True
for f in files:
    try:
        with f.open('r', encoding='utf-8') as fh:
            yaml.safe_load(fh)
        print(f'{f}: OK')
    except Exception as e:
        print(f'{f}: ERROR: {e}')
        ok = False

sys.exit(0 if ok else 2)
