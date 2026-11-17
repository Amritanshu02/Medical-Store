import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { healthConcernData } from "../data";
import "../styles/FeaturedBrand.css";
import FeaturedCard from './FeaturedCard';

const HealthConcern = () => {

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    return (
        <div id='featuredBrandMain'>
            <h1>Shop by <span>health</span> concerns</h1>
            {/* <p>Pick from our favourite brands</p> */}
            <p></p>
            <Carousel
                swipeable={true}
                draggable={true}
                // showDots={true}
                responsive={responsive}
                // ssr={true} // means to render carousel on server-side.
                // infinite={true}
                // autoPlay={this.props.deviceType !== "mobile" ? true : false}
                // autoPlay={true}
                // autoPlaySpeed={5000}
                // keyBoardControl={true}
                // customTransition="all .5"
                // transitionDuration={500}
                // containerClass="carousel-container"
                // removeArrowOnDeviceType={["tablet", "mobile"]}
                // deviceType={this.props.deviceType}
                // dotListClass="custom-dot-list-style"
                // itemClass="carousel-item-padding-40-px"
                id='featuredBrandMainContent'
            >
                {/* {reviewdata.map((item) => (<ReviewCard name={item.name} date={item.date} desc={item.desc} />))} */}
                {healthConcernData.map((item) => (<FeaturedCard name={item.name} src={item.src} />))}
                {/* <FeaturedCard /> */}
            </Carousel>
        </div>
    )
}

export default HealthConcern;