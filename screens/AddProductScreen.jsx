import React, { Component } from 'react';
import { View, TextInput, Image, Platform, TouchableOpacity, ScrollView, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from "react-native-vector-icons/Ionicons";

import { AuthContext } from '../context/AuthContext';
import general from '../styles/general';
import colors from '../styles/colors';
import apiConfig from '../config/api.config';

class AddProductScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            price: "",
            image: null,
            issold: false,
            userid: "",
            categoryid: "",
            categoryList: [],
            list: [],
            selectedValue: '',
            warning: "",
        }
        this.getCategories();
    }

    componentDidMount() {(async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri})
        }
      
    };
    
    setStateFor = (key, val) => {
        this.setState({
            [key]: val
        });
    }

    componentDidMount(){
        this.setStateFor("userid", this.context.user.Id);
        this.setStateFor("issold", 0);
        this.getCategories;
    }

    registerProduct = async () => {

        if (this.state.title !== undefined && this.state.title !== "" && this.state.title.length <= 70 &&
            this.state.description !== undefined && this.state.description !== "" && this.state.description.length <= 1024 &&
            this.state.price !== undefined && this.state.price !== "" &&
            this.state.image !== undefined && this.state.image !== null &&
            this.state.issold !== undefined &&
            this.state.userid !== undefined &&
            this.state.categoryid !== undefined && this.state.categoryid !== "") {

            await this.createProduct(this.state.title,
                this.state.description, this.state.price, this.state.image,
                this.state.issold, this.state.userid,this.state.categoryid);

            Alert.alert("Product created!", "Refresh home screen to see it on sale!", [{
                    text: "Continue", onPress: () => {
                        this.props.navigation.pop();
                    }
                }]);
        }
        else if(this.state.title.length > 70) {
            this.setStateFor("warning", "Product name has too many caracters! (maximum 70)");
        }
        else if(this.state.description.length > 1024) {
            this.setStateFor("warning", "Description has too many caracters! (maximum 1024)");
        }
        else {
            this.setStateFor("warning", "Please insert proper information!");
        }
    }

    goToProfile = () => {
        this.props.navigation.pop();
    }

    getCategories = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };

        await fetch(apiConfig.URI + '/category', requestOptions)
            .then((response) => response.json())
            .then((json) => this.setStateFor("categoryList", json))
            .catch((error) => console.error(error));
        
        this.listCat();
    }

    listCat() {
        const listArray = [];
        for(let i = 0; i < this.state.categoryList.length; i++){
            listArray[i] = {"label": this.state.categoryList[i].Name , "value": this.state.categoryList[i].Id }
        }
        this.setStateFor("list", listArray);
    }

    createProduct = async (title, description, price, image, issold, userid,categoryid) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Title: title,
                Description: description,
                Price: price,
                Image: image,
                IsSold: issold,
                userId: userid,
                categoryId: categoryid,
                produto: []
            })
        };

        await fetch(apiConfig.URI + '/products', requestOptions)
            .then((response) => response.json())
            .then((json) => this.setStateFor("produto", json))
            .catch((error) => console.error(error));
    }

    renderFileUri() {
        if (this.state.image) {
            return <Image source={{ uri: this.state.image }} style={styles.image} />
        } else {
            return <Image source={require('../assets/no-product.jpg')} style={styles.image} />
        }
    } 

    render() {
        return (
            <View style={general.container}>
                <ScrollView style={{flex: 1}}>
                    {this.renderFileUri()}
                    <View style={styles.inputContainer}>
                        <View style={styles.rowContainer}>
                            <View style={general.inputIcon}>
                                <Ionicons name="text" color={colors.mountainMeadow} size={22}/>
                            </View>
                            <TextInput
                                placeholder="Product name"
                                style={[general.input, {backgroundColor: colors.white}]}
                                onChangeText={(value) => this.setStateFor("title", value)}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={general.inputIcon}>
                                <Ionicons name="logo-euro" color={colors.mountainMeadow} size={22}/>
                            </View>
                            <TextInput
                                placeholder="Price (€)"
                                style={[general.input, {backgroundColor: colors.white}]}
                                onChangeText={(value) => this.setStateFor("price", value)}
                                keyboardType="decimal-pad"
                            />
                        </View>
                        <RNPickerSelect
                            style={  {inputAndroid: {
                                marginVertical: 10,
                                minWidth: "73%",
                                maxWidth: "73%",
                                height: 45,
                                borderRadius: 7,
                                borderWidth: 2,
                                textAlign: "center",
                                alignSelf: "center",
                                borderColor: colors.skobeloffBorder,
                                backgroundColor: colors.skobeloff,
                                fontSize: 18,
                                fontWeight: "bold",
                                color: colors.columbiaBlue,
                              }}}
                            placeholderTextColor="red"
                            placeholder={{label: 'Select a category', value: ""}}
                            doneText="Select"
                            useNativeAndroidPickerStyle={false}
                            onValueChange={(value) =>  this.setStateFor("categoryid", value)}
                            items={this.state.list}
                        />
                        <TextInput
                                placeholder="Description"
                                style={styles.descInput}
                                onChangeText={(value) => this.setStateFor("description", value)}
                                multiline={true}
                        />
                    </View>
                    {this.state.warning !== "" ? 
                    <Text style={[general.warning, {maxWidth: "80%", marginTop: 10, marginBottom: -10, alignSelf: "center"}]}>
                        {this.state.warning}
                        </Text> 
                    :
                    null}
                    <View style={styles.imagePicker}>
                        <TouchableOpacity style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}} onPress={this.pickImage}>
                            <Ionicons name="image" color={colors.skobeloffBorder} size={20} />
                            <Text style={styles.textStyle}>Upload an image</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[general.buttonRadius, {marginTop: 20, marginBottom: 15}]} onPress={this.registerProduct}>
                        <View style={[general.buttonSecondary, styles.button]}>
                            <Ionicons name="wallet" color={colors.indigoDye} size={26}/>
                            <Text style={[styles.buttonText, general.textSecondary]}>Let's sell it!</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[general.buttonRadius, { paddingBottom: 15}]} onPress={this.goToProfile}>
                        <View style={[general.buttonCancel, styles.buttonCancel]}>
                            <Ionicons name="close-circle" color={colors.lightRed} size={18}/>
                            <Text style={[styles.buttonTextCancel, general.textCancel]}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

