import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { version } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LogOut = ({navigation}) => {
  return (
    <View style={{
        justifyContent: 'center',
        alignItems:'center',
        flex:1

    }}>
      <TouchableOpacity style={{
        backgroundColor:'#ffcacaff',
        borderRadius:20,
        paddingVertical:10,
        paddingHorizontal:30

      }}
      onPress={async()=>{
        console.log(
          'asyncstorage key userId: ',
          await AsyncStorage.getItem('userId'),
        );
        console.log(
          'asyncstorage key auth: ',
          await AsyncStorage.getItem('auth'),
        );
        await AsyncStorage.setItem('userId','');
        await AsyncStorage.setItem('auth','');
        console.log(
          'asyncstorage key userId: ',
          await AsyncStorage.getItem('userId'),
        );
        console.log(
          'asyncstorage key auth: ',
          await AsyncStorage.getItem('auth'),
        );
        navigation.replace('Login')
      }}
      ><Text style={{
        color:'red'
      }}>LogOut</Text></TouchableOpacity>
    </View>
  )
}

export default LogOut

const styles = StyleSheet.create({})