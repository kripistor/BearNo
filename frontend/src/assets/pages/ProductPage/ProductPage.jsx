import React, { useState, useEffect } from 'react';
import './ProductPage.scss';
import Header from "../../components/Header/Header.jsx";
import ProductDetails from "../../components/ProductDetails/ProductDetails.jsx";
import Reviews from "../../components/Reviews/Reviews.jsx";
import ProductService from "../../api/ProductService";
import { useParams } from 'react-router-dom';

export default function ProductPage() {
    const { id } = useParams();
    const [productData, setProductData] = useState(null);
    const [productImage, setProductImage] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        ProductService.getProductById(id).then(data => {
            setProductData(data);
        }).catch(error => {
            console.error("Error retrieving product: ", error);
        });

        ProductService.getProductImage(id).then(image => {
            setProductImage(image);
        }).catch(error => {
            console.error("Error retrieving product image: ", error);
        });

        ProductService.getProductReviews(id).then(reviews => {
            setReviews(reviews);
        }).catch(error => {
            console.error("Error retrieving product reviews: ", error);
        });
    }, [id]);

    if (!productData || !productImage) {
        return <div>
            <Header/>
            <h1 className="not-found">Такого товара не найдено :(</h1>
        </div>;
    }

    return (
        <div className="product-page">
            <Header/>
            <ProductDetails img={productImage} {...productData} />

            <Reviews productId={id} reviews={reviews} setReviews={setReviews} setProductData={setProductData} />
        </div>
    );
}