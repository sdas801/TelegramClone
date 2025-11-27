import { StyleSheet, Text, View, Switch, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Fontisto'
import BoxUtility from './Components/BoxUtility'
import Feather from 'react-native-vector-icons/Feather'
import Colors from '../../../constants/Colors/Colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const Profile = ({ route, navigation }) => {
  const { name } = route.params;
  const { profilePhoto } = route.params;

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

              <Text
                style={{
                  color: letterColor,
                  fontSize: 25,
                }}
              >{name?.charAt(0).toUpperCase()}</Text>

            }
          </View>
          <View style={{ flexDirection: 'column', marginLeft: 10, }}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>123456789</Text>
          </View>
        </View>

        {/* info */}
        <View
          style={{
            // backgroundColor:'red',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 10,
            height: 300
          }}
        >
          {/* Info heading */}
          <Text style={{ color: Colors.AppBarBackgroundColor }}>Info</Text>

          {/* number */}
          <View>
            <Text style={styles.infoTitle}>+91 123456789</Text>
            <Text style={styles.infoSubtitle}>Mobile</Text>
          </View>

          {/* username */}
          <View style={{
            flexDirection: 'row',
            // backgroundColor:'red',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* leadning */}
            <View>
              <Text style={styles.infoTitle}>@name</Text>
              <Text style={styles.infoSubtitle}>Username</Text>
            </View>
            {/* trailing */}
            <MaterialIcons name='qr-code-scanner' size={30} color={Colors.AppBarBackgroundColor} />
          </View>

          {/* birthday */}
          <View>
            <Text style={styles.infoTitle}>Jan 06, 1998</Text>
            <Text style={styles.infoSubtitle}>Birthday</Text>
          </View>

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


      {/* Media  */}
      {/* <View
        style={[styles.Card]}
      >
      <Text>Shared Media</Text>
      </View> */}


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

export default Profile

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