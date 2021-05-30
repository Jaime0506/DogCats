import React from 'react';
import { StyleSheet } from "react-native";
import { Overlay } from "react-native-elements";

export default function Modal(props){
    const { isVisible, setIsVisible, children } = props;
    return(
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor= "rgba(0,0,0,0.5)"
            overlayBackgroundColor="transparent"
            overlayStyle={styles.overlay}
            onBackdropPress={() => setIsVisible(false)}
        >
            {children}
        </Overlay>
    )
}
const styles = StyleSheet.create({
    overlay: {
        height: "auto",
        width: "90%",
        backgroundColor: "#fff"
    }
})