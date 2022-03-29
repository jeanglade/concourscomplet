import React, {useState} from 'react';
import DeviceInfo from 'react-native-device-info';

import {
  View,
  Text,
  TouchableWithoutFeedback,
  Pressable,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';

const ButtonInfoApp = () => {
  const [t] = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
        <View>
          <Image
            style={{
              width: 40,
              height: 40,
            }}
            source={require('../../icons/info.png')}
          />
        </View>
      </TouchableWithoutFeedback>
      {modalVisible && (
        <View style={styles.parent}>
          <Pressable onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.text}>
              {t('common:version')} {DeviceInfo.getVersion()}
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    textAlign: 'center',
    padding: 10,
    textAlign: 'right',
    fontSize: 16,
  },
  parent: {
    backgroundColor: colors.white,
    position: 'absolute',
    right: 50,
  },
});

export default ButtonInfoApp;
