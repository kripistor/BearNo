import React, {useState, useEffect} from 'react';
import {Modal, Button, Form, Input, InputNumber, Upload, Select} from 'antd';
import ProductService from '../../api/ProductService';
import UserService from '../../api/UserService';
import Cookies from 'js-cookie';
import {Card} from 'antd';
import Header from "../../components/Header/Header.jsx";
import './UserProfile.scss';
import {useNavigate} from 'react-router-dom';

export default function UserProfile() {
    const [products, setProducts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log(values);
                form.resetFields();
                ProductService.createProduct(values, Cookies.get('access_token'))
                    .then((res) => {
                        UserService.getUserProducts()
                            .then((userProducts) => {
                                const promises = userProducts.map(product => {
                                    return ProductService.getProductImage(product.id).then(image => {
                                        product.photo = image;
                                        return product;
                                    });
                                });

                                Promise.all(promises).then(productsWithImages => {
                                    setProducts(productsWithImages);
                                    setIsModalVisible(false);
                                });
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    })
                    .catch((err) => {
                        console.error(err.response.data);
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        const token = Cookies.get('access_token');
        if (!token) {
            navigate('/');
        } else {
            UserService.getUserProducts()
                .then((userProducts) => {
                    const promises = userProducts.map(product => {
                        return ProductService.getProductImage(product.id).then(image => {
                            product.photo = image;
                            return product;
                        });
                    });

                    Promise.all(promises).then(productsWithImages => {
                        setProducts(productsWithImages);
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        }

    }, []);

    return (
        <div>
            <Header/>
            <div className="user-products">
                {products.map((product, index) => (
                    <Card
                        title={product.name}
                        key={index}
                        cover={<img alt={product.name} src={product.photo}/>}
                    >
                        <p style={{color: product.is_approved ? 'green' : 'red'}}>
                            {product.is_approved ? 'Одобрено' : 'На рассмотрении'}
                        </p>
                    </Card>
                ))}
            </div>
            <div className="add-product-button">
                <Button type="primary" onClick={showModal}>
                    Добавить товар
                </Button>
            </div>
            <Modal title="Добавить товар" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" name="product_form">
                    <Form.Item name="name" rules={[{required: true}]}>
                        <Input placeholder="Название"/>
                    </Form.Item>
                    <Form.Item name="hops" rules={[{required: true}]}>
                        <Input placeholder="Хмель"/>
                    </Form.Item>
                    <Form.Item name="alcohol" rules={[{required: true}]}>
                        <InputNumber placeholder="Алкоголь"/>
                    </Form.Item>
                    <Form.Item name="ibu" rules={[{required: true}]}>
                        <InputNumber placeholder="IBU"/>
                    </Form.Item>
                    <Form.Item name="density" rules={[{required: true}]}>
                        <InputNumber placeholder="Плотность"/>
                    </Form.Item>
                    <Form.Item name="county" rules={[{required: true}]}>
                        <Select placeholder="Страна">
                            <Select.Option value="Россия">Россия</Select.Option>
                            <Select.Option value="Германия">Германия</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="photo" valuePropName="fileList" getValueFromEvent={normFile}
                               rules={[{required: true}]}>
                        <Upload name="logo" action="/upload.do" listType="picture">
                            <Button>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

function normFile(e) {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
}