import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ImageBackground } from 'react-native'
import React, { useCallback, useEffect, useState, useLayoutEffect, useContext, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import BoxContainer from '../../constants/Container/BoxContainer';
// import data from '../../data/data'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Colors from '../../constants/Colors/Colors'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppContext } from '../../services/AppContext';

const Chats = ({ navigation }) => {
  const { userId, isLoading, auth } = useContext(AppContext);
  const [isLoadingMessage, setIsLoadingMessage] = useState(true);

  const pressedChatTile = useRef(false);
  const pressedFloatingAdd = useRef(false);

  console.log('from chats screen:', auth);
  console.log('from chats screen: ', userId);
  const [userData, setUserData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      pressedFloatingAdd.current = false;
      pressedChatTile.current = false;
      getChatList();
    }, []),
  );

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
          console.log('step 1-', obj.response)
          console.log('from chats screen:', auth);
          console.log('from chats screen: ', userId);

          setUserData(obj.response)
          setIsLoadingMessage(false);
          console.log('after request', obj.response)
        }
        else {
          console.log('error while fatching')
        }


      })
      .catch((error) => console.error(error));
    console.log('status: ', flag)



  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <TouchableOpacity
          style={{
            backgroundColor: '#a5fdc2ff'
          }}
          onPress={getChatList}>
          <Text style={{
            color: 'green'
          }}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    //main view
    <View
      style={styles.MainView}
    >
      {userData === null
        ?
        (<View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>)
        :
        (
          <FlatList
            data={userData}
            renderItem={(item) => {
              const updatedAt = item.item.updatedAt;
              const chatType = item.item.chatType;
              
              const name = item.item.userDetails?.length > 1
                ? item.item.groupName || 'no group name'
                : item.item.userDetails?.length == 1 ?
                  item.item.userDetails?.[0]?.full_name || 'no name' :
                  'no name';
              const chatId = item.item._id;
              const lastMsg = item.item.lastMsg;
              const lastMsgBy = item.item.lastMsgBy;
              const groupImg = item.item.groupImg;
              const profileImage = item.item.userDetails?.[0]?.imageurl;
              const userList = item.item.users;
              const userDetails = [...item.item.userDetails];
              const date = new Date(updatedAt);
              const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                (<TouchableOpacity
                  disabled={pressedChatTile.current}
                  style={{
                    alignItems: 'flex-end'
                  }}
                  onPress={() => {
                    if (pressedChatTile.current) return;

                    pressedChatTile.current = true;
                    navigation.push('Chat', {
                      name: name,
                      subtitle: time,
                      id: chatId,
                      userList: userList,
                      chatType: chatType,
                      profilePhoto: groupImg || (item.item.userDetails?.length === 1 ? profileImage : null),
                      userDetails: userDetails
                    });
                  }}
                >

                  <BoxContainer
                    profilePhoto={groupImg || (item.item.userDetails?.length === 1 ? profileImage : null)}
                    contentStyle={{
                      width:'80%'
                    }}
                    title={
                      name || 'no name'
                    }
                    subtitle={lastMsg || 'no last message'}
                    chatType={chatType}
                  // status={item.item.day}
                  >

                  </BoxContainer>
                  <Text
                    style={{
                      position: 'absolute',
                      bottom: '50%',
                      right: '2%',
                    }}
                  >{time}</Text>
                  <View style={styles.Line}></View>
                </TouchableOpacity>)

              )
            }}


          />)}
      <TouchableOpacity
      disabled={pressedFloatingAdd.current}
        onPress={() => {
          if(pressedFloatingAdd.current) return;
          pressedFloatingAdd.current = true;
          navigation.push('NewMessage')
        }}
        style={styles.fab}>
        <Fontisto name="plus-a" size={20} color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default Chats

const styles = StyleSheet.create({
  MainView: {
    paddingHorizontal: 10,
    // paddingVertical: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})