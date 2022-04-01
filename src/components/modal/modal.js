import React from 'react';
import {
  View,
  SafeAreaView,
  Modal,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {Popup} from 'react-native-windows';
import {Button} from '_components';
import {colors} from '_config';

const MyModal = props => {
  const contentModal = (
    <View style={styles.modalView}>
      <Button
        onPress={() => props.setModalVisible(false)}
        styleView={styles.iconClosePosition}
        content={
          <Image
            style={styles.iconClose}
            source={require('../../icons/close.png')}
          />
        }
      />
      {props.contentModal}
    </View>
  );

  return (
    <SafeAreaView>
      <Button
        onPress={() => props.setModalVisible(true)}
        styleView={props.buttonStyleView}
        content={props.buttonContent}
      />
      {Platform.OS === 'ios' || Platform.OS === 'android' ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.modalVisible}
          onRequestClose={() => props.setModalVisible(false)}>
          <View style={styles.centeredView}>{contentModal}</View>
        </Modal>
      ) : (
        <Popup isOpen={props.modalVisible}>{contentModal}</Popup>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  // Revoir celle ci
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    elevation: 100,
    maxHeight: 200,
    alignItems: 'flex-end',
  },
  iconClosePosition: {position: 'absolute', top: 15, right: 15},
  iconClose: {
    width: 25,
    height: 25,
  },
});

export default MyModal;