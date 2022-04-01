import React, {useState} from 'react';
import {View, SafeAreaView, Modal, Image, StyleSheet} from 'react-native';
import {Button} from '_components';
import {colors} from '_config';

const MyModal = props => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView>
      <Button
        onPress={() => setModalVisible(true)}
        styleView={props.buttonStyleView}
        content={props.buttonContent}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button
              onPress={() => setModalVisible(false)}
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
        </View>
      </Modal>
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
