import React from 'react';
import {colors, styleSheet} from '_config';
import {Modal} from '_components';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import i18n from 'i18next';

const ModalInfoConcours = props => {
  return (
    <Modal
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      buttonStyleView={styles.button}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonTooltip={i18n.t('competition:info_concours')}
      buttonContent={
        <Image style={styles.icon} source={require('../../icons/info.png')} />
      }
      maxHeight={760}
      contentModal={
        <View
          style={[
            styles.container,
            Platform.OS === 'windows' && {minHeight: 400},
          ]}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={0}>
            <Text style={styleSheet.textTitle}>
              {i18n.t('competition:info_concours')}
            </Text>
          </KeyboardAvoidingView>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
  },
  button: {
    backgroundColor: colors.ffa_blue_light,
    padding: 10,
    margin: 5,
    borderRadius: 3,
  },
  container: {
    minWidth: Platform.OS === 'windows' ? 300 : '50%',
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: colors.black,
  },
});

export default ModalInfoConcours;
