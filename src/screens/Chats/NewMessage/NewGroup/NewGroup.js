import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList, Modal, TextInput, Dimensions, ToastAndroid } from 'react-native';
import React, { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import BoxContainer from '../../../../constants/Container/BoxContainer';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather'
import Colors from '../../../../constants/Colors/Colors'
import data from '../../../../data/data'
import SelectedAddCard from '../../../../constants/Container/SelectedAddCard'
import { AppContext } from '../../../../services/AppContext'



const NewGroup = ({ route, navigation }) => {
    const { auth } = useContext(AppContext)


    const [selectedId, setSelectedId] = useState([])
    const [userData, setUserData] = useState(null)

    const pressedFloatingAdd = useRef(false);



    useFocusEffect(
        useCallback(() => {
            pressedFloatingAdd.current = false;
            getUserList()

        }, [])

    )
    const getUserList = async () => {
        let flag = false
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${auth}`);
        const raw = JSON.stringify({
            "orgnid": 18,
            "search": "",
            "userId": 28,
            "userType": 3,
            "tz": "Asia/Kolkata",
            "deviceType": "Android"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        await fetch("https://dev.myhygge.io/hygmapi/api/v1/chat/getUserList", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log(result)
                const obj = JSON.parse(result)
                flag = obj.status === 200
                if (flag) {
                    setUserData(obj.response)

                }
                else {
                    console.log('error while fatching')
                }


            })
            .catch((error) => console.error(error));
        console.log('status: ', flag)



    }


    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: 'white' }}

        >
            <KeyboardAvoidingView style={{ backgroundColor: 'white', flex: 1 }}>
                <View style={{
                    height: 'auto',
                    backgroundColor: 'white',

                    borderBottomWidth: 2,
                    borderColor: '#eeeeeeff',
                    paddingVertical: 20,
                    paddingHorizontal: 10,

                }}>
                    {selectedId.length === 0 ?
                        (<View
                            style={{

                            }}><Text style={{
                                fontSize: 18,
                                color: '#a5a4a4ff'
                            }}>Who would you like to add?</Text></View>) :
                        (<FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}

                            style={{



                            }}
                            data={userData}
                            renderItem={item => {
                                const currentId = item.item.id;
                                const last_activity_time = item.item.last_activity_time;
                                const date = new Date(last_activity_time);
                                const name = item.item.full_name;
                                const profileImage = item.item.imageurl;
                                return (


                                    selectedId.includes(currentId) ? <SelectedAddCard name={name} profilePhoto={profileImage} /> : null


                                )
                            }}
                        />)}
                </View>

                <FlatList
                    style={{
                        flex: 1,
                        // backgroundColor:'white'
                    }}
                    data={userData}

                    renderItem={(item) => {
                        const currentId = item.item.id;
                        const last_activity_time = item.item.last_activity_time;
                        const date = new Date(last_activity_time);
                        const name = item.item.full_name;
                        const profileImage = item.item.imageurl;
                        return (
                            <TouchableOpacity
                                onPress={() => {

                                    setSelectedId(prevId => {
                                        if (prevId.includes(currentId)) {
                                            return prevId.filter(i => i !== currentId);
                                        } else {
                                            return [...prevId, currentId];
                                        }
                                    });
                                }}
                            >
                                <BoxContainer
                                    profilePhoto={profileImage}

                                    onPressActive={selectedId.includes(currentId)}
                                    title={
                                        name || 'no name'
                                    }
                                    subtitle={(date.toDateString() + '   ' + date.toLocaleTimeString())}
                                    boxStyle={{ paddingVertical: 10 }}


                                >

                                </BoxContainer>
                            </TouchableOpacity>
                        )
                    }
                    }
                    ItemSeparatorComponent={() => <View style={styles.Line}></View>}

                />
                {/* floating botton */}
                <TouchableOpacity
                    disabled={pressedFloatingAdd.current}

                    onPress={() => {
                        if (pressedFloatingAdd.current) return;
                        pressedFloatingAdd.current = true;
                        const groupMembers = userData.filter((item, index) => {

                            return selectedId.includes(item.id);

                        });
                        if (selectedId.length > 1) navigation.push('CreateGroup', { members: groupMembers });
                        else {
                            pressedFloatingAdd.current = false;
                            ToastAndroid.show('minimun 2 member', ToastAndroid.SHORT);
                        }
                    }}
                    style={styles.fab}
                >
                    <Feather
                        name='arrow-right' size={25} color='white'
                    />


                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default NewGroup

const styles = StyleSheet.create({
    Line: {
        height: 1,
        width: '100%',
        backgroundColor: '#cecece9d'
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: Colors.AppBarBackgroundColor,
        width: 55,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,

    },

})