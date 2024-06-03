import React, {Component} from 'react';
import Header from '../../components/Header/Header.jsx'
import './main.scss'
import BeerCarousel from "../../components/BeerCarousel/BeerCarousel.jsx";
import BeerCard from "../../components/beerCard/BeerCard.jsx";

import Campaigning from "../../components/Campaigning/Campaigning.jsx";
import ProductService from "../../api/ProductService";
import {Link} from "react-router-dom";

class Main extends Component {
    state = {
        products: [],
        popularProducts: [], // New state for popular products
    };

    componentDidMount() {
        ProductService.getAllProducts().then((data) => {
            const promises = data.map(product => {
                return ProductService.getProductImage(product.id).then(image => {
                    product.img = image;
                    return product;
                });
            });

            Promise.all(promises).then(products => {
                // Сортировка продуктов по рейтингу
                const sortedProducts = products.sort((a, b) => b.rating - a.rating);
                this.setState({products: sortedProducts});

                // Сортировка продуктов по количеству голосов
                const popularProducts = [...products].sort((a, b) => b.vote_count - a.vote_count);
                this.setState({popularProducts: popularProducts});
            });
        }).catch((error) => {
            console.error("Error retrieving products: ", error);
        });
    }

    render() {
        return (
            <div>
                <Header/>
                {this.state.products.length > 0 && (
                    <>
                        <p className="popular-bear"> Популярное пиво</p>
                        <BeerCarousel key={this.state.products.length}>
                            {this.state.products.map((product, index) => (
                                product &&
                                <Link to={`/product/${product.id}`} key={index}>
                                    <BeerCard img={product.img} name={product.name} hops={product.hops}
                                              alcohol={product.alcohol} density={product.density} ibu={product.ibu}
                                              rating={product.rating} vote_count={product.vote_count}/>
                                </Link>
                            ))}
                        </BeerCarousel>
                    </>
                )}
                {this.state.popularProducts.length > 0 && (
                    <>
                        <p className="popular-bear"> Пиво с наибольшим количеством голосов</p>
                        <BeerCarousel key={this.state.popularProducts.length}>
                            {this.state.popularProducts.map((product, index) => (
                                product &&
                                <Link to={`/product/${product.id}`} key={index}>
                                    <BeerCard img={product.img} name={product.name} hops={product.hops}
                                              alcohol={product.alcohol} density={product.density} ibu={product.ibu}
                                              rating={product.rating} vote_count={product.vote_count}/>
                                </Link>
                            ))}
                        </BeerCarousel>
                    </>
                )}
                <Campaigning/>
            </div>
        )
    }
}

export default Main;