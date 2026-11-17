import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChooseUs from '../components/ChooseUs';
import HomeSection4 from '../components/HomeSection4';
import Footer from '../components/Footer';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ChooseCard from '../components/ChooseCard';
import "../styles/HomeSection1.css";
import StoreCard from '../components/StoreCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchStore = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch stores when search is clicked or component mounts
        if (searchClicked || searchQuery) {
            fetchStores();
        }
    }, [searchQuery, searchClicked]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:9000/stores/active');
            console.log("response data", response.data);
            setStores(response.data || []);
        } catch (error) {
            console.error('Error fetching stores:', error);
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value) {
            setSearchClicked(true);
        }
    };

    const handleSearchClick = () => {
        setSearchClicked(true);
        fetchStores();
    };

    const handleInputFocus = () => {
        setSearchClicked(true);
        fetchStores();
    };

    const filteredStores = stores.filter(store => {
        if (!searchQuery) return true;
        return store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.pincode?.includes(searchQuery);
    });

    return (
        <div>
            <Navbar />

            <div id="homeSection1MainFirst"
                style={{ paddingTop: "4rem" }}
            >
                <div>
                    <h2>What are you <span>looking</span> for?</h2>
                    <div>
                        <AssignmentOutlinedIcon />
                        <p>Order with prescription.</p>
                        <h4 id="homeSection1MainFirstUpload">UPLOAD NOW &gt;</h4>
                    </div>
                </div>
            </div>

            <div id="homeSection1MainSecond">
                <div>
                    <SearchIcon id='homeSection1MainSecondSearchIcon' />
                    <input 
                        type="text" 
                        name="" 
                        id="" 
                        placeholder='Search for medical stores'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleInputFocus}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
                    />
                    <button onClick={handleSearchClick}>Search</button>
                </div>
            </div>

            <div id="searchStore">
                <div>
                    {loading ? (
                        <p>Loading stores...</p>
                    ) : searchClicked || searchQuery ? (
                        filteredStores.length > 0 ? (
                            filteredStores.map(store => {
                                const imageUrl = store.storeImage 
                                    ? `http://localhost:9000/stores/${store.id}/image`
                                    : 'https://via.placeholder.com/300x200?text=Medical+Store';
                                return (
                                    <StoreCard 
                                        key={store.id}
                                        img={imageUrl} 
                                        name={store.name} 
                                        desc={`${store.address || ''} - ${store.pincode || ''}`}
                                        storeId={store.id}
                                    />
                                );
                            })
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <p style={{ fontSize: '1.2rem', color: '#666' }}>
                                    No medical store available in your area
                                </p>
                            </div>
                        )
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p style={{ fontSize: '1.2rem', color: '#666' }}>
                                Click on the search bar to find medical stores
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <ChooseUs />
            <HomeSection4 />
            <Footer />
        </div>
    )
}

export default SearchStore;