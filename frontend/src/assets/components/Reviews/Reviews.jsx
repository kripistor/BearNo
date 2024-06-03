import React, {useEffect, useState} from 'react';
import './Reviews.scss';
import Cookies from 'js-cookie';
import ProductService from "../../api/ProductService";
import {Rate} from 'antd';
import UserService from "../../api/UserService.js";

export default function Reviews({productId, reviews, setReviews, setProductData}) {
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [userNames, setUserNames] = useState({});
    const [hasUserAlreadyReviewed, setHasUserAlreadyReviewed] = useState(false); // Добавьте это состояние

    useEffect(() => {
        const fetchUserNames = async () => {
            const uniqueUserIds = [...new Set(reviews.map(review => review.user_id))];
            const fetchedUserNames = {};

            for (const userId of uniqueUserIds) {
                const user = await UserService.getUserById(userId);
                fetchedUserNames[userId] = user.username;
            }

            setUserNames(fetchedUserNames);
        };

        fetchUserNames();
    }, [reviews]);

    useEffect(() => {
        const checkIfUserHasAlreadyReviewed = async () => {
            const token = Cookies.get('access_token');
            if (token) {
                const currentUser = await UserService.getCurrentUser();
                const userHasAlreadyReviewed = reviews.some(review => review.user_id === currentUser.id);
                setHasUserAlreadyReviewed(userHasAlreadyReviewed);
            }
        };

        checkIfUserHasAlreadyReviewed();
    }, [reviews]);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const token = Cookies.get('access_token');
        if (token) {
            ProductService.add_product_review(productId, {rating, text: reviewText}, token)
                .then((res) => {
                    setReviewText("");
                    setRating(0);
                    setHasUserAlreadyReviewed(true); // Установите состояние в true, если отзыв был успешно добавлен

                    // Fetch the updated list of reviews
                    ProductService.getProductReviews(productId)
                        .then((updatedReviews) => {
                            setReviews(updatedReviews);
                            setProductData(prevData => ({...prevData, vote_count: prevData.vote_count + 1}));
                        })
                        .catch((err) => {
                            console.error("Error retrieving updated product reviews: ", err);
                        });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    return (
        <div className="reviews-container">
            <h1>Отзывы</h1>
            {reviews.map((review, index) => (
                <div key={index} className="review">
                    <h3>{userNames[review.user_id] || review.user_id}</h3>
                    <p>{review.text}</p>
                    <Rate disabled value={review.rating}/>
                </div>
            ))}
            {Cookies.get('access_token') && !hasUserAlreadyReviewed && ( // Показывайте форму и сообщение только если пользователь авторизован и еще не оставлял отзыв
                <>
                    <form onSubmit={handleReviewSubmit}>
                        <Rate onChange={(value) => setRating(value)} value={rating}/>
                        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required/>
                        <button type="submit">Оставить отзыв</button>
                    </form>
                    <p>Пожалуйста, войдите в систему, чтобы оставить отзыв.</p>
                </>
            )}
        </div>
    );
}