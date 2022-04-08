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
    <View
      style={[
        styles.modalView,
        Platform.OS === 'windows' && {minWidth: props.minWidth},
      ]}>
      <Button
        onPress={() => {
          props.setModalVisible(false);
        }}
        styleView={styles.iconClosePosition}
        content={
          <Image
            style={styles.iconClose}
            source={require('../../icons/close.png')}
          />
        }
      />
      <View>{props.contentModal}</View>
    </View>
  );

  return (
    <>
      <Button
        onPress={() => {
          props.setModalVisible(true);
        }}
        styleView={props.buttonStyleView}
        content={props.buttonContent}
        tooltip={props.buttonTooltip}
      />
      {Platform.OS === 'ios' || Platform.OS === 'android' ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.modalVisible}>
          <View style={styles.centeredView}>{contentModal}</View>
        </Modal>
      ) : (
        <Popup isOpen={props.modalVisible}>
          <View style={styles.centeredView}>{contentModal}</View>
        </Popup>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      Platform.OS === 'windows' ? colors.transparent : 'rgba(52, 52, 52, 0.8)',
  },
  // Revoir celle ci
  modalView: {
    backgroundColor: colors.white,
    borderColor: Platform.OS === 'windows' ? colors.muted : colors.white,
    borderWidth: Platform.OS === 'windows' ? 2 : 0,
    borderBottomWidth: Platform.OS === 'windows' ? 3 : 0,
    borderRadius: Platform.OS === 'windows' ? 0 : 15,
    padding: 20,
    alignItems: 'flex-end',
  },
  iconClosePosition: {position: 'absolute', top: -5, right: -5},
  iconClose: {
    width: 25,
    height: 25,
  },
});

export default MyModal;
