import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import BoxContainer from '../constants/Container/BoxContainer'
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto'
import Feather from 'react-native-vector-icons/Feather'

const NavigableHeaderTitle = ({name, subtitle, chatType,nav, members, selectedId, profilePhoto, userDetails}) => {
    
const navigation = useNavigation()
    return (
        <TouchableOpacity
            onPress={ ()=>{
                navigation.push(nav, {name:name , members:members, selectedId:selectedId, userDetails: userDetails, profilePhoto:profilePhoto} )
            }}
        >
            
            <BoxContainer
                iconStyle={{
                    width: 40,
                    height: 40,
                    borderRadius: 40
                }}
                boxStyle={{
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    margin:0,
                }}

                title={name}

                profilePhoto={profilePhoto}
                subtitle={subtitle}
                titleStyle={{
                    color: 'white'
                }}
                subtitleStyle={{
                    color: 'white'
                }}
                chatType={chatType}
            />
        </TouchableOpacity>
    )
}

export default NavigableHeaderTitle