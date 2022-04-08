import React, {useState} from 'react';
import {colors} from '_config';
import {Modal} from '_components';
import {OpenJson} from '_screens';
import {Image, StyleSheet, Platform} from 'react-native';
import i18n from 'i18next';

const ModalOpenJson = props => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Modal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      buttonStyleView={styles.iconPosition}
      minWidth={Platform.OS === 'windows' ? 510 : 0}
      buttonTooltip={i18n.t('common:new_epreuve')}
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
    backgroundColor: colors.ffa_blue_light,
    padding: 10,
    margin: 5,
    borderRadius: 3,
  },
  iconImport: {
    width: 30,
    height: 30,
  },
});

export default ModalOpenJson;
