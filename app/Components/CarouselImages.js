import React from 'react';
import { Image } from 'react-native-elements';
import Carousel from "react-native-snap-carousel";

export default function CarouselImages(props) {
    const { arrayImages, height, width } = props;

    const renderItem = (props) => {
        return(
            <Image style={{height, width}} source={{uri: props.item}}/>
        )
    };

    return (
        <Carousel
            layout="default"
            data={arrayImages}
            sliderWidth={width}
            itemWidth={width}
            renderItem={renderItem}
        />
    )
}


