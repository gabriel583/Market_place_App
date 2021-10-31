import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import ProductCard from '../components/ProductCardComponent';
import CategoryIcon from '../components/CategoryIconComponent';

import { AuthContext } from '../context/AuthContext';
import colors from '../styles/colors';
import general from '../styles/general';
import apiConfig from '../config/api.config';

const HomeScreen = (props) => {

  const user = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingCat, setLoadingCat] = useState(true);
  const [data, setData] = useState([]);
  const [dataCat, setDataCat] = useState([]);

  useEffect(() => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    fetch(apiConfig.URI + '/products/unsold', requestOptions)
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
  }, [isLoading]);

  useEffect(() => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    fetch(apiConfig.URI + '/category', requestOptions)
        .then((response) => response.json())
        .then((json) => setDataCat(json))
        .catch((error) => console.error(error))
        .finally(() => setLoadingCat(false));
  }, []);

  function getName(max) {
    if (user.user.Name.length >= max) {
        return user.user.Name.substring(0, max) + "...";
    } else {
        return user.user.Name;
    }
  }

  function isAdminCat() {
    if (user.user.Username === "admin") {
      return (
        <View style={[styles.addIcon, {backgroundColor: colors.mountainMeadow, right: 0, left: 15}]}>
            <TouchableOpacity onPress={() => props.navigation.navigate("AddCategory")}>
              <Ionicons name="add-outline" color={colors.indigoDye} size={48} style={{left: 1.5, bottom: 1}}/>
            </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }

  return (

    <View style={general.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.text}>Welcome, {getName(12)}!</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {isLoadingCat ? 
        (
        <View style={general.centeredView}>
          <ActivityIndicator size="small" color={colors.indigoDye} style={{marginLeft: (Dimensions.get('window').width / 2) - 10}}/>
        </View>
        )
        : 
        (
          <FlatList 
            style={general.flatList} 
            data={dataCat} 
            keyExtractor={item => item.Id.toString()} 
            horizontal={true}
            renderItem={({ item }) => <CategoryIcon category={item} navigation={props.navigation} />}
            showsHorizontalScrollIndicator={false}
          /> 
        )}
      </View>
      <View style={styles.productsContainer}>
        {isLoading ? 
        (
        <View style={general.centeredView}>
          <ActivityIndicator size="large" color={colors.indigoDye}/>
        </View>
        )
        : 
        (
          <FlatList
            style={general.flatList}
            data={data}
            keyExtractor={item => item.Id.toString()}
            horizontal={false}
            refreshing={isLoading}
            onRefresh={() => {setLoading(true);}}
            renderItem={({ item }) => <ProductCard product={item} navigation={props.navigation} />}
          />
        )}
      </View>
      {isAdminCat()}
      <View style={styles.addIcon}>
          <TouchableOpacity onPress={() => props.navigation.navigate("AddProduct")}>
            <Ionicons name="add-outline" color={colors.mountainMeadow} size={48} style={{left: 1.5, bottom: 1}}/>
          </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: colors.columbiaBlue,
    flexWrap: "wrap",
  },
  text: {
    paddingLeft: 10,
    color: colors.indigoDye,
    fontWeight: "bold",
    fontSize: 25,
  },
  categoriesContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  productsContainer: {
    flex: 11,
  },
  addIcon: {
    backgroundColor: colors.indigoDye,
    height: 58,
    width: 58,
    borderRadius: 58 / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 15,
    bottom: 10,
  },
});

export default HomeScreen;
