import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import "../styles/ChooseCard.css";

const ChooseCard = (props) => {
    const theme = useTheme();

    return (
        <div id='chooseCard' sx={{ display: 'flex' }}>
            <CardMedia
                id='chooseCardImg'
                component="img"
                sx={{ width: 110 }}
                image={props.src}
                alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {props.title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {props.desc}
                    </Typography>
                </CardContent>
            </Box>
        </div>
    )
}

export default ChooseCard;