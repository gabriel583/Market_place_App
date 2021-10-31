import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Buffer } from 'buffer';

import general from '../styles/general';
import colors from '../styles/colors';

const ProductComponent = (props) => {

    const { user } = props;

    function getAvatar(avatar) {
        if (avatar) {
          const img = new Buffer.from(avatar).toString("ascii")
          return <Image source={{uri: img}} style={styles.avatar} />
        }
        else {
          return <Image source={require('../assets/anon.jpg')} style={styles.avatar} />
        }
    }

    const openEmail = (email) => {
        Alert.alert("Do you want to open your email?", `${email}`, [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Open",
                onPress: () => Linking.openURL(`mailto:${email}`),
            },
        ]);
    };

    const openPhone = (phone) => {
        Alert.alert("Do you want to call this number?", `${phone}`, [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Call",
                onPress: () => Linking.openURL(`tel:${phone}`),
            },
        ]);
    };

    return (

        <View style={general.container}>
            <ScrollView style={{flex: 1}}>
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatarBackContainer} source={require('../assets/background.jpg')}/>
                    <View style={styles.empty}></View>
                    {getAvatar(user.Avatar)}
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.usernameText}>{user.Username}</Text>
                </View>
                <View style={[general.separator100, {maxWidth: "90%", alignSelf: "center", marginVertical: 4}]}></View>
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{user.Name}</Text>
                    <View style={styles.rowContainer}>
                        <Ionicons name="call" size={24} color={colors.indigoDye} />
                        <Text style={styles.infoText} onPress={() => openPhone(user.Phone)}>{user.Phone}</Text>
                    </View>
                    <View style={{marginTop: 10}}></View>
                    <View style={styles.rowContainer}>
                        <Ionicons name="mail" size={24} color={colors.indigoDye} />
                        <Text style={styles.infoText} onPress={() => openEmail(user.Email)}>{user.Email}</Text>
                    </View>
                </View>
                <View style={styles.prodContainer}>
                    <TouchableOpacity style={[general.buttonRadius, {marginTop: 20}]} onPress={() => props.navigation.navigate("UserProducts", {user: user})}>
                        <View style={[styles.button, general.buttonPrimary]}>
                            <Text style={[styles.buttonText, general.textPrimary]}>See products on sale</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>

    );

}

const styles = StyleSheet.create({
    button: {
        alignSelf: "center",
        width: "70%",
        height: 40,
    },
    buttonText: {
        fontSize: 20,
    },
    infoText: {
        fontSize: 16,
        paddingLeft: 10,
        fontWeight: "300",
        color: colors.indigoDye,
        maxWidth: "90%",
    }, 
    rowContainer: {
        flexDirection: "row",
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
        flexWrap: "wrap",
        backgroundColor: colors.white,
        borderRadius: 15,
        width: "90%",
        alignSelf: "center",
    },
    nameText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        maxWidth: "100%",
        alignSelf: "center",
        color: colors.indigoDye,
        paddingBottom: 10,
    },
    infoContainer: {
        flexWrap: "wrap",
        alignContent: "center",
        alignItems: "center",
    },
    usernameText: {
        fontSize: 16,
        color: colors.indigoDye,
        fontStyle: "italic",
        textAlign: "center",
        maxWidth: "100%",
        alignSelf: "center",
    },
    nameContainer: {
        marginTop: -20,
        flexWrap: "wrap",
        alignContent: "center",
    },
    avatar: {
        position: "absolute",
        height: 150,
        width: 150,
        borderRadius: 150 / 2,
        borderWidth: 2,
        borderColor: colors.columbiaBlue,
        alignSelf: "center",
    },
    empty: {
        height: "100%",
        width: "100%",
    },
    avatarBackContainer: {
        height: "100%",
        backgroundColor: colors.columbiaBlue,
        resizeMode: "cover",
    },
    avatarContainer: {
        height: 200,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.columbiaBlue,
    },
});

export default ProductComponent;