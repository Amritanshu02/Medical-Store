import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';

const StoreCard = (props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/store?storeId=${props.storeId || 1}`);
    }

    return (
        <div>
            <Card sx={{ maxWidth: 345 }} onClick={handleClick}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="100"
                        image={props.img}
                        alt="image"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {props.desc}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    )
}

export default StoreCard