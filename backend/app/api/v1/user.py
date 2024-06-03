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
from app.deps.users import hash_password, encode_password
from app.models.user import User
from app.repo.user_repo import UserRepo
from app.schemas.tokens import Tokens
from app.schemas.user import UserRead, UserCreate, UserLogin, UserUpdate

router = APIRouter(prefix="/users")
auth_dep = AuthJWTBearer()


@router.get("/avatars/{filename}")
async def get_avatar(filename: str):
    try:
        return FileResponse(f"avatars/{filename}", media_type="image/jpeg")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Avatar not found")


@router.get("/current_user/avatar")
async def get_current_user_avatar(
        session: CurrentAsyncSession,
        authorize: AuthJWT = Depends(auth_dep)
):
    await authorize.jwt_required()
    user_email = await authorize.get_jwt_subject()
    user_repo: UserRepo = UserRepo(session)
    user = await user_repo.get_user_by_email(user_email)
    print(user.photo_url)
    if not user or not user.photo_url:
        raise HTTPException(status_code=404, detail="Avatar not found")
    return FileResponse(f"avatars/{user.photo_url}", media_type="image/jpeg")


@router.post("/register", response_model=UserRead)
async def register_user(
        user: UserCreate,
        session: CurrentAsyncSession,
):
    user_repo: UserRepo = UserRepo(session)
    hashed_password = hash_password(user.password)
    check_user = await user_repo.get_user_by_email(user.email)
    if check_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = UserCreate(
        username=user.username,
        email=user.email,
        password=hashed_password,
    )
    user = User(**user.model_dump())
    result = await user_repo.create_user(user)
    return result


@router.post("/users/{user_id}/avatar", response_model=UserRead)
async def upload_avatar(
        user_id: int,
        session: CurrentAsyncSession,
        avatar: UploadFile = File(...),
):
    user_repo: UserRepo = UserRepo(session)
    user = await user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Ensure the directory for avatars exists
    os.makedirs('avatars', exist_ok=True)
    new_user = UserUpdate(photo_url=avatar.filename, username=user.username, email=user.email)
    # Save the file
    filepath = f"avatars/{avatar.filename}"
    with open(filepath, "wb") as buffer:
        buffer.write(await avatar.read())

    # Update the user's photo_url
    user.photo_url = avatar.filename
    await user_repo.update_user(new_user, user_id)

    return user


@router.post("/login", response_model=Tokens)
async def login_user(
        user: UserLogin,
        session: CurrentAsyncSession,
):
    user_repo: UserRepo = UserRepo(session)
    db_user = await user_repo.get_user_by_email(user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    if not bcrypt.checkpw(user.password.encode(), db_user.password.encode()):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    async with aiohttp.ClientSession() as session:
        result = await session.post(
            url="http://auth-service:8001/api/v1/auth/access_token",
            params={"email": db_user.email, "is_admin": db_user.is_admin},
        )
        tokens = await result.json()

    return {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
    }


@router.post("/refresh")
async def refresh_token(
        refresh_token: str,
        session: CurrentAsyncSession,
):
    async with aiohttp.ClientSession() as session:
        result = await session.post(
            url="http://auth-service:8001/api/v1/auth/refresh_token",
            headers={"Authorization": f"Bearer {refresh_token}"},
        )
        tokens = await result.json()

    return {"access_token": tokens["access_token"]}


@router.get("/current_user", response_model=UserRead)
async def current_user(
        session: CurrentAsyncSession, authorize: AuthJWT = Depends(auth_dep)
):
    await authorize.jwt_required()
    user_email = await authorize.get_jwt_subject()
    user_repo: UserRepo = UserRepo(session)
    user = await user_repo.get_user_by_email(user_email)
    return user


@router.get("/{user_id}", response_model=UserRead)
async def get_user(
        user_id: UUID,
        session: CurrentAsyncSession,
):
    user_repo: UserRepo = UserRepo(session)
    user = await user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/update_user")
async def update_user(
        user: UserUpdate,
        user_id: int,
        session: CurrentAsyncSession,
        authorize: AuthJWT = Depends(auth_dep),
):
    raw = await authorize.get_raw_jwt()
    if not raw:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_repo: UserRepo = UserRepo(session)
    new_user = await user_repo.update_user(user, user_id)
    return new_user
