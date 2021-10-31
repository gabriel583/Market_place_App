import React, { useState, useEffect,useContext  } from 'react';
import { StyleSheet, Text, View, ActivityIndicator , FlatList, TouchableOpacity } from 'react-native';

import ProductCard from '../components/ProductCardComponent';

import { AuthContext } from '../context/AuthContext';
import general from '../styles/general';
import colors from '../styles/colors';
import apiConfig from '../config/api.config';

const UserProductsScreen = (props) => {
    
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const { user } = props.route.params;
    const loggedUser = useContext(AuthContext);
    const apiString = user.Id === loggedUser.user.Id ? '/products/productUser/id' : '/products/unsoldProductUser/id';

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.Id })
        };

        fetch(apiConfig.URI + apiString, requestOptions)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, [isLoading]);

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
            <View style={{flex: 1}}>
                <View style={styles.topContainer}>
                    <TouchableOpacity style={general.buttonRadius} onPress={() => props.navigation.pop()}>
                        <View style={[styles.button, general.buttonPrimary]}>
                            <Text style={[styles.buttonText, general.textPrimary]}>Go back</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={general.flatList}
                    data={data}
                    keyExtractor={item => item.Id.toString()}
                    horizontal={false}
                    refreshing={isLoading}
                    onRefresh={() => {setLoading(true);}}
                    renderItem={({ item }) => <ProductCard product={item} navigation={props.navigation} />}
                />
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        marginVertical: 10,
        width: "100%",
    },
    button: {
        alignSelf: "center",
        width: "70%",
        height: 40,
    },
    buttonText: {
        fontSize: 20,
    },
});

export default UserProductsScreen;
