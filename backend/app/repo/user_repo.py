from typing import List
from uuid import UUID

from sqlalchemy import select

from app.models.user import User
from app.repo.repo import SQLAlchemyRepo
from app.schemas.user import UserUpdate


class UserRepo(SQLAlchemyRepo):
    async def create_user(self, user: User) -> User:
        try:
            self.session.add(user)
            await self.session.commit()
            return user
        except Exception as e:
            await self.session.rollback()

    async def get_user_by_email(self, email: str) -> User:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        user = result.scalars().first()
        return user

    async def get_user_id_by_email(self, email: str) -> UUID:
        stmt = select(User.id).where(User.email == email)
        result = await self.session.execute(stmt)
        user_id = result.scalars().first()
        return user_id

    async def get_user_by_id(self, user_id: UUID) -> User:
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        user = result.scalars().first()
        return user

    async def update_user(self, user_in: UserUpdate, user_id: int) -> User:
        user: User = await self.get_user_by_id(user_id)
        updated_user = user_in.model_dump(exclude_unset=True)
        for field, value in updated_user.items():
            setattr(user, field, value)
        await self.session.commit()
        return user
