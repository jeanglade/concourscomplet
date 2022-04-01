import React, {useState} from 'react';
import {colors} from '_config';
import {OpenJson, Modal} from '_components';
import {Image, StyleSheet} from 'react-native';

const ModalOpenJson = props => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Modal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      buttonStyleView={styles.iconPosition}
      buttonContent={
        <Image
          style={styles.iconImport}
          source={require('../../icons/import_down.png')}
        />
      }
      contentModal={
        <OpenJson
          setModalVisible={setModalVisible}
          addOneSerieDataTable={props.addOneSerieDataTable}
          showMessage={props.showMessage}
        />
      }
    />
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
  iconImport: {
    width: 30,
    height: 30,
  },
});

export default ModalOpenJson;
