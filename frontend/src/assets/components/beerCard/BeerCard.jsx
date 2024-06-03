import {Card, Rate, Space} from "antd";
import React from "react";
import './BeerCard.scss'

export default function BeerCard({ img, name, hops, alcohol, ibu, density, rating, vote_count }) {
    return (
        <Space direction="vertical">
            <Card
                className="card"
                title={name}
            >
                <div className="beer-content">
                    <img alt={name} src={img} className="beer-image" />
                    <div className="beer-reviews">
                        <p>{rating.toFixed(1)}</p>
                        <Rate disabled defaultValue={rating}/>
                        <p>{vote_count} голосов</p>
                    </div>
                </div>
                <div className="beer-characteristics">
                    <p>Хмель: {hops}</p>
                    <p>Плотность: {density}</p>
                    <p>Алкоголь: {alcohol}</p>
                    <p>Горечь: {ibu}</p>
                </div>
            </Card>
        </Space>
    )
}