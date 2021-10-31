import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { Buffer } from 'buffer';

import colors from '../styles/colors';

const ProductCard = (props) => {

    const { product } = props;
    const img = new Buffer.from(product.Image.data).toString("ascii");

    function getTitle(max) {
        if (product.Title.length >= max) {
            return product.Title.substring(0, max) + "...";
        } else {
            return product.Title;
        }
    }

    return (
        <View style={styles.card}>
            <TouchableOpacity style={{flex: 1}} onPress={() => props.navigation.navigate("Product", { product: product })}>
                <ImageBackground style={styles.imageContainer} imageStyle={styles.image} source={{uri: img}}/>
                <View style={styles.itemContainer}>
                    <View style={styles.titleContainer}><Text style={styles.title}>{getTitle(22)}</Text></View>
                    <View style={styles.priceContainer}><Text style={styles.price}>{product.Price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}€</Text></View>
                </View>
            </TouchableOpacity>
        </View>
    );
    
};

const styles = StyleSheet.create({
    card: {
        alignSelf: "center",
        height: 230,
        width: "90%",
        backgroundColor: colors.white,
        borderRadius: 10,
        marginVertical: 10,
    },
    imageContainer: {
        flex: 5,
        resizeMode: "contain",
        borderBottomWidth: 1,
        borderBottomColor: colors.mountainMeadow,
    },
    image: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    itemContainer: {
        flex: 2,
        paddingHorizontal: 13,
        paddingVertical: 3,
    },
    titleContainer: {
        flex: 1,
        paddingBottom: 4,
    },
    priceContainer: {
        flex: 2,
    },
    title:{
        color: colors.indigoDye,
        fontSize: 24,
        fontWeight: "bold",
    },
    price: {
        color: colors.mountainMeadowBorder,
        fontSize: 30,
    },
});

export default ProductCard;
