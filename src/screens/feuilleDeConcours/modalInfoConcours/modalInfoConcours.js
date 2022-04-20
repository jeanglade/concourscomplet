import React from 'react';
import {styleSheet} from '_config';
import {MyModal} from '_components';
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
  const getBarRiseTextValue = value => {
    if (value.toString().length === 2) {
      value = '0' + value.toString();
    }
    return value.toString()[0] + 'm' + value.toString().slice(1);
  };

  const getListBarre = () => {
    var res = '';
    if (
      props.concoursData.EpreuveConcoursComplet.hasOwnProperty('MonteesBarre')
    ) {
      for (
        i = 1;
        i <
        Object.keys(props.concoursData.EpreuveConcoursComplet.MonteesBarre)
          .length;
        i++
      ) {
        const nameBarre = 'Barre' + (i < 10 ? '0' : '') + i.toString();
        res +=
          getBarRiseTextValue(
            props.concoursData.EpreuveConcoursComplet.MonteesBarre[nameBarre],
          ) + ', ';
      }
    }
    return res.slice(0, -2);
  };

  return (
    <MyModal
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      buttonStyleView={[styleSheet.icon]}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonTooltip={i18n.t('competition:param')}
      buttonContent={
        <Image
          style={styleSheet.icon20}
          source={require('../../icons/info.png')}
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
              {i18n.t('competition:info_concours')}
            </Text>
            <View>
              <Text style={styleSheet.text}>
                {i18n.t('competition:name')} : {props.concoursData?._?.epreuve}
              </Text>
              <Text style={styleSheet.text}>
                {i18n.t('competition:date')} :{' '}
                {props.concoursData?._?.dateInfo.split(' - ')[0]}
              </Text>
              <Text style={styleSheet.text}>
                {i18n.t('competition:time_start')} :{' '}
                {props.concoursData?._?.dateInfo.split(' - ')[1]}
              </Text>
              {(props.concoursData?._?.statut === i18n.t('common:finished') ||
                props.concoursData?._?.statut ===
                  i18n.t('common:send_to_elogica')) && (
                <Text style={styleSheet.text}>
                  {i18n.t('competition:time_end')} :
                </Text>
              )}
              <Text style={styleSheet.text}>
                {i18n.t('competition:status')} : {props.concoursData?._?.statut}
              </Text>
              <Text style={styleSheet.text}>
                {i18n.t('competition:nb_athletes')} :{' '}
                {props.concoursData?._?.nbAthlete}
              </Text>
              {props.concoursData?._?.type !== 'SB' && (
                <Text style={styleSheet.text}>
                  {i18n.t('competition:nb_tries')} :{' '}
                  {props.concoursData?._?.nbTries}
                </Text>
              )}
              {props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
                ?.NumTour != 7 && (
                <>
                  <Text style={styleSheet.text}>
                    {i18n.t('competition:nb_athlete_qualif')} :{' '}
                    {props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.NbQualifiePlace?.toString()}
                  </Text>
                  {!props.concoursData?.EpreuveConcoursComplet
                    ?.TourConcoursComplet?.StandardQualificationPlace && (
                    <Text style={styleSheet.text}>
                      {i18n.t('competition:perf_minima')} :{' '}
                      {getBarRiseTextValue(
                        props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.PerfMinima?.toString(),
                      )}
                    </Text>
                  )}
                </>
              )}
              {props.concoursData?._?.type === 'SB' && (
                <Text style={[styleSheet.text, {width: 300}]}>
                  {i18n.t('competition:bar_rise')} : {getListBarre()}
                </Text>
              )}
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

export default ModalInfoConcours;
