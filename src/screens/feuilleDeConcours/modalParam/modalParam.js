import React, {useState} from 'react';
import {colors, styleSheet} from '_config';
import {Modal, Dropdown} from '_components';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import i18n from 'i18next';

const ModalParam = props => {
  return (
    <Modal
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      buttonStyleView={styles.button}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonTooltip={i18n.t('competition:param')}
      buttonContent={
        <Image
          style={styles.icon}
          source={require('../../icons/settings.png')}
        />
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
              {i18n.t('competition:param')}
            </Text>
            <View style={styles.row}>
              <Text style={styles.text}>{i18n.t('competition:nb_tries')}</Text>
              <Dropdown
                styleContainer={{with: 200}}
                stylePickerIOS={{width: 200}}
                onValueChange={v => {
                  props.setNbTries(v);
                }}
                data={['1', '2', '3', '4', '5', '6'].map(v => ({
                  label: v,
                  value: v,
                }))}
                selectedValue={props.nbTries.toString()}
              />
            </View>
            <View style={styles.row}>
              <CheckBox
                value={props.colFlagVisible}
                onValueChange={v => props.setColFlagVisible(v)}
              />
              <Text style={styles.text}>
                {i18n.t('competition:col_flag_visible')}
              </Text>
            </View>
            <View style={styles.row}>
              <CheckBox
                value={props.colPerfVisible}
                onValueChange={v => props.setColPerfVisible(v)}
              />
              <Text style={styles.text}>
                {i18n.t('competition:col_perf_visible')}
              </Text>
            </View>
            <View style={styles.row}>
              <CheckBox
                value={props.colWindVisible}
                onValueChange={v => props.setColWindVisible(v)}
              />
              <Text style={styles.text}>
                {i18n.t('competition:col_wind_visible')}
              </Text>
            </View>
            <View style={styles.row}>
              <CheckBox
                disabled={false}
                value={props.colMiddleRankVisible}
                onValueChange={v => props.setColMiddleRankVisible(v)}
              />
              <Text style={styles.text}>
                {i18n.t('competition:col_middle_rank_visible')}
              </Text>
            </View>
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

export default ModalParam;
