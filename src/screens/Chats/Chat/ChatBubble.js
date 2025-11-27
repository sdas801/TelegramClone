import { StyleSheet, Text, View, Image, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors/Colors'
import Video from 'react-native-video';

import Ionicons from 'react-native-vector-icons/Ionicons'

const ChatBubble = ({
  left,
  data,
  photo,
  video,
  file,
  filename,
  duration,
  fileType,
  chatType,
  senderName,
  senderImage,
  fromUser,
  timestamp,
  seen,
  deleted,
  deletedat,
  replyMsg,
  replySenderName,
}) => {
  return (
    <View
      style={[
        styles.ChatBubble,
        {
          alignItems: left ? 'flex-start' : 'flex-end',
        },
      ]}
    >
      <ChatContainer
        left={left}
        data={data}
        photo={photo}
        video={video}
        file={file}
        filename={filename}
        duration={duration}
        fileType={fileType}
        chatType={chatType}
        senderName={senderName}
        senderImage={senderImage}
        fromUser={fromUser}
        timestamp={timestamp}
        seen={seen}
        deleted={deleted}
        deletedat={deletedat}
        replyMsg={replyMsg}
        replySenderName={replySenderName}

      />
    </View>
  );
};


const ChatContainer = ({
  left,
  data,
  photo,
  video,
  file,
  filename,
  fileType,
  chatType,
  duration,
  senderName,
  senderImage,
  fromUser,
  timestamp,
  seen,
  deleted,
  deletedat,
  replyMsg,
  replySenderName,
}) => {
  const [loading, setLoading] = useState(true);
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // const getColorForUser = id => {
  //   let hash = 0;
  //   for (let i = 0; i < id.length; i++) {
  //     hash = id.charCodeAt(i) + ((hash << 5) - hash);
  //   }
  //   const color = `hsl(${hash % 360}, 70%, 60%)`; // fixed color per user
  //   console.log('color: -->', color, 'id-->>', id)
  //   return color;
  // };
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
  const backgroundColor = getColorForBackground(senderName);
  const letterColor = getColorForLetter(senderName);
  const replySenderNameColor = getColorForLetter(replySenderName);
  const sender = senderName
    ?.split(' ')
    .map(i => i.charAt(0).toUpperCase())
    .join('');

  return (
    // bubble container
    <View style={{
      flexDirection: 'row',

    }}>

      {/* circle for grp */}
      {left && chatType === 'group' ?
        <View style={{
          height: 35,
          width: 35,
          backgroundColor: backgroundColor,
          borderRadius: 35,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 5,

        }}>
          {senderImage ? (
            <ImageBackground
              source={{
                uri: `https://hyggeliteprodblobstorage.blob.core.windows.net/hyggemedia/uploadedFiles/${senderImage}`,
              }}
              imageStyle={{
                borderRadius: 35,
              }}
              style={{
                height: '100%',
                width: '100%',
              }}
              resizeMode="cover"
            ></ImageBackground>
          ) : (
            <Text
              style={{
                color: letterColor,

              }}
            >
              {sender}
            </Text>
          )}
        </View> : null}

      {/* chat bubble */}
      <View style={{
        // height: 'auto',
        minWidth:deleted ===1 ?'60%':replyMsg ? '50%':'20%',
        maxWidth: '80%',
        width: 'auto',
        backgroundColor: left
          ? deleted === 1 ? '#494949ff':'#d1eafaff'
          : deleted === 1
            ? '#494949ff'
            : Colors.ChatBubbleColor,
        borderTopLeftRadius: left ? 10 : 15,
        borderTopRightRadius: left ? 15 : 10,
        borderBottomRightRadius: left ? 15 : 5,
        borderBottomLeftRadius: left ? 5 : 15,
        paddingHorizontal: 5,
        paddingVertical: 5,
        overflow: 'hidden'
      }}>
        {/* sender name */}
        {left ? chatType === 'group' ? <Text
          style={{
            color: letterColor,
          }}
        >{senderName}</Text>:null : null}

          {/* replyMessage */}
          {replyMsg
          ? deleted ===1 
          ? null
          :<View
          style={{
            backgroundColor:left?'#c3d9e7ff':'#dfe4ceff',
            borderRadius:5,
            overflow:'hidden',
            flexDirection:'row'
          }}
          >
            {/* color bar */}
            <View
            style={{
              backgroundColor: replySenderNameColor,
              height:'auto',
              width:3
            }}
            />

            {/* text */}
            <View style={{
              paddingHorizontal:5,
            paddingVertical:5,
            }}>
              <Text style={{
              color: replySenderNameColor,

              }}>{replySenderName}</Text>
            <Text>{data}</Text>
            </View>
            
          </View>
        : null
        }

        {/* photo */}
        {photo
          ? deleted === 1
            ? <Text
              style={{
                paddingHorizontal: 5,
                paddingVertical: 5,
                color: deleted === 1
                  ? 'grey'
                  : Colors.ChatBubbleTextColor,
                flexShrink: 1,
                flexWrap: 'wrap',
                fontStyle: 'italic'
              }}>
              Photo deleted 
            </Text>
            : <Image
              source={{ uri: photo }}
              style={{
                width: 190,
                height: 200,
                borderRadius: 10,
              }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => setLoading(false)}
              resizeMode="cover"
            /> : null}

        {/* video */}
        {/* <Video
        source={{ uri: video }} // Use 'uri' key inside 'source' object
        controls={true} // Equivalent to useNativeControls in expo-av
        resizeMode="cover"
        paused={true} // Start paused until user taps 'play'
        // The following props are important for clean behavior in FlatList
        repeat={false}
        playInBackground={false}
      /> */}

        {/* chat text */}
        {data
          ? deleted === 1
            ? <Text
              style={{
                paddingHorizontal: 5,
                paddingVertical: 5,
                color: deleted === 1
                  ? 'grey'
                  : Colors.ChatBubbleTextColor,
                flexShrink: 1,
                flexWrap: 'wrap',
                fontStyle: 'italic'
              }}>
              Message deleted 
            </Text>
            :
            <Text
            >{replyMsg || data}</Text>
          : null}

        {/* file */}

        {fileType == 'pdf'
          ||
          fileType == 'docx'
          ||
          fileType == 'doc'
          ||
          fileType == 'docx'
          ||
          fileType == 'xls'
          ||
          fileType == 'xlsx'
          ?
          deleted === 1 ?
            <Text style={{
              paddingHorizontal: 5,
                paddingVertical: 5,
                color: deleted === 1
                  ? 'grey'
                  : Colors.ChatBubbleTextColor,
                flexShrink: 1,
                flexWrap: 'wrap',
                fontStyle: 'italic'
            }}>
              Flie deleted
            </Text>
            :
            <View style={{
              flexDirection: 'row',

            }}>

              {/* file icon */}
              <View
                style={{
                  marginRight: 10,
                  height: 45,
                  width: 45,
                  borderRadius: 45,
                  backgroundColor: '#43aaf0ff',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Ionicons name='document-text' color='white' size={25} />
              </View>

              {/* file name */}
              <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                // backgroundColor:'red',
                alignItems: 'flex-end'

              }}>
                {/* file name */}
                <Text style={{
                  width: '100%',

                }}>{filename}</Text>
                {/* size and  file type */}
                <Text
                  style={{
                    color: 'grey',
                    // backgroundColor:'blue',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >{'SIZE'}{' '}{fileType.toUpperCase()}</Text>

              </View>
            </View>
          :
          null
        }

        {/* time */}
        {deleted === 1
          ? null
          : <View 
            style={{
              position: photo ? 'absolute' : 'relative',
              bottom: photo ? 8 : null,
              right: photo ?  8 : null,
              width: photo ? 'auto' : null,
              backgroundColor: photo ? '#5f5d5d93' : null,
              paddingHorizontal: photo ? 5 : 0,
              borderRadius: 15,
              flexDirection:'row',
              justifyContent:'flex-end'

            }}
          >
            <Text style={{
              
              alignSelf: 'flex-end',
              textAlign: 'right',
              color: photo ? '#c9c9c9ff' : 'grey'
            }}>{time}</Text>
            {
              seen === 0 && left === false
                ? deleted === 1
                  ? null
                  : <Ionicons name='checkmark' size={20} color={photo ? '#c9c9c9ff' : 'grey'} />
                :
                seen === 2 && left === false
                  ? deleted === 1
                    ? null
                    : <Ionicons name='checkmark-done' size={20} color={photo ? '#c9c9c9ff' : 'grey'} />
                  : null
            }
          </View>

        }

      </View>
    </View>
  );
};
export default ChatBubble

const styles = StyleSheet.create({
  ChatBubble: {

    marginVertical: 10,
    marginHorizontal: 10,
    // backgroundColor:'red',
    justifyContent: 'center',



  },
  ChatContainer: {
    backgroundColor: Colors.ChatBubbleColor,
    maxWidth: '90%',
    paddingVertical: 3,
    paddingHorizontal: 3,
    width: 'auto',
    height: 'auto'
  },

})