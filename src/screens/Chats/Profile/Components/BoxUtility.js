import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
const BoxUtility = ({onPress, icon, title}) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    style={styles.MainView}
    >
    {icon}
    {title}
    </TouchableOpacity>
  )
}

export default BoxUtility

const styles = StyleSheet.create({
    MainView:{
        borderRadius:20,
        borderColor:'grey',
        borderWidth:1,
        backgroundColor:'white',
paddingHorizontal:10,
paddingVertical:10,
justifyContent:'center',
alignItems:'center',
width:'20%',
height:'auto'

    }
})