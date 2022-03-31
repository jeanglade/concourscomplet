import React, {useState} from 'react';
import {colors} from '_config';
import {OpenJson} from '_components';
import {
  View,
  TouchableWithoutFeedback,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

const ModalOpenJson = props => {
  const [modalImportVisible, setModalImportVisible] = useState(false);

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={() => setModalImportVisible(true)}>
        <View style={styles.iconPosition}>
          <Image
            style={styles.iconImport}
            source={require('../../icons/import_white.png')}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalImportVisible}
        onRequestClose={() => setModalImportVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableWithoutFeedback
              onPress={() => setModalImportVisible(false)}>
              <View style={styles.iconClosePosition}>
                <Image
                  style={styles.iconClose}
                  source={require('../../icons/close.png')}
                />
              </View>
            </TouchableWithoutFeedback>
            <OpenJson
              addOneSerieDataTable={props.addOneSerieDataTable}
              showMessage={props.showMessage}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconPosition: {
    top: 15,
    right: 5,
    position: 'absolute',
    backgroundColor: colors.ffa_blue_dark,
    padding: 10,
    margin: 5,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.ffa_blue_light,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
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
  modalContent: {},
  iconImport: {
    width: 30,
    height: 30,
  },
  iconClose: {
    width: 25,
    height: 25,
  },
  iconClosePosition: {position: 'absolute', top: 15, right: 15},
});

export default ModalOpenJson;
