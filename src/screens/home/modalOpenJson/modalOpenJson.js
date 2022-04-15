import React, {useState} from 'react';
import {styleSheet} from '_config';
import {MyModal} from '_components';
import {OpenJson} from '_screens';
import {Image, Platform} from 'react-native';
import i18n from 'i18next';

const ModalOpenJson = props => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      buttonStyleView={styleSheet.icon}
      minWidth={Platform.OS === 'windows' ? 510 : 0}
      buttonTooltip={i18n.t('common:new_epreuve')}
      buttonContent={
        <Image
          style={styleSheet.icon20}
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

export default ModalOpenJson;
