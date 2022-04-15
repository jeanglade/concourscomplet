import React from 'react';
import {styleSheet} from '_config';
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

const ModalInfoConcours = props => {
  return (
    <Modal
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
              <Text style={styleSheet.text}>Nom :</Text>
              <Text style={styleSheet.text}>Date :</Text>
              <Text style={styleSheet.text}>Heure de début :</Text>
              <Text style={styleSheet.text}>Heure de fin :</Text>
              <Text style={styleSheet.text}>Statut :</Text>
              <Text style={styleSheet.text}>Nombre d'athlète :</Text>
              <Text style={styleSheet.text}>Nombre d'essai :</Text>
              <Text style={styleSheet.text}>Standard de qualification :</Text>
              <Text style={styleSheet.text}>
                Nombre d'athlète qualifié (Q) :
              </Text>
              <Text style={styleSheet.text}>Liste des barres :</Text>
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
