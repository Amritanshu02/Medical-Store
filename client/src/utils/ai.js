import axios from 'axios';

const AI_BASE_URL = process.env.REACT_APP_AI_URL || 'http://localhost:8000';

export const suggestAlternatives = async ({ query, medicine, catalog, topK = 5 }) => {
    const compactCatalog = (catalog || []).map((item) => ({
        id: item.id != null ? String(item.id) : undefined,
        name: item.name,
        brand: item.brand,
        composition: item.composition,
        description: item.description,
        substitutes: item.substitutes,
        available: Boolean(item.available),
        price: item.price
    }));

    const response = await axios.post(`${AI_BASE_URL}/suggest-alternatives`, {
        query,
        medicine: medicine
            ? {
                id: medicine.id != null ? String(medicine.id) : undefined,
                name: medicine.name,
                brand: medicine.brand,
                composition: medicine.composition,
                description: medicine.description,
                substitutes: medicine.substitutes,
                available: Boolean(medicine.available),
                price: medicine.price
            }
            : undefined,
        catalog: compactCatalog,
        top_k: topK
    }, { timeout: 15000 });

    return response.data;
};

export default suggestAlternatives;
