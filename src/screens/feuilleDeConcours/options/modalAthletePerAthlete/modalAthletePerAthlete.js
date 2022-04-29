import React, {useState} from 'react';
import {colors, styleSheet} from '_config';
import {MyModal} from '_components';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import i18n from 'i18next';
import {setConcoursStatus} from '../../../../utils/convertor';

const ModalAthletePerAthlete = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // If athlete results has changed or not (to avoid unless saves)
  const [hasChanged, setHasChanged] = useState(false);

  const saveDatas = async () => {
    var data = props.concoursData;
    //Mise à jour du statut du concours
    if (data._?.statut === i18n.t('common:ready')) {
      data = setConcoursStatus(data, i18n.t('common:in_progress'));
    }
    await setFile(data?._?.id.toString(), JSON.stringify(data));
  };

  return (
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={bool => {
        if (!bool && hasChanged) {
          setHasChanged(false);
          saveDatas();
          props.refreshConcoursData();
        }
        setModalVisible(bool);
      }}
      buttonStyleView={[
        styleSheet.icon,
        {backgroundColor: colors.ffa_blue_dark},
      ]}
      buttonTooltip={i18n.t('competition:athlete_per_athlete')}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonContent={
        <Image
          style={styleSheet.icon20}
          source={require('../../icons/change.png')}
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
            <Text
              style={[styleSheet.textTitle, {marginStart: 5, marginBottom: 0}]}>
              {i18n.t('competition:athlete_per_athlete')}
            </Text>
            <View style={[styles.containerCenter]}></View>
          </KeyboardAvoidingView>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray_light,
    paddingLeft: 10,
    paddingVertical: 2,
    margin: 1,
    borderRadius: 3,
  },
  container: {
    minWidth: 300,
  },
  containerCenter: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 1,
  },
});

export default ModalAthletePerAthlete;
