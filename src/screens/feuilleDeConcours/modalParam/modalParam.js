import React from 'react';
import {colors, styleSheet} from '_config';
import {MyModal, MyDropdown, MyCheckBox} from '_components';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import i18n from 'i18next';

const ModalParam = props => {
  return (
    <MyModal
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      buttonStyleView={[styleSheet.icon, {backgroundColor: colors.muted}]}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonTooltip={i18n.t('competition:param')}
      buttonContent={
        <Image
          style={styleSheet.icon20}
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
            <View style={styleSheet.flexRow}>
              <Text style={styleSheet.text}>
                {i18n.t('competition:nb_tries')}
              </Text>
              <MyDropdown
                styleContainer={{}}
                stylePickerIOS={{width: 200}}
                onValueChange={v => {
                  props.setNbTries(v);
                }}
                data={['1', '2', '3', '4', '5', '6'].map(v => ({
                  label: v,
                  value: v,
                }))}
                selectedValue={props.nbTries}
              />
            </View>
            <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
              <MyCheckBox
                isChecked={props.colFlagVisible}
                setIsChecked={v => props.setColFlagVisible(v)}
              />
              <Text style={styleSheet.text}>
                {i18n.t('competition:col_flag_visible')}
              </Text>
            </View>
            <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
              <MyCheckBox
                isChecked={props.colPerfVisible}
                setIsChecked={v => props.setColPerfVisible(v)}
              />
              <Text style={styleSheet.text}>
                {i18n.t('competition:col_perf_visible')}
              </Text>
            </View>
            <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
              <MyCheckBox
                isChecked={props.colWindVisible}
                setIsChecked={v => props.setColWindVisible(v)}
              />
              <Text style={styleSheet.text}>
                {i18n.t('competition:col_wind_visible')}
              </Text>
            </View>
            <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
              <MyCheckBox
                disabled={false}
                isChecked={props.colMiddleRankVisible}
                setIsChecked={v => props.setColMiddleRankVisible(v)}
              />
              <Text style={styleSheet.text}>
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
  container: {
    minWidth: Platform.OS === 'windows' ? 300 : '50%',
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

export default ModalParam;
