import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Item = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const FooterList = ({ load }) => {
    if(!load) return null;

    return (
        <View style={styles.loading}>
            <ActivityIndicator size={25} color={"#333"} />
        </View>
    );
}

const App = () => {

    const BASE_URL = "https://api.github.com";
    const perPage = 20;

    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ page, setPage ] = useState(1);

    const renderItem = ({ item }) => <Item title={item.full_name} />;

    useEffect(() => {
        loadApi();
    }, []);

    const loadApi = async () => {
        if(loading) return;

        setLoading(true);

        const response = await axios.get(`${BASE_URL}/search/repositories?q=react&per_page=${perPage}&page=${page}`);

        setData([...data, ...response.data.items]);
        setPage(page + 1);
        setLoading(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={{ marginTop: 35 }}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                onEndReached={loadApi}
                onEndReachedThreshold={0.1} // 10%
                ListFooterComponent={<FooterList load={loading} />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#333',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5
    },
    title: {
        fontSize: 20,
        color: "#fff"
    },
    loading: {
        padding: 10
    }
});

export default App;