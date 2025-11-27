import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'
import Colors from '../Colors/Colors'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Ionicons from 'react-native-vector-icons/Ionicons'

const BoxContainer = ({
  icon,
  chatType,
  content,
  title,
  subtitle,
  profilePhoto,
  onPressActive: onPressActive,
  rightCircle,
  status,
  iconStyle,
  boxStyle,
  contentStyle,
  titleStyle,
  subtitleStyle,
}) => {
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
  const backgroundColor = getColorForBackground(title)
  const letterColor = getColorForLetter(title)
  return (
    //main view
    <View
      style={[styles.MainView, boxStyle]}
    >
      {/* leading */}
      <View
        style={styles.Leading}
      >
        {/* profile circle */}
        {icon ||
          <View
            style={[
              styles.Circle,
              iconStyle,
              {
                borderWidth: 0,
                backgroundColor: profilePhoto ? 'transparent' : backgroundColor,
              }
            ]}
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
              chatType === 'group' ?
                <Ionicons name='people' size={25} color={letterColor} />
                :
                <Text
                  style={{
                    color: letterColor,
                    fontSize: 25
                  }}
                >{title?.charAt(0).toUpperCase()}</Text>
            }
            {onPressActive ? (<View style={{
              position: 'absolute',
              backgroundColor: '#20b61aff',
              borderWidth: 3,
              borderColor: 'white',
              height: 27,
              width: 27,
              borderRadius: 27,
              bottom: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <FontAwesome6 name='check' size={14} color={'white'} />
            </View>) : null}
          </View>}
        {/* Content area*/}
        {content}
        <View
          style={[styles.Content, contentStyle]}
        >
          <Text
           numberOfLines={1}
            ellipsizeMode="tail" 
            style={[styles.Title, titleStyle]}>{title}</Text>
          <Text 
          numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.Subtitle, subtitleStyle]}>{subtitle}</Text>
        </View>
      </View>
      {/* trailing */}
      <View
        style={styles.Trailing}
      >
        <Text
          style={styles.Subtitle}
        >{status}</Text>
      </View>
    </View>
  )
}

export default BoxContainer

const styles = StyleSheet.create({
  MainView: {
    paddingVertical: 10,
    // backgroundColor:'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  Leading: {
    flexDirection: 'row',
    // backgroundColor:'green',
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  Circle: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.AppBarBackgroundColor,
  },
  Content: {
    // backgroundColor:'green',
    width: 'auto',
    marginLeft: '5%',
  },
  Title: {
    // backgroundColor:'orange',
    fontSize: 18,
  },
  Subtitle: {
    // backgroundColor:'red',
    fontSize: 14,
  },
  Trailing: {
    width: '20%',
    // backgroundColor:'blue',
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
})