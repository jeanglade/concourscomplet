import React, {useState} from 'react';
import {colors, styleSheet} from '_config';
import {MyModal, MyDropdown, MyCheckBox, MyButton} from '_components';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import i18n from 'i18next';
import {setFile} from '../../../../utils/myAsyncStorage';
import {setConcoursStatus} from '../../../../utils/convertor';

const ModalParam = props => {
  const [modalVisible, setModalVisible] = useState(false);

  // If params changed or not (to avoid unless saves)
  const [hasChanged, setHasChanged] = useState(false);

  const [nbTries, setNbTries] = useState(props.concoursData?._?.nbTries);
  const [colPerfVisible, setColPerfVisible] = useState(
    props.concoursData?._?.colPerfVisible,
  );
  const [colFlagVisible, setColFlagVisible] = useState(
    props.concoursData?._?.colFlagVisible,
  );
  const [fieldWindVisible, setFieldWindVisible] = useState(
    props.concoursData?._?.fieldWindVisible,
  );
  const [fieldPerfVisible, setFieldPerfVisible] = useState(
    props.concoursData?._?.fieldPerfVisible,
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
      fieldWindVisible: colPerfVisible && fieldWindVisible,
      fieldPerfVisible: colPerfVisible && fieldPerfVisible,
      colMiddleRankVisible:
        nbTries !== null ? (nbTries > 4 ? colMiddleRankVisible : false) : false,
    };
    data._ = Object.assign(data._, newValues);
    //Mise à jour du statut du concours
    if (data._?.statut === i18n.t('common:ready')) {
      data = setConcoursStatus(data, i18n.t('common:in_progress'));
    }
    await setFile(data?._?.id, JSON.stringify(data));
  };

  return (
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={bool => {
        if (!bool && hasChanged) {
          setHasChanged(false);
          saveParam();
          props.refreshConcoursData();
        }
        setModalVisible(bool);
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
              <View
                style={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  borderColor: colors.muted,
                  paddingBottom: 15,
                }}>
                <Text style={[styleSheet.textTitle, {color: colors.black}]}>
                  {i18n.t('competition:general')}
                </Text>
                <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
                  <Text style={styleSheet.text}>
                    {i18n.t('competition:nb_tries')}
                  </Text>
                  <View style={{width: 100}}>
                    <MyDropdown
                      onValueChange={v => {
                        setHasChanged(true);
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
            <Text style={[styleSheet.textTitle, {color: colors.black}]}>
              {i18n.t('competition:visibility')}
            </Text>
            <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
              <MyCheckBox
                isChecked={colFlagVisible}
                setIsChecked={v => {
                  setHasChanged(true);
                  setColFlagVisible(v);
                }}
              />
              <MyButton
                onPress={() => {
                  setHasChanged(true);
                  setColFlagVisible(!colFlagVisible);
                }}
                content={
                  <Text style={styleSheet.text}>
                    {i18n.t('competition:col_flag_visible')}
                  </Text>
                }
              />
            </View>
            <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
              <MyCheckBox
                isChecked={colPerfVisible}
                setIsChecked={v => {
                  setHasChanged(true);
                  setColPerfVisible(v);
                }}
              />
              <MyButton
                onPress={() => {
                  setHasChanged(true);
                  setColPerfVisible(!colPerfVisible);
                }}
                content={
                  <Text style={styleSheet.text}>
                    {i18n.t('competition:col_perf_visible')}
                  </Text>
                }
              />
            </View>
            {props.concoursData?._?.type === 'SL' && colPerfVisible && (
              <>
                <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
                  <MyCheckBox
                    isChecked={fieldWindVisible}
                    setIsChecked={v => {
                      setHasChanged(true);
                      setFieldWindVisible(v);
                    }}
                  />
                  <MyButton
                    onPress={() => {
                      setHasChanged(true);
                      setFieldWindVisible(!fieldWindVisible);
                    }}
                    content={
                      <Text style={styleSheet.text}>
                        {i18n.t('competition:field_wind_visible')}
                      </Text>
                    }
                  />
                </View>
                <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
                  <MyCheckBox
                    isChecked={fieldPerfVisible}
                    setIsChecked={v => {
                      setHasChanged(true);
                      setFieldPerfVisible(v);
                    }}
                  />
                  <MyButton
                    onPress={() => {
                      setHasChanged(true);
                      setFieldPerfVisible(!fieldPerfVisible);
                    }}
                    content={
                      <Text style={styleSheet.text}>
                        {i18n.t('competition:field_perf_visible')}
                      </Text>
                    }
                  />
                </View>
              </>
            )}
            {props.concoursData?._?.type !== 'SB' &&
              nbTries > 4 &&
              colPerfVisible && (
                <View style={[styleSheet.flexRow, {alignItems: 'center'}]}>
                  <MyCheckBox
                    disabled={false}
                    isChecked={colMiddleRankVisible}
                    setIsChecked={v => {
                      setHasChanged(true);
                      setColMiddleRankVisible(v);
                    }}
                  />
                  <MyButton
                    onPress={() => {
                      setHasChanged(true);
                      setColMiddleRankVisible(!colMiddleRankVisible);
                    }}
                    content={
                      <Text style={styleSheet.text}>
                        {i18n.t('competition:col_middle_rank_visible')}
                      </Text>
                    }
                  />
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
