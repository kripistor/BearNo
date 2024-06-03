// frontend/src/assets/components/ProductCharacteristics/ProductCharacteristics.jsx
import React from 'react';
import './ProductCharacteristics.scss';

export default function ProductCharacteristics({ hops, alcohol, ibu, density }) {
    return (
        <div className="product-characteristics">
            <h1>Характеристики</h1>
            <p>Хмель: {hops}</p>
            <p>Плотность: {density}</p>
            <p>Алкоголь: {alcohol}</p>
            <p>Горечь: {ibu}</p>
        </div>
    );
}