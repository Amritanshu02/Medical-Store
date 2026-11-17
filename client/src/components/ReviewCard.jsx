import React from 'react';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import "../styles/ReviewCard.css";

const ReviewCard = (props) => {
    return (
        <div id='reviewCardMain'>
            <div id="reviewUserDetail">
                <h3>{props.name}</h3>
                <p>{props.date}</p>
            </div>
            <div id="reviewUserComment">
                <FormatQuoteRoundedIcon id="quoteIcon" />
                <p>{props.desc}</p>
            </div>
        </div>
    )
}

export default ReviewCard;