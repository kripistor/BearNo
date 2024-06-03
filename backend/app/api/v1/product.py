import uuid
from typing import Any, List
from uuid import UUID
import os
import aiohttp
import bcrypt
from async_fastapi_jwt_auth import AuthJWT
from async_fastapi_jwt_auth.auth_jwt import AuthJWTBearer
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
import requests
from async_fastapi_jwt_auth.exceptions import MissingTokenError
from starlette.responses import Response, FileResponse

from app.core.config import settings
from app.deps.db import CurrentAsyncSession

from app.deps.request_params import ItemRequestParams
from app.models.products import Products
from app.models.review import Reviews
from app.repo.product_repo import ProductRepo
from app.repo.user_repo import UserRepo
from app.schemas.products import ProductCreate, ProductUpdate, ProductRead
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewRead

router = APIRouter(prefix="/products")
auth_dep = AuthJWTBearer()


@router.get("/", response_model=List[ProductRead])
async def get_products(
        session: CurrentAsyncSession,
):
    product_repo: ProductRepo = ProductRepo(session)
    products = await product_repo.get_all_products()
    return products


@router.get("/most_popular", response_model=List[ProductRead])
async def get_most_popular_products(
        session: CurrentAsyncSession,
):
    product_repo: ProductRepo = ProductRepo(session)
    products = await product_repo.get_most_popular_products()
    return products


@router.get("/most_rated", response_model=List[ProductRead])
async def get_most_rated_products(
        session: CurrentAsyncSession,
):
    product_repo: ProductRepo = ProductRepo(session)
    products = await product_repo.get_most_rated_products()
    return products


@router.put("/approve/{product_id}", response_model=ProductRead)
async def approve_product(
        product_id: UUID,
        session: CurrentAsyncSession,
        authorize: AuthJWT = Depends(auth_dep)
):
    raw = await authorize.get_raw_jwt()
    if not raw:
        raise HTTPException(status_code=401, detail="Not authenticated")
    if not raw["is_admin"]:
        raise HTTPException(status_code=401, detail="Not admin")
    product_repo: ProductRepo = ProductRepo(session)
    product = await product_repo.get_product_by_id(product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_approved = True
    await product_repo.approve_product(product_id)
    return product


@router.get("/most_rating_by_country/{country}", response_model=List[ProductRead])
async def get_most_rating_products_by_country(
        country: str,
        session: CurrentAsyncSession,
):
    product_repo: ProductRepo = ProductRepo(session)
    products = await product_repo.get_most_rating_products_by_country(country)
    return products


@router.get("/{product_id}", response_model=ProductRead)
async def get_product(
        product_id: UUID,
        session: CurrentAsyncSession,
):
    product_repo: ProductRepo = ProductRepo(session)
    product = await product_repo.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/image/{product_id}")
async def get_product_image(
        product_id: UUID,
        session: CurrentAsyncSession,
):
    product_repo: ProductRepo = ProductRepo(session)
    product = await product_repo.get_product_by_id(product_id)
    if not product or not product.image_url:
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(product.image_url, media_type="image/jpeg")


@router.put("review/{product_id}", response_model=ReviewRead)
async def add_review_to_product(
        product_id: UUID,
        review: ReviewCreate,
        session: CurrentAsyncSession,
        authorize: AuthJWT = Depends(auth_dep),
):
    product_repo: ProductRepo = ProductRepo(session)
    user_repo: UserRepo = UserRepo(session)
    raw = await authorize.get_raw_jwt()
    if not raw:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = await user_repo.get_user_id_by_email(raw["sub"])
    review = Reviews(product_id=product_id, user_id=user_id, **review.dict())
    result = await product_repo.add_product_review(review)
    await product_repo.update_product_rating(product_id, review.rating)
    return result


@router.get("review/{product_id}", response_model=List[ReviewRead])
async def get_reviews_for_product(
        product_id: UUID,
        session: CurrentAsyncSession,
):
    product_repo: ProductRepo = ProductRepo(session)
    reviews = await product_repo.get_product_reviews(product_id)
    return reviews


@router.get("/user_products/", response_model=List[ProductRead])
async def get_products_by_user(
        session: CurrentAsyncSession,
        authorize: AuthJWT = Depends(auth_dep),
):
    raw = await authorize.get_raw_jwt()
    if not raw:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_repo: UserRepo = UserRepo(session)
    user_id = await user_repo.get_user_id_by_email(raw["sub"])
    product_repo: ProductRepo = ProductRepo(session)
    products = await product_repo.get_products_by_user(user_id)
    return products


@router.post("/create", response_model=ProductRead)
async def create_product_with_photo(
        session: CurrentAsyncSession,
        authorize: AuthJWT = Depends(auth_dep),
        name: str = Form(...),
        rating: int = Form(0),
        hops: str = Form(...),
        alcohol: float = Form(...),
        ibu: int = Form(...),
        density: float = Form(...),
        vote_count: int = Form(0),
        county: str = Form(...),
        is_approved: bool = Form(False),
        photo: UploadFile = File(...),
):
    product_repo: ProductRepo = ProductRepo(session)
    user_repo: UserRepo = UserRepo(session)
    raw = await authorize.get_raw_jwt()
    if not raw:
        raise HTTPException(status_code=401, detail="Not authenticated")
    os.makedirs('photos', exist_ok=True)
    user_uuid = await user_repo.get_user_id_by_email(raw["sub"])
    # Save the file
    filepath = f"photos/{photo.filename}"
    image_url = filepath
    with open(filepath, "wb") as buffer:
        buffer.write(await photo.read())
    print(image_url)
    product = ProductCreate(
        name=name,
        rating=rating,
        hops=hops,
        alcohol=alcohol,
        ibu=ibu,
        density=density,
        vote_count=vote_count,
        county=county,
        is_approved=is_approved,
        image_url=image_url,
        user_id=user_uuid
    )

    product = Products(**product.dict())
    result = await product_repo.create_product(product)
    return result
