import React, {useState} from 'react';
import {colors} from '_config';
import {Modal} from '_components';
import {OpenJson} from '_homeComponents';
import {Image, StyleSheet} from 'react-native';

const ModalOpenJson = props => {
  const [modalVisible, setModalVisible] = useState(false);
  console.log('ModalOpenJson');
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
