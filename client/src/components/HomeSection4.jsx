import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../styles/HomeSection4.css";
import { reviewdata } from "../data";
import ReviewCard from './ReviewCard';

const HomeSection4 = () => {

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    return (
        <div id='homeSection4Main'>
            <h1>What Our <span>Customers</span> have to Say</h1>
            <Carousel
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                // ssr={true} // means to render carousel on server-side.
                infinite={true}
                // autoPlay={this.props.deviceType !== "mobile" ? true : false}
                // autoPlay={true}
                // autoPlaySpeed={5000}
                // keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                // containerClass="carousel-container"
                // removeArrowOnDeviceType={["tablet", "mobile"]}
                // deviceType={this.props.deviceType}
                // dotListClass="custom-dot-list-style"
                // itemClass="carousel-item-padding-40-px"
                id="reviewCarousel"
            >
                {reviewdata.map((item) => (<ReviewCard name={item.name} date={item.date} desc={item.desc} />))}
            </Carousel>
        </div>
    )
}

export default HomeSection4