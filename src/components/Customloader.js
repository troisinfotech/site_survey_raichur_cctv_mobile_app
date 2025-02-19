import React, { useState } from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native';
import { COLOR } from '../common/typography';

export default function Customloader() {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Modal animationType="none" transparent={true} visible={modalVisible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff05',
        }}>
        <View
          style={[
            {
              padding: 10,
              borderRadius: 10,
              backgroundColor: COLOR.PRIMARY,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <ActivityIndicator size="large" color={'#E9F4EA'} />
        </View>
      </View>
    </Modal>
  );
}
