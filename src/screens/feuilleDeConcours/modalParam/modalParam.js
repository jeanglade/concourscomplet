import React, {useState} from 'react';
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
import {setFile} from '../../../utils/myAsyncStorage';

const ModalParam = props => {
  const [nbTries, setNbTries] = useState(props.concoursData?._?.nbTries);
  const [colPerfVisible, setColPerfVisible] = useState(
    props.concoursData?._?.colPerfVisible,
  );
  const [colFlagVisible, setColFlagVisible] = useState(
    props.concoursData?._?.colFlagVisible,
  );
  const [colWindVisible, setColWindVisible] = useState(
    props.concoursData?._?.colWindVisible,
  );
  const [colMiddleRankVisible, setColMiddleRankVisible] = useState(
    props.concoursData?._?.colMiddleRankVisible,
  );

  const saveParam = async () => {
    var data = props.concoursData;
    const oldValues = props.concoursData._;
    const newValues = {
      nbTries: nbTries !== null ? nbTries : oldValues.nbTries,
      colPerfVisible: colPerfVisible,
      colFlagVisible: colFlagVisible,
      colWindVisible: colWindVisible,
      colMiddleRankVisible: colMiddleRankVisible,
    };
    data._ = Object.assign(data._, newValues);
    await setFile(data?._?.id, JSON.stringify(data)).then(() =>
      props.refreshConcoursData(),
    );
  };

  return (
    <MyModal
      modalVisible={props.modalVisible}
      setModalVisible={bool => {
        if (!bool) {
          saveParam();
        }
        props.setModalVisible(bool);
      }}
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
            {props.concoursData?._?.type !== 'SB' && (
              <View>
                <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
                  <Text style={styleSheet.text}>
                    {i18n.t('competition:nb_tries')}
                  </Text>
                  <View style={{width: 100}}>
                    <MyDropdown
                      onValueChange={v => {
                        setNbTries(v);
                      }}
                      data={['3', '4', '6'].map(v => ({
                        label: v,
                        value: v,
                      }))}
                      selectedValue={nbTries}
                    />
                  </View>
                </View>
              </View>
            )}
            <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
              <MyCheckBox
                isChecked={colFlagVisible}
                setIsChecked={v => setColFlagVisible(v)}
              />
              <Text style={styleSheet.text}>
                {i18n.t('competition:col_flag_visible')}
              </Text>
            </View>
            <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
              <MyCheckBox
                isChecked={colPerfVisible}
                setIsChecked={v => setColPerfVisible(v)}
              />
              <Text style={styleSheet.text}>
                {i18n.t('competition:col_perf_visible')}
              </Text>
            </View>
            {props.concoursData?._?.type === 'SL' && (
              <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
                <MyCheckBox
                  isChecked={colWindVisible}
                  setIsChecked={v => setColWindVisible(v)}
                />
                <Text style={styleSheet.text}>
                  {i18n.t('competition:col_wind_visible')}
                </Text>
              </View>
            )}
            {props.concoursData?._?.type !== 'SB' && (
              <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
                <MyCheckBox
                  disabled={false}
                  isChecked={colMiddleRankVisible}
                  setIsChecked={v => setColMiddleRankVisible(v)}
                />
                <Text style={styleSheet.text}>
                  {i18n.t('competition:col_middle_rank_visible')}
                </Text>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 300,
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 10,
  },
});

export default ModalParam;
