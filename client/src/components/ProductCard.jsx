import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, type = 'medicine' }) => {
    const finalPrice = product.discount 
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    return (
        <Card className="product-card">
            {product.discount && (
                <div className="discount-badge">
                    {product.discount}% OFF
                </div>
            )}
            <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                className="product-image"
            />
            <CardContent>
                <Typography variant="h6" component="div" className="product-name">
                    {product.name}
                </Typography>
                {product.brand && (
                    <Typography variant="body2" color="text.secondary" className="product-brand">
                        {product.brand}
                    </Typography>
                )}
                {product.category && (
                    <Typography variant="body2" color="text.secondary" className="product-category">
                        {product.category}
                    </Typography>
                )}
                {product.description && (
                    <Typography variant="body2" className="product-description">
                        {product.description}
                    </Typography>
                )}
                {type === 'labtest' && (
                    <div className="lab-test-info">
                        <Typography variant="body2">
                            {product.fasting ? '🕐 Fasting Required' : '✅ No Fasting'}
                        </Typography>
                        <Typography variant="body2">
                            📄 Report: {product.reportTime}
                        </Typography>
                    </div>
                )}
                <div className="product-price-section">
                    <div className="price-container">
                        <Typography variant="h6" className="final-price">
                            ₹{finalPrice}
                        </Typography>
                        {product.discount && (
                            <Typography variant="body2" className="original-price">
                                ₹{product.price}
                            </Typography>
                        )}
                        {product.originalPrice && (
                            <Typography variant="body2" className="original-price">
                                ₹{product.originalPrice}
                            </Typography>
                        )}
                    </div>
                    {onAddToCart && (
                        <Button 
                            variant="contained" 
                            color="error"
                            onClick={() => onAddToCart(product)}
                            className="add-to-cart-btn"
                        >
                            {type === 'labtest' ? 'Book Test' : 'Add to Cart'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