AddProductScreen.contextType = AuthContext;

const styles = StyleSheet.create({
    buttonCancel: {
        width: "30%",
        alignSelf: "center",
        height: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonTextCancel: {
        fontSize: 16,
        paddingLeft: 10,
    },
    button: {
        width: "70%",
        alignSelf: "center",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 24,
        paddingLeft: 12,
    },
    textStyle: {
        fontSize: 16,
        paddingHorizontal: 4,
        fontWeight: "bold",
        color: colors.skobeloffBorder,
    },
    imagePicker: {
        backgroundColor: colors.columbiaBlueBorder,
        height: 35,
        width: 170,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 10,
        top: 8,
    },
    descInput: {
        marginVertical: 2.5,
        minWidth: "82.5%",
        maxWidth: "82.5%",
        minHeight: 45,
        maxHeight: 300,
        borderWidth: 1,
        borderRadius: 7,
        paddingHorizontal: 7,
        borderColor: colors.columbiaBlueBorder,
        backgroundColor: colors.white,
      },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2.5,
    },
    inputContainer: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 30,
    },
    image: {
        backgroundColor: colors.columbiaBlueBorder,
        resizeMode: "contain",
        height: 250,
        width: "100%",
    },
});

export default AddProductScreen;

/*<ScrollView style={general.mainContainer} >
                <View style={general.layer2}>
                    <Text style={general.header}>Add Product</Text>
                    <TextInput
                        placeholder="Title"
                        style={general.input}
                        onChangeText={(value) => this.setStateFor("title", value)}
                    />
                    <TextInput
                        placeholder="Price"
                        style={general.input}
                        onChangeText={(value) => this.setStateFor("price", value)}
                    />
                    <TextInput
                        placeholder="Description"
                        style={general.input_large2}
                        onChangeText={(value) => this.setStateFor("description", value)}
                    />
                    <RNPickerSelect
                        style={  {inputAndroid: {
                            fontSize: 14,
                            width: "100%",
                            height: 44,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            borderWidth: 1,
                            borderColor: "blue",
                            borderRadius: 8,
                            color: "black",
                            paddingRight: 30, // to ensure the text is never behind the icon
                          }}}
                        placeholderTextColor="red"
                        placeholder={{label: 'Categorias', value: ""}}
                        doneText="Select"
                        useNativeAndroidPickerStyle = {false}
                        onValueChange={(value) =>  this.setStateFor("categoryid", value)}
                        items={this.state.list}
                    />
                    <View>
                        {this.renderFileUri()}
                    </View>
                    <TouchableOpacity
                        style={general.button2}
                        onPress={this.pickImage}
                        >
                        <Text>Adicionar Imagem</Text>
                    </TouchableOpacity>
                    <Button
                    title="Register"
                    style={general.input}
                    onPress={this.registerProduct}
                    />
                </View>
            </ScrollView> */
