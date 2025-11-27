import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';

const ContextMenu = () => {
  const menuRef = useRef(null);

  return (
    <View>
      <Button title="Show Menu" onPress={() => menuRef.current.show()} />
      <Menu ref={menuRef}>
        <MenuItem onPress={() => menuRef.current.hide()}>Edit</MenuItem>
        <MenuItem onPress={() => menuRef.current.hide()}>Delete</MenuItem>
      </Menu>
    </View>
  );
};

export default ContextMenu;