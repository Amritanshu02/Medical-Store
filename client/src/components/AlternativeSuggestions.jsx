import React from 'react';
import '../styles/AlternativeSuggestions.css';

const AlternativeSuggestions = ({ groups, loading, error, onAddToCart }) => {
    if (loading) {
        return (
            <div className="alt-suggestions">
                <p>Finding in-stock alternatives...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alt-suggestions">
                <p className="alt-error">{error}</p>
            </div>
        );
    }

    if (!groups || groups.length === 0) {
        return null;
    }

    const visibleGroups = groups.filter((group) => group.alternatives && group.alternatives.length > 0);
    if (visibleGroups.length === 0) {
        return null;
    }

    return (
        <div className="alt-suggestions">
            <h2>AI suggested alternatives</h2>
            <p className="alt-intro">
                These in-stock medicines are ranked by composition and usage similarity.
            </p>
            {visibleGroups.map((group, index) => (
                <div key={`${group.for_medicine || group.for_query}-${index}`} className="alt-group">
                    <h3>
                        {group.for_medicine
                            ? `Instead of ${group.for_medicine}${group.out_of_stock ? ' (out of stock)' : ''}`
                            : `Related to "${group.for_query}"`}
                    </h3>
                    <div className="alt-list">
                        {group.alternatives.map((alt) => (
                            <div key={alt.id || alt.name} className="alt-card">
                                <div>
                                    <h4>{alt.name}</h4>
                                    {alt.brand && <p className="alt-brand">{alt.brand}</p>}
                                    {alt.composition && <p className="alt-composition">{alt.composition}</p>}
                                    <p className="alt-reason">{alt.reason}</p>
                                </div>
                                <div className="alt-actions">
                                    {alt.price != null && <p className="alt-price">₹{alt.price}</p>}
                                    {onAddToCart && (
                                        <button
                                            type="button"
                                            className="alt-add-btn"
                                            onClick={() => onAddToCart({
                                                id: alt.id,
                                                name: alt.name,
                                                brand: alt.brand,
                                                composition: alt.composition,
                                                description: alt.description,
                                                price: alt.price,
                                                available: true
                                            })}
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlternativeSuggestions;
