import uuid
from typing import List
from uuid import UUID

from sqlalchemy import select

from app.models.products import Products
from app.models.review import Reviews
from app.repo.repo import SQLAlchemyRepo


class ProductRepo(SQLAlchemyRepo):
    async def create_product(self, product: Products) -> Products:
        try:
            self.session.add(product)
            await self.session.commit()
            return product
        except Exception as e:
            await self.session.rollback()


    async def get_product_by_id(self, product_id: uuid) -> Products:
        stmt = select(Products).where(Products.id == product_id)
        result = await self.session.execute(stmt)
        product = result.scalars().first()
        return product

    async def get_products_by_user(self, user_id: uuid) -> List[Products]:
        stmt = select(Products).where(Products.user_id == user_id)
        result = await self.session.execute(stmt)
        products = result.scalars().all()
        return products

    async def add_product_review(self, review: Reviews) -> Reviews:
        try:
            self.session.add(review)
            await self.session.commit()
            return review
        except Exception as e:
            await self.session.rollback()

    async def get_product_reviews(self, product_id: uuid) -> List[Reviews]:
        stmt = select(Reviews).where(Reviews.product_id == product_id)
        result = await self.session.execute(stmt)
        reviews = result.scalars().all()
        return reviews

    async def get_all_products(self) -> List[Products]:
        stmt = select(Products)
        result = await self.session.execute(stmt)
        products = result.scalars().all()
        return products

    async def get_most_popular_products(self) -> List[Products]:
        stmt = select(Products).order_by(Products.vote_count.desc()).limit(10)
        result = await self.session.execute(stmt)
        products = result.scalars().all()
        return products

    async def get_most_rated_products(self) -> List[Products]:
        stmt = select(Products).order_by(Products.rating.desc()).limit(10)
        result = await self.session.execute(stmt)
        products = result.scalars().all()
        return products

    async def get_most_rating_products_by_country(self, country: str) -> List[Products]:
        stmt = select(Products).where(Products.county == country).order_by(Products.rating.desc()).limit(10)
        result = await self.session.execute(stmt)
        products = result.scalars().all()
        return products

    async def approve_product(self, product_id: uuid) -> Products:
        product: Products = await self.get_product_by_id(product_id)
        product.is_approved = True
        await self.session.commit()
        return product


    async def update_product_rating(self, product_id: uuid, rating: int) -> Products:
        product: Products = await self.get_product_by_id(product_id)
        if product.rating == 0.0:
            product.rating = rating
        else:
            product.rating = (product.rating + rating) / 2
            print(product.rating)
        product.vote_count += 1
        await self.session.commit()
        return product

    async def delete_product(self, product_id: int) -> Products:
        product: Products = await self.get_product_by_id(product_id)
        self.session.delete(product)
        await self.session.commit()
        return product
