import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { Buffer } from 'buffer';

import colors from '../styles/colors';

const CategoryIcon = (props) => {

    const { category } = props;
    const img = new Buffer.from(category.Image.data).toString("ascii");

    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <TouchableOpacity style={{flex: 1}} onPress={() => props.navigation.navigate("SearchCategory", { category: category })}>
                    <ImageBackground style={{flex: 1}} imageStyle={styles.image} source={{uri: img}} />
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{category.Name}</Text>
            </View>
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 10,
    },
    icon: {
        flex: 4,
        minHeight: 65,
        maxHeight: 65,
        width: 65,
        borderRadius: 65 / 2,
        backgroundColor: colors.skobeloffBorder,
    },
    image: {
        borderRadius: 65 / 2,
        resizeMode: "contain"
    },
    textContainer: {
        flex: 1,
        paddingTop: 2,
        flexWrap: "wrap",
    },
    text: {
        position: "absolute",
        alignSelf: "center",
        textAlign: "center",
        color: colors.indigoDye,
        fontWeight: "bold",
    },
});

export default CategoryIcon;
