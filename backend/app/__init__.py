from fastapi import FastAPI
from fastapi_pagination import add_pagination


api = FastAPI()
add_pagination(api)
