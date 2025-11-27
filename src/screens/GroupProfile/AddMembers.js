import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList, Modal, TextInput, Alert } from 'react-native';
import React, { useState } from 'react'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import BoxContainer from '../../constants/Container/BoxContainer';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather'
import Colors from '../../constants/Colors/Colors'
import data from '../../data/data'
import SelectedAddCard from '../../constants/Container/SelectedAddCard'

const AddMembers = ({ route, navigation }) => {
    const { members } = route.params;

    const selectedId = members.map(item => item.id);

    const nonMatchingContacts = data.filter((item, index) => {
        return !selectedId.includes(item.id)
    })

    console.log(data)
    console.log(nonMatchingContacts)
    const [selectedIndices, setSelectedIndices] = useState([])


    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: 'white' }}

        >
            <KeyboardAvoidingView style={{ backgroundColor: 'white', flex: 1 }}>
                <View style={{ height: 'auto',
                    backgroundColor: 'white',

                    borderBottomWidth: 2,
                    borderColor: '#eeeeeeff',
                    paddingVertical: 20,
                    paddingHorizontal: 10,}}>
                    {selectedIndices.length === 0 ? (<View
                        style={{

                        }}><Text style={{
                            fontSize: 18,
                            color: '#a5a4a4ff'
                        }}>Search for People...</Text></View>) :
                        (<FlatList
                            horizontal={true}
                            style={{



                            }}
                            data={nonMatchingContacts}
                            renderItem={item => {
                                return (


                                    selectedIndices.includes(item.index) ?  <SelectedAddCard name={item.item.name} />: null


                                )
                            }}
                        />)}
                </View>

                <FlatList
                    style={{
                        flex: 1,
                        // backgroundColor:'white'
                    }}
                    data={nonMatchingContacts}

                    renderItem={(item) => {
                        const currentIndex = item.index;
                        return (
                            <TouchableOpacity
                                onPress={() => {

                                    setSelectedIndices(prevIndices => {
                                        if (prevIndices.includes(currentIndex)) {
                                            return prevIndices.filter(i => i !== currentIndex);
                                        } else {
                                            return [...prevIndices, currentIndex];
                                        }
                                    });
                                }}
                            >
                                <BoxContainer
                                    icon={<Fontisto name='person' size={30} />}
                                    onPressActive={selectedIndices.includes(currentIndex)}
                                    title={item.item.name}
                                    subtitle={'time'}
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
                    onPress={() => {
                        navigation.pop()
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

export default AddMembers

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