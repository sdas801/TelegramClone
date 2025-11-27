import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/Colors/Colors'
import Fontisto from 'react-native-vector-icons/Fontisto'

const callsData = [
  { id: '1', name: 'Alice Johnson', time: 'Yesterday, 10:13 pm', type: 'voice', image: 'https://via.placeholder.com/60' },
  { id: '2', name: 'Bob Smith', time: '25 October, 4:54 pm', type: 'voice', image: 'https://via.placeholder.com/60' },
  { id: '3', name: 'Charlie Brown',  time: '25 October, 4:43 pm', type: 'voice', image: 'https://via.placeholder.com/60' },
  { id: '4', name: 'Diana Prince', time: '25 October, 4:08 pm', type: 'voice', image: 'https://via.placeholder.com/60' },
  { id: '5', name: 'Ethan Hunt', time: '23 October, 10:34 am', type: 'video', image: 'https://via.placeholder.com/60' },
  { id: '6', name: 'Fiona Gallagher', time: '23 October, 10:12 pm', type: 'video', image: 'https://via.placeholder.com/60' },
  { id: '7', name: 'George Martin', time: '23 October, 10:07 pm', type: 'voice', image: 'https://via.placeholder.com/60' },
];

const CallItem = ({ item }) => (
  <View style={styles.callRow}>
    <View
    style={styles.circleProfile}
    >
    <Fontisto name='person' size={30}/>
    </View>
    
    <View style={{ flex: 1 }}>
      <Text style={styles.name}>{item.name}</Text>
      {item.number && <Text style={styles.subtext}>{item.number}</Text>}
      <Text style={styles.subtext}>{item.time}</Text>
    </View>
    <Icon
      name={item.type === 'video' ? 'videocam' : 'call'}
      size={24}
      color={Colors.AppBarBackgroundColor}
    />
  </View>
);

export default function CallsScreen() {
  return (
    <View style={styles.container}>
      

      <Text style={styles.sectionTitle}>Favorites</Text>
      <View style={styles.favContainer}>
        <View style={styles.favIcon}>
          <Icon name="favorite" size={28} color="white" />
        </View>
        <Text style={styles.favText}>Add favourite</Text>
      </View>

      <Text style={styles.sectionTitle}>Recent</Text>

      <FlatList
        data={callsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CallItem item={item} />}
      />

      <TouchableOpacity style={styles.fab}>
        <Icon name="add-call" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 8 },
  favContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  favIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.AppBarBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favText: { fontSize: 16 },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent:'center',
    alignItems:'center'
  },
  circleProfile: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 12, 
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:2,
    borderColor:Colors.AppBarBackgroundColor
  },
  name: { fontSize: 16, fontWeight: '500' },
  subtext: { color: 'gray', fontSize: 13 },
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
});
