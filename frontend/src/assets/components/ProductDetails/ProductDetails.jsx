
import React from 'react';
import './ProductDetails.scss';
import { Rate } from "antd";
import ProductCharacteristics from "../ProductCharacteristics/ProductCharacteristics.jsx";

export default function ProductDetails({ img, name, hops, alcohol, ibu, density, rating, vote_count, reviews }) {
    return (
        <div className="product-details">
            <div className="product-photo">
                <h2 className="product-name">{name}</h2>
                <img src={img} alt={name} className="product-image"/>
            </div>
            <div className="product-info">
                <div className="product-rating">
                    <Rate disabled defaultValue={rating}/>
                    <p>{vote_count} голосов</p>
                </div>
                <ProductCharacteristics hops={hops} alcohol={alcohol} ibu={ibu} density={density} />
            </div>
        </div>
    );
}