import React from 'react';
import {colors} from '_config';
import {Modal} from '_components';
import {View, StyleSheet, Image, Platform} from 'react-native';

import i18n from 'i18next';

const ModalBar = props => {
  return (
    <Modal
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      buttonStyleView={styles.button}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonContent={
        <Text style={styles.textButton}>{i18n.t('competition:bar_rise')}</Text>
      }
      maxHeight={760}
      contentModal={
        <View
          style={[
            styles.container,
            Platform.OS === 'windows' && {minHeight: 400},
          ]}></View>
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
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_light,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 3,
    borderColor: colors.ffa_blue_light,
  },
  textButton: {
    color: colors.white,
    fontSize: 16,
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
    borderColor: colors.ffa_blue_light,
    backgroundColor: colors.ffa_blue_light,
    padding: 10,
    margin: 5,
    borderRadius: 3,
    borderWidth: 2,
  },
});

export default ModalBar;
