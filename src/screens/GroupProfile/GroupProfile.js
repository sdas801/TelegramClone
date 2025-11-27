import { StyleSheet, Text, View, Switch, FlatList, TouchableOpacity , ImageBackground} from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Fontisto'
import BoxUtility from '../Chats/Profile/Components/BoxUtility'
import Feather from 'react-native-vector-icons/Feather'
import Colors from '../../constants/Colors/Colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Video from 'react-native-video'
import BoxContainer from '../../constants/Container/BoxContainer'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
const GroupProfile = ({ route, navigation }) => {
    const { name } = route.params;
    const { members } = route.params;
    const { profilePhoto } = route.params;
    const userDetails = route.params?.userDetails;

    const [isEnabled, setIsEnabled] = useState(true);

    const getColorForBackground = name => {
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // convert hash → hue (0–360)
    const hue = Math.abs(hash) % 360;
    // softer pastel tones
    return `hsl(${hue}, 65%, 90%)`;
  };

  const getColorForLetter = name => {
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // convert hash → hue (0–360)
    const hue = Math.abs(hash) % 360;
    // softer pastel tones
    return `hsl(${hue}, 90%, 40%)`;
  };

  const backgroundColor = getColorForBackground(name)
  const letterColor = getColorForLetter(name)

    return (
        <View>
            {/* profile show */}
            <View
                style={[styles.Card,]}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignContent: 'flex-end',
                    backgroundColor: Colors.AppBarBackgroundColor,
                    paddingVertical: 10,
                    paddingBottom: 20,
                    paddingHorizontal: 10
                }}>

                    <View
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 60,
                            backgroundColor: profilePhoto ? 'transparent' : backgroundColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: Colors.AppBarBackgroundColor
                        }}
                    >
                        {profilePhoto ?
                                      (<ImageBackground
                                        source={{ uri: `https://hyggeliteprodblobstorage.blob.core.windows.net/hyggemedia/uploadedFiles/${profilePhoto}` }}
                                        style={{
                                          height: '100%',
                                          width: '100%',
                                        }}
                                        imageStyle={{
                                          borderRadius: 60
                                        }}
                                        resizeMode="cover"
                                      ></ImageBackground>)
                        
                                      :
                                      
                                        <Ionicons name='people' size={25} color={letterColor} />
                                        
                                    }
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 10, }}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.subtitle}>{members.length + ' Members'}</Text>
                    </View>
                </View>

                {/* info */}
                <View
                    style={{
                        // backgroundColor:'red',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        height: 'auto'
                    }}
                >
                    {/* Info heading */}
                    <Text style={{ color: Colors.AppBarBackgroundColor }}>Info</Text>


                    {/* notification */}
                    <View style={{
                        flexDirection: 'row',
                        // backgroundColor:'red',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {/* leadning */}
                        <View>
                            <Text style={styles.infoTitle}>Notification</Text>
                            <Text style={styles.infoSubtitle}>{isEnabled ? 'On' : 'Off'}</Text>
                        </View>
                        {/* trailing */}
                        <Switch
                            value={isEnabled}
                            onValueChange={() => isEnabled ? setIsEnabled(false) : setIsEnabled(true)}


                        />
                    </View>
                </View>




            </View>

            {/* member info */}
            <View style={[styles.Card]}>
                <View
                    style={{
                        paddingVertical: 10,


                    }}>
                    {/* add members */}
                    <TouchableOpacity
                        onPress={() => {
                            navigation.push('AddMembers', { members: members})
                        }}
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>
                        <View
                            style={{
                                height: 50,
                                width: 50,
                                justifyContent: 'center',
                                alignItems: 'center'

                            }}
                        >
                            <Ionicons
                                name='person-add-outline' size={25} color={Colors.AppBarBackgroundColor}
                            />
                        </View>

                        <Text style={{
                            color: Colors.AppBarBackgroundColor,
                            fontSize: 18,
                            paddingHorizontal: 15
                        }}>Add Members</Text>
                    </TouchableOpacity>
                    {/* member history */}
                    <FlatList

                        data={userDetails}
                        renderItem={item => {
                            console.log('-------------- from group profile -> ',item.item)
                            const profileImage = item.item.imageurl;
                            const last_activity_time = item.item.last_activity_time;
                            const date = new Date(last_activity_time);
                            const name = item.item.full_name;
                            // console.log('from the hroupprofile page ',item.item)

                            return (
                                <BoxContainer
                                    profilePhoto={profileImage}
                                    title={
                                        name || 'no name'
                                    }

                                    boxStyle={{ paddingVertical: 10 }}
                                />
                            )
                        }}
                    />
                </View>
            </View>

            {/* Media  */}
            <View
                style={[styles.Card]}
            >
                <Text>Shared Media</Text>
            </View>


            {/* floating message button */}
            <TouchableOpacity
                onPress={() => {
                    navigation.pop()
                }}
                style={{
                    position: 'absolute',
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                    top: 55,
                    right: 20,
                    backgroundColor: 'white',
                    elevation: 2,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Feather name='message-square' color={'grey'} size={27} />
            </TouchableOpacity>

        </View>
    )
}

export default GroupProfile

const styles = StyleSheet.create({
    Card: {
        height: 'auto',
        width: '100%',
        backgroundColor: 'white',
        elevation: 2,
        justifyContent: 'start',
        alignItems: 'start',
        // paddingVertical: 10,
        // paddingHorizontal: 10,
        marginBottom: 10,
        // backgroundColor: 'red'
    },
    RowOfUtility: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        // backgroundColor:'red',
        width: '100%',
        paddingVertical: 10

    },
    title: {
        fontSize: 24,
        // backgroundColor:'white'
        color: 'white'
    },
    subtitle: {
        fontSize: 18,
        color: 'white'

    },
    infoTitle: {
        fontSize: 18,
        // backgroundColor:'white'
        // color:'white'
    },
    infoSubtitle: {
        fontSize: 14,
        color: 'grey'

    },
})