# Setup and running backend

## Development

create python venv
```bash
python -m venv .venv
```

install dependencies
```bash
pip install -r ./requirements.txt
```

from backend dir
```bash
uvicorn app.main:app --reload
```