import React from 'react';
import "../styles/FeaturedCard.css";
import { Link } from 'react-router-dom';

const FeaturedCard = (props) => {
    return (
        <Link id='featuredCardMain' to={'#'}>
            <div id='featuredCardMainContainer'>
                <div id='featuredCardMainTop'>
                    <img src={props.src} alt="Image" />
                </div>
                <div id='featuredCardMainBottom'>
                    <p>{props.name}</p>
                </div>
            </div>
        </Link>
    )
}

export default FeaturedCard;