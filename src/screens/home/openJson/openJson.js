import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Keyboard,
  Platform,
} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {validateCompetitionCode} from '../../utils/webService';
import {saveEachSerie} from '../../utils/myAsyncStorage';
import {pickOneDeviceFile} from '../../utils/localService';
import {useNetInfo} from '@react-native-community/netinfo';
import {showMessage} from 'react-native-flash-message';
import {Button} from '_components';

const OpenJson = props => {
  const [codeConcours, setCodeConcours] = useState(null);
  const netInfo = useNetInfo();

  const manageCode = async () => {
    //S il y a internet
    if (netInfo.isConnected) {
      const jsonContent = await validateCompetitionCode(codeConcours);
      if (jsonContent != null) {
        saveEachSerie(jsonContent, props.addOneSerieDataTable);
        Keyboard.dismiss();
        setCodeConcours(null);
        if (props.setModalVisible) {
          props.setModalVisible(false);
        }
      }
    } else {
      showMessage({
        message: i18n.t('toast:no_internet_connexion'),
        type: 'danger',
      });
    }
  };

  return (
    <View
      style={[
        props.modal != null ? {} : styles.container,
        styleSheet.backWhite,
      ]}>
      <Text style={styleSheet.textTitle}>{i18n.t('common:new_epreuve')}</Text>
      <View style={[styleSheet.flexRowCenter]}>
        <TextInput
          style={[
            styleSheet.textInput,
            Platform.OS === 'windows' && {height: 45},
            {width: 130},
          ]}
          onChangeText={setCodeConcours}
          value={codeConcours}
          placeholder={i18n.t('common:code')}
          placeholderTextColor={colors.muted}
        />
        <Button
          onPress={manageCode}
          styleView={styleSheet.button}
          content={
            <Text style={[styleSheet.text, styleSheet.textWhite]}>
              {i18n.t('common:validate')}
            </Text>
          }
        />
        <View style={styles.dividerLeft}>
          <Button
            onPress={() => {
              pickOneDeviceFile(props.addOneSerieDataTable);
              if (props.setModalVisible) {
                props.setModalVisible(false);
              }
            }}
            styleView={styleSheet.button}
            content={
              <Text style={[styleSheet.text, styleSheet.textWhite]}>
                {i18n.t('common:via_local_file')}
              </Text>
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  dividerLeft: {
    borderColor: colors.muted,
    borderLeftWidth: 1,
    borderWidth: 0,
    marginHorizontal: 5,
    paddingStart: 5,
  },
});

export default OpenJson;
