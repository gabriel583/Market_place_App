import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform, Image, Dimensions, TouchableHighlight, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";

import general from '../styles/general';
import colors from '../styles/colors';
import apiConfig from '../config/api.config';

class AddCategoryScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            image: null,
            categories: [],
            warning: "",
        }
    }
    
    setStateFor = (key, val) => {
        this.setState({
            [key]: val
        });
    }

    
    registerCategory = async () => {

        if (this.state.name !== undefined && this.state.image !== undefined && 
            this.state.name !== "" && this.state.name.length <= 64 && this.state.image !== null) {

            await this.createCategory(this.state.name, this.state.image);
            Alert.alert("Category created!", "Reload the app for it to appear", [{
                text: "Continue", onPress: () => {
                    this.props.navigation.pop();
                }
            }]);
        } else if(this.state.name.length > 64) {
            this.setStateFor("warning", "Category name has too many caracters! (maximum 64)");
        } else {
            this.setStateFor("warning", "Invalid name or image!");
        }
    }

    createCategory = async (name, image) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: name,
                Image: image,
                categories: []
            })
        };

        await fetch(apiConfig.URI + '/category', requestOptions)
            .then((response) => response.json())
            .then((json) => this.setStateFor("categories", json))
            .catch((error) => console.error(error));
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
        aspect: [1, 1],
        quality: 1,
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri })
        }
      
    };

    goBack = () => {
        this.props.navigation.pop();
    }

    renderFileUri() {
        if (this.state.image) {
            return <Image source={{ uri: this.state.image }} style={styles.image} />
        } else {
            return <Image source={require('../assets/null.png')} style={styles.image} />
        }
    } 

    render() {
        return (

            <View style={general.container}>
                <Text style={styles.title}>Add new category</Text>
                {this.renderFileUri()}
                <View style={styles.avatarIcon}>
                    <TouchableOpacity onPress={this.pickImage}>
                        <Ionicons name="document-attach" color={colors.indigoDye} size={24} />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.rowContainer}>
                        <View style={general.inputIcon}>
                            <Ionicons name="basket" color={colors.mountainMeadow} size={22}/>
                        </View>
                        <TextInput
                        placeholder="Category"
                        style={[general.input, {backgroundColor: colors.white}]}
                        onChangeText={(value) => this.setStateFor("name", value)}
                        />
                    </View>
                </View>
                {this.state.warning !== "" ? 
                <Text style={[general.warning, {marginTop: 10, maxWidth: "60%", alignSelf: "center"}]}>{this.state.warning}</Text> 
                : 
                null}
                <View style={styles.buttonContainer}>
                        <TouchableHighlight style={general.buttonRadius} onPress={this.goBack}>
                            <View style={[styles.button, general.buttonCancel]}>
                                <Text style={[styles.buttonText, general.textCancel]}>Cancel</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={general.buttonRadius} onPress={this.registerCategory}>
                            <View style={[styles.button, general.buttonPrimary]}>
                                <Text style={[styles.buttonText, general.textPrimary]}>Save</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignSelf: "center",
        width: 125,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-around",
        alignItems: "center",
        width: "95%",
        marginTop: 20,
        height: 50,
        backgroundColor: colors.transparent,
    },
    avatarIcon: {
        backgroundColor: colors.white,
        height: 44,
        width: 44,
        borderRadius: 44 / 2,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: (Dimensions.get("window").width / 2) - 75,
        top: 190,
    },
    image: {
        alignItems: "center",
        alignSelf: "center",
        width: 150,
        height: 150,
        marginVertical: 20,
        resizeMode: "contain",
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2.5,
    },
    inputContainer: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 20,
    },
    title: {
        marginTop: 10,
        fontSize: 36,
        padding: 2,
        fontWeight: "bold",
        alignSelf: "center",
        textAlign: "center",
        color: colors.indigoDye,
        borderRadius: 15,
    },
});

export default AddCategoryScreen;

/* <View style={general.layer2}>
                <Text style={general.header}>Register Category</Text>
                <TextInput
                    placeholder="Name"
                    style={general.input}
                    onChangeText={(value) => this.setStateFor("name", value)}
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
                onPress={this.registerCategory}
                />
            </View> */