# 1kout

## Setup
Setup env variables on frontend and backend

Backend:
.env file
```txt
MONGO_CONNECTION_STRING=mongodb+srv://{user}:{password}@cluster0.wfq6k8m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
FIRST_SUPERUSER={email}
FIRST_SUPERUSER_PASSWORD={password}
FIRST_SUPERUSER_NICKNAME={name}
```

Frontend:
.env file
```txt
VITE_API_URL=http://localhost:8000 ##development
```
For production use the base url domain of the backend

## Deployment via Docker
```sh
docker compose -f docker-compose.yml up --build -d
```

## Development via Docker
```sh
docker compose -f docker-compose.yml -f docker-compose.override.yml up --build
```

```sh
docker compose watch
```
Will allow you to make changes in the backend that will automatically reload the container

Alternatively you can use development environments and stop the specified container.
```sh
docker compose stop frontend
```
Followed by running the dev environment
```sh
cd frontend
npm run dev
```
for backend
```sh
cd backend
fastapi run --reload "app/main.py"
```
*if running backend outside of docker, will need dependencies installed via requirements.txt in a venv or on local machine

## Logs
For all logs run
```sh
docker compose logs
```
or for a specific service:
```sh
docker compose logs backend
```

## URLs

Development:
Backend - [text](http://0.0.0.0:8000)
Backend Docs - [text](http://0.0.0.0:8000/docs)
Frontend - [text](http://localhost:5173/)

Staging:
Backend Docs - [text](https://staging-api.1khours.com/docs)
Frontend - [text](https://staging.1khours.com/)

