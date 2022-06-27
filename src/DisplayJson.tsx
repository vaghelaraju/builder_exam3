import React, {Component} from 'react';  
import {Platform, StyleSheet, Text, View} from 'react-native';  
  
type Props = {};  
type SS = {
  item:any;
};  

export default class DisplayJson extends Component<Props,SS> {  
  constructor(props:Props){
    super(props);
    this.state={
      item:props.route ?props.route.params.item:{},
    };
  }
  render() {  
    return (  
      <View>  
        <Text>Display json</Text>  
        <Text>{JSON.stringify(this.state.item)}</Text>  
      </View>  
    );  
  }  
}  