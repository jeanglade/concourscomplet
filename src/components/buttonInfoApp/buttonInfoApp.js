import React, {useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';

const ButtonInfoApp = props => {
  const [t] = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
        <View>
          <Image style={styles.icon} source={require('../../icons/info.png')} />
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
    padding: 10,
    textAlign: 'right',
    fontSize: 16,
  },
  parent: {
    backgroundColor: colors.white,
    position: 'absolute',
    right: 50,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
});

export default ButtonInfoApp;
