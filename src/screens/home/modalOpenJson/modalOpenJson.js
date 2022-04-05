import React, {useState} from 'react';
import {colors} from '_config';
import {Modal} from '_components';
import {OpenJson} from '../openJson';
import {Image, StyleSheet, Platform} from 'react-native';

const ModalOpenJson = props => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Modal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      buttonStyleView={styles.iconPosition}
      minWidth={Platform.OS === 'windows' ? 510 : 0}
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
          modal={Platform.OS === 'windows' ? true : null}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  iconPosition: {
    width: 55,
    height: 55,
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
