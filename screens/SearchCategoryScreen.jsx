import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';

import ProductCard from '../components/ProductCardComponent';

import general from '../styles/general';
import colors from '../styles/colors';
import apiConfig from '../config/api.config';

const SearchCategoryScreen = (props) => {

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { category } = props.route.params;

  useEffect(() => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    fetch(apiConfig.URI + '/category/products/' + category.Id, requestOptions)
        .then((response) => response.json())
        .then((json) => {setFilteredDataSource(json) ; setMasterDataSource(json)})
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
  }, [isLoading]);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.Title
          ? item.Title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemSeparatorView = () => {
    return (
      <View style={{ height: 0.5, width: '100%', backgroundColor: colors.chineseSilver }} />
    );
  };

  return (
    <View style={general.container}>
      <SearchBar
        round
        searchIcon={{ size: 26 }}
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction('')}
        placeholder="Search for products..."
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={{backgroundColor: colors.indigoDye}}
        value={search}
      />
      <Text style={styles.text}>Viewing products for {category.Name.toLowerCase()}</Text>
      {isLoading ? 
      (<View style={general.centeredView}>
        <ActivityIndicator size="large" color={colors.indigoDye}/>
      </View>
      ) 
      : 
      (
      <FlatList
        data={filteredDataSource}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        refreshing={isLoading}
        onRefresh={() => {setLoading(true);}}
        renderItem={({ item }) => <ProductCard product={item} navigation={props.navigation} />}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.skobeloffBorder,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 14,
    fontStyle: "italic",
  },
  searchBarContainer: {
    backgroundColor: colors.columbiaBlue,
    borderBottomColor: colors.transparent,
    borderTopColor: colors.transparent,
  },
});

export default SearchCategoryScreen;