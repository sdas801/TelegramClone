import {BackHandler, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React,{useEffect, useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Chats from '../screens/Chats/Chats'
import Status from '../screens/Status/Status'
import Account from '../screens/Account/Account'
import Calls from '../screens/Calls/Calls'
import Entypo from 'react-native-vector-icons/Entypo'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather'

import Colors from '../constants/Colors/Colors'
const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  
  useFocusEffect(
  useCallback(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true; // stop default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // cleanup when leaving screen
  }, [])
);

  return (

    <Tab.Navigator>
      <Tab.Screen name='Chats' component={Chats} options={{
        header: () => <AppBar title='Chats' />,
        tabBarActiveTintColor: Colors.AppBarBackgroundColor,


        tabBarIcon: ({ color, size }) => (
          <Feather name='message-square' color={color} size={size} />
        )
      }} />
      <Tab.Screen name='Status' component={Status} options={{
        header: () => <AppBar title='Status' />,
        tabBarActiveTintColor: Colors.AppBarBackgroundColor,
        tabBarIcon: ({ color, size }) => (
          <Feather name='message-circle' color={color} size={size} />
        )
      }} />
      <Tab.Screen name='Calls' component={Calls} options={{
        header: () => <AppBar title='Calls' />,
        tabBarActiveTintColor: Colors.AppBarBackgroundColor,
        tabBarIcon: ({ color, size }) => (
          <Feather name='phone-call' color={color} size={size} />
        )
      }} />
      <Tab.Screen name='Account' component={Account} options={{
        header: () => <AppBar title='Account' />,
        tabBarActiveTintColor: Colors.AppBarBackgroundColor,
        tabBarIcon: ({ color, size }) => (
          <Feather name='user' color={color} size={size} />
        )
      }} />

    </Tab.Navigator>

  )
}

export const AppBar = (props) => {
  const navigation = useNavigation();
  return (
    //appbar view
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.AppBarBackgroundColor,
        width: '100%',
        height: 50,

        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}
    >
      {/* Bottom position */}
      <View
        style={{
          // backgroundColor: 'red',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* leading view */}
        <View style={{ flexDirection: 'row' }}>
          {/* <TouchableOpacity
                        onPress={()=>{
                           
                        }}
                    >
                        <Entypo name='dots-three-vertical' size={22} color={'white'} />
                    </TouchableOpacity> */}
          <View
            style={{
              // backgroundColor:'blue',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 30,
            }}
          >
            <Text style={{ fontSize: 24, color: 'white' }}>
              {props.title}
            </Text>
          </View>
        </View>
        {/* trailing view */}
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: 'row',
            // backgroundColor:'red',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '22%',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.push('SearchScreen');
            }}
          >
            <Fontisto name="search" size={20} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

            }}>
            <Entypo name="dots-three-vertical" size={22} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

}

export default TabNavigation

const styles = StyleSheet.create({})