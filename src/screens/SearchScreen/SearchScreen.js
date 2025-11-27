import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, {useEffect, useState, useLayoutEffect , useContext} from 'react';
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import BoxContainer from '../../constants/Container/BoxContainer'

import { AppContext } from '../../services/AppContext'
import Colors from '../../constants/Colors/Colors'

const SearchScreen = ({navigation}) => {
const { userId } = useContext(AppContext);
  const {auth} = useContext(AppContext)
    const [userData, setUserData] = useState(null)
    const [searchText, setSearchText] = useState(null)
  
    useLayoutEffect(()=>{
        
        navigation.setOptions({
          headerTitle: () => (
                <View>
                    <TextInput
                        placeholder='Search'
                        value={searchText}
                        onChangeText={(i)=>setSearchText(i)} 
                        placeholderTextColor="gray"
                        autoFocus={true} 
                    />
                </View>
            ),
        });
    })
    useEffect(() => {
        navigation.addListener('focus', async (e) => {
          getChatList()
    
        })
      }, [])
      const getChatList = async () => {
    let flag = false
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${auth}`);
    const raw = JSON.stringify({
      orgnid: 18,
      search: '',
      userId: userId,
      tz: 'Asia/Kolkata',
      deviceType: 'Android',
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    await fetch("https://dev.myhygge.io/hygmapi/api/v1/chat/getChatList", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // console.log(result)
        const obj = JSON.parse(result)
        flag = obj.status === 200
        if (flag) {
          if(searchText !== ''){
            let searchList = obj.response.filter((item)=>{

            searchList === item.userDetails?.[0]?.full_name ?? item.groupName
          })
          setUserData(searchList)
          console.log('searchList------>',searchList)
        }
          else{
          setUserData(obj.response)

          }
          
          console.log('after request', obj.response)
        }
        else {
          console.log('error while fatching')
        }


      })
      .catch((error) => console.error(error));
    console.log('status: ', flag)



  }
  return (
    //main view
    <View
      style={styles.MainView}
    >
      {userData === null ? null : (
        <FlatList
          data={userData}
          renderItem={(item) => {
            // console.log(item.item)
            
            const name = item.item.userDetails?.[0]?.full_name ?? item.item.groupName ?? 'no name'
            const chatId = item.item._id
            
            const chatType = item.item.chatType
            const userList = item.item.users
            // console.log(item.item.users)
            return (
              (<TouchableOpacity
                style={{

                  alignItems: 'flex-end'
                }}
                onPress={() => {
                    navigation.push('Chat', { name: name, id: chatId, userList:userList, chatType:chatType});


                }}
              >

                <BoxContainer

                  icon={<Fontisto name='person' size={30} />}
                  title={
                    name??'no name'
                  }
                  subtitle={'hey'}
                // status={item.item.day}

                >

                </BoxContainer>
                <View style={styles.Line}></View>
              </TouchableOpacity>)

            )
          }}


        />)}
      <TouchableOpacity
        onPress={() => {
          navigation.push('NewMessage')
        }}
        style={styles.fab}>
        <Fontisto name="plus-a" size={20} color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  MainView: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'white',
    flex: 1,

  },
  Line: {
    height: 1,
    width: '80%',

    backgroundColor: '#cecece9d'
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.AppBarBackgroundColor,
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
})