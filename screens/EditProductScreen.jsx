import React, { Component } from 'react';
import { View, TextInput, Image, TouchableOpacity, ScrollView, Switch, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Buffer } from 'buffer';

import general from '../styles/general';
import colors from '../styles/colors';
import apiConfig from '../config/api.config';

class EditProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            price: "",
            image: "",
            issold: false,
            userid: "",
            categoryid: "",
            categoryList: [],
            list: [],
            selectedValue: '',
            warning: "",
        }
    }

    componentDidMount() {
        this.setStateFor("title", this.props.route.params.product.Title);
        this.setStateFor("description", this.props.route.params.product.Description);
        this.setStateFor("image", new Buffer.from(this.props.route.params.product.Image).toString("ascii"));
        this.setStateFor("issold", this.props.route.params.product.IsSold);
        this.setStateFor("categoryid", this.props.route.params.product.categoryId);
        this.setStateFor("userid", this.props.route.params.product.userId);
        this.setStateFor("price", this.props.route.params.product.Price);
    }

    setStateFor = (key, val) => {
        this.setState({
            [key]: val
        });
    }

    goToProfile = () => {
        this.props.navigation.pop();
    }

    saveProduct = async () => {

        if (this.state.title !== undefined && this.state.title !== "" && this.state.title.length <= 70 &&
            this.state.description !== undefined && this.state.description !== "" && this.state.description.length <= 1024 &&
            this.state.price !== undefined && this.state.price !== "" &&
            this.state.image !== undefined && this.state.image !== null &&
            this.state.issold !== undefined &&
            this.state.userid !== undefined &&
            this.state.categoryid !== undefined && this.state.categoryid !== "") {

            await this.updateProduct(
                this.state.title,
                this.state.description,
                this.state.price,
                this.state.image,
                this.state.issold,
                this.state.userid,
                this.state.categoryid);

            this.props.navigation.pop();
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

    updateProduct = async (title,description, price, image, issold, userid, categoryid) => {
        const requestOptions = {
            method: 'PUT',
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

        await fetch(`${apiConfig.URI}/products/${this.props.route.params.product.Id}`, requestOptions)
            .then((response) => response.json())
            .then((json) => this.setStateFor("produto", json))
            .catch((error) => console.error(error));

    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.cancelled) {
            this.setState({image: result.uri})
        }
      
    };

    renderFileUri() {
        if (this.state.image) {
            return <Image source={{ uri: this.state.image }} style={styles.image} />
        } else {
            return <Image source={require('../assets/no-product.jpg')} style={styles.image} />
        }
    } 

    issold(){
        if(!this.props.route.params.product.IsSold){
            return (<View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <Text style={styles.textSwitch}>
                    Still on sale?
                </Text>
                <Switch
                    trackColor={{ false: colors.lightRed, true: colors.skobeloff }}
                    thumbColor={this.state.issold ? colors.mountainMeadow : colors.venetianRed}
                    ios_backgroundColor={colors.indigoDye}
                    onValueChange={(value) => this.setStateFor("issold", value)}
                    value={this.state.issold}
                />
            </View>)
        } else {
            return (
              <Text style={styles.textSwitch}>Product sold!</Text>
            );
        }
    }

    render() {
        return (
            <View style={general.container}>
                <ScrollView style={{flex: 1}}>
                    {this.renderFileUri()}
                    <View style={styles.inputContainer}>
                        <View style={{marginBottom: 10}}>
                            {this.issold()}
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={general.inputIcon}>
                                <Ionicons name="text" color={colors.mountainMeadow} size={22}/>
                            </View>
                            <TextInput
                                placeholder="Product name"
                                style={[general.input, {backgroundColor: colors.white}]}
                                onChangeText={(value) => this.setStateFor("title", value)}
                                defaultValue={this.state.title}
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
                                defaultValue={this.state.price.toString()}
                            />
                        </View>
                        <TextInput
                                placeholder="Description"
                                style={styles.descInput}
                                onChangeText={(value) => this.setStateFor("description", value)}
                                multiline={true}
                                defaultValue={this.state.description}
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
                            <Text style={styles.textStyle}>Upload new image</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[general.buttonRadius, {marginTop: 20, marginBottom: 15}]} onPress={this.saveProduct}>
                        <View style={[general.buttonSecondary, styles.button]}>
                            <Ionicons name="bookmarks" color={colors.indigoDye} size={26}/>
                            <Text style={[styles.buttonText, general.textSecondary]}>Save it!</Text>
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
        )
    }
}

const styles = StyleSheet.create({
    textSwitch: {
        color: colors.indigoDye,
        fontSize: 20,
        paddingHorizontal: 5,
        fontWeight: "bold",
    },
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

export default EditProduct;

/*<ScrollView style={general.mainContainer} >

            <View style={general.layer6}>
                <Text style={general.header}>Edit Product: {this.state.title}</Text>
                {this.sold()}
                <Text>Title</Text>
                <TextInput
                    placeholder="Title"
                    style={general.input}
                    onChangeText={(value) => this.setStateFor("title", value)}
                    defaultValue={this.state.title}
                />
                <Text>Price</Text>
                <TextInput
                    placeholder="Price"
                    style={general.input}
                    onChangeText={(value) => this.setStateFor("price", value)}
                    defaultValue={this.state.price}
                />
                <Text>Description</Text>
                <TextInput
                    placeholder="description"
                    style={general.input_large2}
                    onChangeText={(value) => this.setStateFor("description", value)}
                    defaultValue={this.state.description}
                />
                <View>
                        {this.issold()}
                </View>
                <Text>Imagem</Text>
                <View style={{alignItems: 'center'}}>
                        {this.renderFileUri()}
                </View>
                <TouchableOpacity
                        style={general.button2}
                        onPress={this.pickImage}
                        >
                        <Text>Mudar Imagem</Text>
                    </TouchableOpacity>
                <Text>Password</Text>
                <View style={general.postButton2x}>
                    <TouchableHighlight onPress={this.goToProfile}>
                        <View style={general.customButtonCancel}>
                            <Text style={general.customButtonText}>Cancel</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={general.separatorH}></View>
                    <TouchableHighlight onPress={this.saveProduct} disabled={this.props.route.params.product.IsSold}>
                        <View style={general.customButton}>
                            <Text style={general.customButtonText}>Save</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
            </ScrollView> */