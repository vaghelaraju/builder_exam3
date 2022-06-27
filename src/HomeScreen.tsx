import React, { Component } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';

type Props = {};
type SS = {
    dataList: any;
    loading: boolean;
    fetching_from_server: boolean

};
export default class HomeScreen extends Component<Props, SS> {
    pageCount: number = 0;
    totalPage: number = 0;
    constructor(Props: Props) {
        super(Props)
        this.state = {
            dataList: ["1", "2", "3"],
            loading: true,
            fetching_from_server: false,
        }
        this.pageCount = 0;
    }

    componentDidMount() {
        this.getList();
        setInterval(() => {
            this.pageCount = 1 + this.pageCount;
            console.log("Counter page", this.pageCount);
            // this.getList();
        }, 10000)
    };

    getList = async () => {
        try {
            const response = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page=' + this.pageCount);
            const json = await response.json();
            const { hits, nbPages } = json;
            this.setState({ dataList: hits });
            this.totalPage = nbPages;
        } catch (error) {
            console.error(error);
        }
    };
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    };
    //handling onPress action  
    getListViewItem = (item: any) => {
        Alert.alert(item.key);
    }
    renderView = (item: any) => {
        return (
            <View>
                <Text>{item.title}</Text>
                <Text>{item.author}</Text>
                <Text>{item.url}</Text>
                <Text>{item.created_at}</Text>
            </View>

        );
    };
    loadMoreData = () => {
        console.log("loadmore");
        this.pageCount = 1 + this.pageCount;
        console.log("load more page count", this.pageCount);

    };
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataList}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => this.renderView(item)}
                    ItemSeparatorComponent={this.renderSeparator}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={0.1}


                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 10,
        fontSize: 18,

    },
})  