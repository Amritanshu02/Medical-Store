import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/DisplayCard.css";

const DisplayCard = (props) => {
    return (
        <Link id='displayCardMainLink' to={props.link}>
            <div id={props.choose ? 'displayCardMain2' : 'displayCardMain'}>
                <img src={props.src} alt="Image" id='displayCardImg' />
                <p id='displayCardHeading'>{props.title}</p>
                <p id='displayCardOffer'>{props.offer}</p>
            </div>
        </Link>
    )
}

export default DisplayCard;