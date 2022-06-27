import React, { Component } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

type Props = {};
type SS = {
    dataList: any;
    loading: boolean;
    fetching_from_server: boolean

};
export default class HomeScreen extends Component<Props, SS> {
    pageCount: number = 0;
    totalPage: number = 100000;
    constructor(Props: Props) {
        super(Props)
        this.state = {
            dataList: [],
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
             this.getList();
        }, 10000)
    };

    getList = async () => {
        if ( this.pageCount> this.totalPage) {
            return;
        }
        this.setState({ fetching_from_server: true });
        console.log("on api call", this.pageCount);
        try {
            const response = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page=' + this.pageCount);
            const json = await response.json();
            const { hits, nbPages } = json;
            this.setState({
                dataList: this.pageCount == 0 ? hits : [...this.state.dataList, ...hits],
                fetching_from_server: false,

            });
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
    onItemPress = (item: any) => {
      console.log("item2",item);
      this.props.navigation.navigate('DisplayJson', { item: item })
    }
    renderItem = (item: any) => {
        return (
            <Card style={{marginTop:10}}>
             <Card.Content>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    console.log("item", item);
                    this.onItemPress(item);
                }}>
                <View style={styles.item}>
                    <Text style={[styles.title, styles.commonPadding]}>{item.title}</Text>
                    <Text style={styles.commonPadding}>{item.author}</Text>
                    <Text style={styles.commonPadding}>{item.url}</Text>
                    <Text style={styles.commonPadding}>{item.created_at}</Text>
                </View>
            </TouchableOpacity>
            </Card.Content>
          </Card>
            


        )
    };
    renderFooter() {
        return (
            //Footer View with Load More button
            <View style={styles.footer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.loadMoreData}
                    style={styles.loadMoreBtn}>
                    <Text style={styles.btnText}>Loading</Text>
                    {this.state.fetching_from_server ? (
                        <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    }
    loadMoreData = () => {
        console.log("loadmore");
        this.pageCount = 1 + this.pageCount;
        console.log("load more page count", this.pageCount);
        this.getList();

    };
    emptyListMessage = () => {
        return (<View style={[styles.container,styles.center]}><Text>No record found</Text></View>)

    };
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={this.state.dataList}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item) => item.id}
                    // ItemSeparatorComponent={this.renderSeparator}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this.renderFooter.bind(this)}
              

                />
            </SafeAreaView>
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
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: '#800000',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: "bold"
    },
    commonPadding: {
        paddingVertical: 5
    },
    center:{
        justifyContent:"center",
        alignItems:'center'
    }
})  