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
                Nom : {props.concoursData._.epreuve}
              </Text>
              <Text style={styleSheet.text}>
                Date : {props.concoursData._.dateInfo.split(' - ')[0]}
              </Text>
              <Text style={styleSheet.text}>
                Heure de début : {props.concoursData._.dateInfo.split(' - ')[1]}
              </Text>
              {(props.concoursData._.statut === i18n.t('common:finished') ||
                props.concoursData._.statut ===
                  i18n.t('common:send_to_elogica')) && (
                <Text style={styleSheet.text}>Heure de fin :</Text>
              )}
              <Text style={styleSheet.text}>
                Statut : {props.concoursData._.statut}
              </Text>
              <Text style={styleSheet.text}>
                Nombre d'athlète : {props.concoursData._.nbAthlete}
              </Text>
              {props.concoursData._.type !== 'SB' && (
                <Text style={styleSheet.text}>
                  Nombre d'essai : {props.concoursData._.nbTries}
                </Text>
              )}
              {props.concoursData.EpreuveConcoursComplet.TourConcoursComplet
                .NumTour != 7 && (
                <>
                  <Text style={styleSheet.text}>
                    Standard de qualification : {props.concoursData._.epreuve}
                  </Text>
                  {props.concoursData.EpreuveConcoursComplet.TourConcoursComplet
                    .StandardQualificationPlace && (
                    <Text style={styleSheet.text}>
                      Nombre d'athlète qualifié (Q) :{' '}
                      {props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.NbQualifiePlace.toString()}
                      {props.concoursData._.epreuve}
                    </Text>
                  )}
                </>
              )}
              {props.concoursData._.type === 'SB' && (
                <Text style={[styleSheet.text, {width: 300}]}>
                  Liste des barres : {getListBarre()}
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
