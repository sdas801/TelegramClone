import {ImageBackground, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList, Modal, TextInput, Alert, Dimensions } from 'react-native';
const SelectedAddCard = ({ name , profilePhoto}) => {
    const firstLetter = name[0];
    const firstWord = name.split(' ', 1);

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

    const alphabetColors = {
        // Primary & Bright Colors
        A: '#FF5733', // Vivid Orange-Red
        B: '#31c04bff', // Bright Green
        C: '#3357FF', // Bright Blue
        D: '#FF33A1', // Pink/Magenta
        E: '#A1FF33', // Yellow-Green
        F: '#5733FF', // Violet

        // Pastels & Medium Tones
        G: '#FFC300', // Gold/Yellow
        H: '#C70039', // Dark Red/Crimson
        I: '#900C3F', // Deep Maroon
        J: '#581845', // Dark Purple
        K: '#DAF7A6', // Pale Lime Green
        L: '#FFC83D', // Saffron Yellow
        M: '#FF3D83', // Raspberry Pink
        N: '#3DFFC8', // Aqua Blue

        // Earth Tones & Grays
        O: '#6A5ACD', // Slate Blue
        P: '#4682B4', // Steel Blue
        Q: '#808080', // Gray
        R: '#D2B48C', // Tan/Beige
        S: '#9ACD32', // Yellow-Green/Olive
        T: '#FFD700', // Gold

        // Deeper/Cooler Colors
        U: '#00FFFF', // Cyan
        V: '#008080', // Teal
        W: '#40E0D0', // Turquoise
        X: '#8A2BE2', // Blue Violet
        Y: '#800080', // Purple
        Z: '#FF8C00', // Dark Orange
    };
    return <View
    style={{
        height:'auto',
        width:'auto',
        borderRadius:20,
        marginHorizontal:5,
        backgroundColor:'#e9e9e9ff',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        // backgroundColor:'red'

    }}
    >
        {/* leading */}
        <View
        style={{
            height:35,
            width:35,
            borderRadius:35,
            backgroundColor:profilePhoto ? 'transparent' : backgroundColor,
            justifyContent:'center',
            alignItems:'center'

        }}>{
            profilePhoto?
            <ImageBackground
            source={{ uri: `https://hyggeliteprodblobstorage.blob.core.windows.net/hyggemedia/uploadedFiles/${profilePhoto}` }}
              style={{
                height: '100%',
                width: '100%',
              }}
              imageStyle={{
                borderRadius: 35
              }}
              resizeMode="cover">

            </ImageBackground>
            :
              <Text style={{
                fontSize:14,
                color:letterColor

            }}>{firstLetter}</Text>
        }
            
        </View>
        
            <Text style={
                {
                    paddingHorizontal:10,
                    
                }
            }>{firstWord}</Text>
        

    </View >
}
export default SelectedAddCard;