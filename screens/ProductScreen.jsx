import React, {useState, useEffect, useContext} from 'react';
import { Alert, View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, TouchableHighlight, ActivityIndicator, Linking, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Buffer } from 'buffer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';
import general from '../styles/general';
import colors from '../styles/colors';
import apiConfig from '../config/api.config';

const ProductScreen = (props) => {

    const logged = useContext(AuthContext);
    const loggedId = logged.user.Id;
    const { product } = props.route.params;
    const img = new Buffer.from(product.Image.data).toString("ascii");
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState(false);

    useEffect(() =>  {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
    
        fetch(apiConfig.URI + '/users/' + product.userId, requestOptions)
            .then((response) => response.json())
            .then((json) => {setData(json)})
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
      }, []);

    function getAvatar(user) {
        if (user) {
            const img = new Buffer.from(user).toString("ascii")
            return <Image source={{uri: img}} style={styles.icon} />
        }
        else {
            return <Image source={require('../assets/anon.jpg')} style={styles.icon} />
        }
    }
    
    const deleteProduct = async () => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };

        await fetch(`${apiConfig.URI}/products/${product.Id}`, requestOptions)
            .then((response) => response.json())
            .catch((error) => console.error(error));
        
        props.navigation.pop();
    }

    const deleteThis = () => {
        Alert.alert("Delete this product", "Are you sure you want to delete " + product.Title.toLowerCase() + "? You will need to refresh the page.",
        [   
            {
                text: "Cancel",
                style: "cancel"
            },
            { 
                text: "Delete", 
                onPress: () => deleteProduct(),
            }
        ],
        { cancelable: false }
        );
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

    function isOwner() {
        if (loggedId === 1 || loggedId === data.Id) {
          return (
            <View style={{flex: 1, position: "absolute"}}>
                <View style={styles.removeIcon}>
                    <TouchableOpacity onPress={() => deleteThis()}>
                    <Ionicons name="close" color={colors.venetianRed} size={44}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.editIcon}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("EditProduct", { product: product })}>
                    <Ionicons name="create" color={colors.carrotOrange} size={38}/>
                    </TouchableOpacity>
                </View>
            </View>
          );
        } else {
          return null;
        }
    }

    return (
        <View style={general.container}>
            {isLoading ? 
            (
            <View style={general.centeredView}>
                <ActivityIndicator size="large" color={colors.indigoDye}/>
            </View>
            )
            :
            (
            <View style={general.container}>
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modal}>
                            <View style={styles.modalTitleView}>
                                <Ionicons name="call" size={22} color={colors.indigoDye} />
                                <Text style={styles.modalTitle}>Phone</Text>
                            </View>
                            <Text style={styles.modalText} onPress={() => openPhone(data.Phone)}>{data.Phone}</Text>
                            <View style={styles.modalTitleView}>
                                <Ionicons name="mail" size={22} color={colors.indigoDye} />
                                <Text style={styles.modalTitle}>Email</Text>
                            </View>
                            <Text style={styles.modalText} onPress={() => openEmail(data.Email)}>{data.Email}</Text>
                        </View>
                        <TouchableHighlight style={[general.buttonRadius, {marginTop: 10}]} onPress={() => setModalVisible(!modalVisible)}>
                            <View style={[styles.button, general.buttonPrimary,]}>
                                <Text style={[styles.buttonText, general.textPrimary]}>Close</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </Modal>
                <Modal animationType="fade" transparent={true} visible={modalImage} onRequestClose={() => setModalVisible(!modalImage)}>
                    <View style={[general.centeredView, {backgroundColor: colors.blackTransparent}]}>
                        <TouchableOpacity style={{flex: 1}} onPress={() => setModalImage(!modalImage)}>
                            <Image style={styles.imageInModal} source={{uri: img}}/>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style={styles.prodContainer}>
                    <ScrollView style={{flex: 1}}>
                        <TouchableWithoutFeedback onPress={() => setModalImage(true)}>
                            <Image style={styles.image} source={{uri: img}}/>
                        </TouchableWithoutFeedback>
                        <View style={styles.infoContainer}>
                            <Text style={styles.title}>{product.Title}</Text>
                            <Text style={styles.price}>{product.Price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}€</Text>
                            <View style={general.separator100}></View>
                            <Text style={styles.desc}>{product.Description}</Text>
                            <View style={styles.sellerContainer}>
                                <TouchableOpacity 
                                style={styles.sellerTouchable} 
                                onPress={() => props.navigation.navigate(loggedId === data.Id ? "Profile" : "SellerProfile", { user: data })}>
                                    {getAvatar(data.Avatar)}
                                    <View style={styles.userContainer}>
                                        <Text style={styles.username}>{data.Username}</Text>
                                        <Text style={styles.name}>{data.Name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.contactContainer}>
                    <TouchableOpacity style={styles.contactTouchable} onPress={() => setModalVisible(true)}>
                        <Ionicons name="chatbubble-ellipses" size={24} color={colors.indigoDye} />
                        <Text style={styles.contactText}>See contacts</Text>
                    </TouchableOpacity>
                </View>
                {isOwner()}
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    editIcon: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 5,
        left: 54,
    },
    removeIcon: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 5,
        left: 5,
    },
    imageInModal: {
        width: Dimensions.get('window').width * 0.9,
        height: "100%",
        borderRadius: 10,
        resizeMode: "contain",
    },
    button: {
        minWidth: "40%",
        height: 40,
    },
    buttonText: {
        fontSize: 20,
    },
    contactTouchable: {
        flex: 1, 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    contactText: {
        fontSize: 26,
        fontWeight: "bold",
        paddingLeft: 8,
        color: colors.indigoDye,
    },
    modalTitleView: {
        flexDirection:"row", 
        alignItems: "center", 
        justifyContent: "center",
    },
    modalTitle: {
        paddingLeft: 8,
        fontSize: 24,
        fontWeight: "bold",
        maxWidth: "100%",
        color: colors.indigoDye,
        textAlign: "center",
    },
    modalText: {
        fontSize: 18,
        maxWidth: "100%",
        color: colors.skobeloff,
        textAlign: "center",
    },
    modal: {
        flexWrap: "wrap",
        width: "80%",
        borderRadius: 10,
        borderColor: colors.columbiaBlueBorder,
        borderWidth: 1,
        backgroundColor: colors.columbiaBlue,
        alignContent: "center",
        alignItems: "center",
        padding: 7,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.columbiaBlueTransparent,
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        color: colors.indigoDye,
        maxWidth: "100%",
    },
    username: {
        fontSize: 12,
        fontStyle: "italic",
        color: colors.mountainMeadowBorder,
        maxWidth: "100%",
    },
    userContainer: {
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
        flex: 1,
    },
    icon: {
        height: 55,
        width: 55,
        borderRadius: 55 / 2,
        marginHorizontal: 7,
        borderColor: colors.skobeloff,
        borderWidth: 1,
    },
    sellerContainer: {
        width: "95%",
        borderRadius: 10,
        height: 70,
        alignSelf: "center",
        backgroundColor: colors.white,
        marginVertical: 20,
    },
    sellerTouchable: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    prodContainer: {
        flex: 12,
    },
    contactContainer: {
        flex: 1,
        backgroundColor: colors.mountainMeadow,
    },
    image: {
        backgroundColor: colors.columbiaBlueBorder,
        resizeMode: "contain",
        height: 250,
        width: "100%",
    },
    infoContainer: {
        paddingHorizontal: 10,
        maxWidth: "100%",
    },
    title: {
        fontSize: 32,
        color: colors.indigoDye,
        fontWeight: "bold",
    },
    price: {
        fontSize: 40,
        color: colors.mountainMeadow,
    },
    desc: {
        fontSize: 16,
        fontStyle: 'italic',
        paddingTop: 5,
    },
});

export default ProductScreen;
