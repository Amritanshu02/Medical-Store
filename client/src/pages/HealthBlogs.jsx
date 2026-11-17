import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchIcon from '@mui/icons-material/Search';
import { healthBlogsData } from '../data/products';
import '../styles/HealthBlogs.css';

const HealthBlogs = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBlogs = healthBlogsData.filter(blog => {
        return blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.author?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div>
            <Navbar />
            <div className="blogs-container">
                <h1 className="page-title">Health Blogs</h1>
                <div className="search-section">
                    <div className="search-bar">
                        <SearchIcon className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search health blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="blogs-grid">
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map(blog => (
                            <div key={blog.id} className="blog-card">
                                <img src={blog.image} alt={blog.title} className="blog-image" />
                                <div className="blog-content">
                                    <span className="blog-category">{blog.category}</span>
                                    <h3 className="blog-title">{blog.title}</h3>
                                    <p className="blog-excerpt">{blog.excerpt}</p>
                                    <div className="blog-meta">
                                        <span className="blog-author">By {blog.author}</span>
                                        <span className="blog-date">{new Date(blog.date).toLocaleDateString()}</span>
                                    </div>
                                    <button className="read-more-btn">Read More</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No blogs found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HealthBlogs;
