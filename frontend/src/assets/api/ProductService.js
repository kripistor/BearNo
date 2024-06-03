import axios from "axios";

let serverPath = "";

serverPath = "http://localhost:8000/api/v1"

export default class ProductService {
    static async getAllProducts() {
        return new Promise((resolve, reject) => {
            axios.get(`${serverPath}/products/`).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static approveProduct(id, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${serverPath}/products/approve/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    }


    static createProduct(productData, token) {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            for (let key in productData) {
                if (key === 'photo' && productData[key].length > 0) {
                    // Append the file to the FormData instance
                    formData.append(key, productData[key][0].originFileObj);
                } else {
                    formData.append(key, productData[key]);
                }
            }
            axios.post(`${serverPath}/products/create`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static async getProductById(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${serverPath}/products/${id}`).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static add_product_review(id, data, token) {
        return new Promise((resolve, reject) => {
            axios.put(`${serverPath}/productsreview/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static async getProductReviews(productId) {
        try {
            const response = await axios.get(`${serverPath}/productsreview/${productId}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error during getting product reviews:", error);
            throw error;
        }
    }

    static async getProductImage(id) {
        try {
            const response = await axios.get(`${serverPath}/products/image/${id}`, {
                responseType: "blob",
            });
            return URL.createObjectURL(response.data);

        } catch (error) {
            console.error("Error while fetching product image:", error);
        }
    }
}