import React from 'react';
import "../styles/ChooseUs.css";
import DisplayCard from './DisplayCard';
import ChooseCard from './ChooseCard';

const data = [
    // {
    //     src: 'https://assets.pharmeasy.in/apothecary/images/medicine_ff.webp?dim=720x0',
    //     title: '3 Million+',
    //     desc: 'Satisfied customer as of Aug 31, 2024',
    // },
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/deliveryBoy.svg?dim=256x0',
        title: '10k+',
        desc: 'Orders on ARCEE Medicals till date',
    },
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/pincodeServed.svg?dim=256x0',
        title: '9900+',
        desc: 'Unique items sold last 3 months',
    },
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/locationMarker.svg?dim=256x0',
        title: '190+',
        desc: 'Pin codes serviced last 3 months',
    },
];

const ChooseUs = () => {
    return (
        <div id='chooseUsMain'>
            <div>
                <h1>Why <span>Choose Us?</span></h1>
                <div id='chooseContent'>
                    {data.map((item) => (<ChooseCard src={item.src} title={item.title} desc={item.desc} />))}
                </div>
            </div>
        </div>
    )
}

export default ChooseUs;