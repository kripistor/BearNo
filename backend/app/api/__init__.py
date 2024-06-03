from fastapi import APIRouter
from app.api.v1 import user, product

api_router = APIRouter()
api_router.include_router(user.router, tags=["users"])
api_router.include_router(product.router, tags=["products"])
