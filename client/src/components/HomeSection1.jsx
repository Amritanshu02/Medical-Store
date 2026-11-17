import React, { useState } from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SearchIcon from '@mui/icons-material/Search';
import DisplayCard from "./DisplayCard";
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
// import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import "../styles/HomeSection1.css";
import { useNavigate } from 'react-router-dom';

const data = [
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/medicine_ff.webp?dim=720x0',
        title: 'Medicine',
        offer: 'FLAT 15% OFF',
        link: '/medicines',
    },
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/healthcare_ff.webp?dim=720x0',
        title: 'Healthcare',
        offer: 'FLAT 15% OFF',
        link: '/healthcare',
    },
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/labtest_ff.webp?dim=720x0',
        title: 'Lab Tests',
        offer: 'FLAT 20% OFF',
        link: '/lab-tests',
    },
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/health_blogs_ff.webp?dim=720x0',
        title: 'Health Blogs',
        offer: '',
        link: '/health-blogs',
    },
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/value_store.png?dim=720x0',
        title: 'Value Store',
        offer: 'FLAT 25% OFF',
        link: '/value-store',
    },
    {
        src: 'https://assets.pharmeasy.in/apothecary/images/offers_ff.webp?dim=720x0',
        title: 'Offers',
        offer: '',
        link: '/offers',
    },
];

const HomeSection1 = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/search');
    }

    return (
        <div id='homeSection1Main'>
            <div id="homeSection1MainFirst">
                <div>
                    <h2>What are you <span>looking</span> for?</h2>
                    <div>
                        <AssignmentOutlinedIcon />
                        <p>Order with prescription.</p>
                        <h4 id="homeSection1MainFirstUpload">UPLOAD NOW &gt;</h4>
                    </div>
                </div>
            </div>

            <div id="homeSection1MainSecond" onClick={handleClick}>
                <div>
                    <SearchIcon id='homeSection1MainSecondSearchIcon' />
                    <input type="text" name="" id="" placeholder='Search for products' />
                    <button>Search</button>
                </div>
            </div>

            <div id="homeSection1MainThird">
                <div>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 4,
                            py: 1,
                            overflow: 'auto',
                            width: '100%',
                            scrollSnapType: 'x mandatory',
                            '& > *': {
                                scrollSnapAlign: 'center',
                            },
                            '::-webkit-scrollbar': { display: 'none' },
                        }}
                        id="homeSection1MainThirdBox"
                    >
                        {/* {data.map((item) => (
                            <Card orientation="horizontal" size="sm" key={item.title} variant="outlined">
                                <AspectRatio ratio="1" sx={{ minWidth: 60 }}>
                                    <img
                                        srcSet={`${item.src}?h=120&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${item.src}?h=120&fit=crop&auto=format`}
                                        alt={item.title}
                                    />
                                </AspectRatio>
                                <Box sx={{ whiteSpace: 'nowrap', mx: 1 }}>
                                    <Typography level="title-md">{item.title}</Typography>
                        <Typography level="body-sm">{item.description}</Typography>
                                </Box>
                            </Card>
                        ))} */}
                        {data.map((item) => (<DisplayCard link={item.link} src={item.src} title={item.title} offer={item.offer} />))}
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default HomeSection1;