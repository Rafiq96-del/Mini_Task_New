import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products({ history }) {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        categories: '',
        img: ''
    });

    const { title, price, description, categories, img } = formData;

    const fetchProducts = async () => {
        const res = await axios.get('/products');
        setProducts(res.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        };
        try {
            await axios.post('/products', formData, config);
            fetchProducts();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const deleteProduct = async id => {
        const config = {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        };
        try {
            await axios.delete(`/products/${id}`, config);
            fetchProducts();
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/users/register');
    };

    return (
        <div>
            <button onClick={logout}>Logout</button>
            <form onSubmit={onSubmit}>
                <input type="text" name="title" value={title} onChange={onChange} placeholder="Title" required />
                <input type="number" name="price" value={price} onChange={onChange} placeholder="Price" required />
                <textarea name="description" value={description} onChange={onChange} placeholder="Description" required></textarea>
                <input type="text" name="categories" value={categories} onChange={onChange} placeholder="Categories" required />
                <input type="text" name="img" value={img} onChange={onChange} placeholder="Image URL" required />
                <button type="submit">Add Product</button>
            </form>
            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <h3>{product.title}</h3>
                        <p>{product.price}</p>
                        <p>{product.description}</p>
                        <p>{product.categories.join(', ')}</p>
                        <img src={product.img} alt={product.title} />
                        <button onClick={() => deleteProduct(product._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Products;
