import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomeSection1 from '../components/HomeSection1';
import HomeSection4 from '../components/HomeSection4';
import ChooseUs from '../components/ChooseUs';
import FeaturedBrand from '../components/FeaturedBrand';
import HealthConcern from '../components/HealthConcern';

const Home = () => {
    return (
        <div>
            <Navbar />
            <HomeSection1 />
            {/* <HealthConcern /> */}
            {/* <FeaturedBrand /> */}
            {/* Home */}
            <ChooseUs />
            <HomeSection4 />
            <Footer />
        </div>
    )
}

export default Home;