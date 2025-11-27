import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useLayoutEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather'
const SearchScreen = ({navigation}) => {
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:'SearchScreen',
            headerRight: ()=>(
                <TouchableOpacity>
                    <Feather name='search' size={25}/>
                </TouchableOpacity>
            
            )
        });
    })
  return (
    <View>
      <Text>SearchScreen</Text>
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({})