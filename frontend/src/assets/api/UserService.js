import axios from "axios";
import Cookies from "js-cookie";
import createAuthRefreshInterceptor from 'axios-auth-refresh';

let serverPath = "";

serverPath = "https://bearno.kripistor.ru/api/v1"
// Функция, которая будет вызываться для обновления токена
const refreshAuthLogic = failedRequest => axios.post(serverPath + `/users/refresh?refresh_token=${Cookies.get('refresh_token')}`, {})
    .then(tokenRefreshResponse => {
        Cookies.set('access_token', tokenRefreshResponse.data.access_token);
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.access_token;
        return Promise.resolve();
    });

// Создаем перехватчик
createAuthRefreshInterceptor(axios, refreshAuthLogic);
export default class UserService {
    static async refreshToken() {
        try {
            const response = await axios.post(serverPath + "/users/refresh", {
                refresh_token: Cookies.get('refresh_token'),
            });
            Cookies.set("access_token", response.data.access_token);
            return response;
        } catch (error) {
            console.error("Error during token refresh:", error);
            throw error;
        }
    }

    static async login(email, password) {
        try {
            const response = await axios.post(serverPath + "/users/login", {
                email: email,
                password: password,
            });
            Cookies.set("access_token", response.data.access_token);
            Cookies.set("refresh_token", response.data.refresh_token);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    }

    static async register(email, username, password) {
        try {
            const response = await axios.post(serverPath + "/users/register", {
                email: email,
                password: password,
                username: username,
            });
            Cookies.set("access_token", response.data.access_token);
            Cookies.set("refresh_token", response.data.refresh_token);
            console.log(response);
            return response;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    }

    static async getUserById(userId) {
        try {
            const response = await axios.get(`${serverPath}/users/${userId}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error during getting user:", error);
            throw error;
        }
    }

    static async getUserProducts() {
        const token = Cookies.get('access_token');
        return new Promise((resolve, reject) => {
            axios.get(`${serverPath}/products/user_products/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static async getCurrentUser() {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(`${serverPath}/users/current_user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error during getting current user:", error);
            throw error;
        }
    }

    static async logout() {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
    }
}