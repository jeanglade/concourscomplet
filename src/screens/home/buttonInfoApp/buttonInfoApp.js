import React, {useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {View, Text, Image} from 'react-native';
import i18n from 'i18next';
import {styleSheet} from '_config';
import {MyButton} from '_components';

const ButtonInfoApp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <MyButton
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
        content={
          <Image
            style={styleSheet.icon30}
            source={require('../../icons/info.png')}
          />
        }
      />
      {modalVisible && (
        <View
          style={[
            styleSheet.backWhite,
            {
              position: 'absolute',
              right: 40,
            },
          ]}>
          <MyButton
            onPress={() => setModalVisible(!modalVisible)}
            content={
              <Text
                style={[styleSheet.text, styleSheet.textRight, {padding: 10}]}>
                {i18n.t('common:version')} : {DeviceInfo.getVersion()}
              </Text>
            }
          />
        </View>
      )}
    </>
  );
};

export default ButtonInfoApp;
