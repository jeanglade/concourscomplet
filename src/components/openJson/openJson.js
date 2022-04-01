import React, {useState} from 'react';
import {StyleSheet, TextInput, Text, View, Keyboard} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';
import {validateCompetitionCode} from '../../utils/webService';
import {saveEachSerie} from '../../utils/myAsyncStorage';
import {pickOneDeviceFile} from '../../utils/localService';
import {useNetInfo} from '@react-native-community/netinfo';
import {showMessage} from 'react-native-flash-message';
import {Button} from '_components';

const OpenJson = props => {
  const [t] = useTranslation();
  const [codeConcours, setCodeConcours] = useState(null);
  const netInfo = useNetInfo();

  const manageCode = async () => {
    //S il y a internet
    if (netInfo.isConnected) {
      const jsonContent = await validateCompetitionCode(
        codeConcours,
        t,
        props.showMessage,
      );
      if (jsonContent != null) {
        saveEachSerie(
          jsonContent,
          t,
          props.showMessage,
          props.addOneSerieDataTable,
        );
      }
    } else {
      console.error(t('toast:no_internet_connexion'));
      showMessage({
        message: t('toast:no_internet_connexion'),
        type: 'danger',
      });
    }
    Keyboard.dismiss();
    setCodeConcours(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{t('common:new_epreuve')}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.textinput}
          onChangeText={setCodeConcours}
          value={codeConcours}
          placeholder={t('common:code')}
          placeholderTextColor={colors.muted}
        />
        <Button
          onPress={manageCode}
          styleView={styles.button}
          content={
            <Text style={styles.textButton}>{t('common:validate')}</Text>
          }
        />
        <View style={styles.dividerLeft}>
          <Button
            onPress={() =>
              pickOneDeviceFile(
                t,
                props.showMessage,
                props.addOneSerieDataTable,
              )
            }
            styleView={styles.button}
            content={
              <Text style={styles.textButton}>
                {t('common:via_local_file')}
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
    backgroundColor: colors.white,
    marginHorizontal: 20,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    fontSize: 16,
    padding: 10,
    paddingVertical: 14,
    width: 130,
    color: colors.black,
    backgroundColor: colors.white,
    borderColor: colors.muted,
    borderWidth: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_dark,
    paddingHorizontal: 20,
    paddingVertical: 13, //Same height than TextInput
    marginHorizontal: 15,
    borderWidth: 3,
    borderColor: colors.ffa_blue_light,
  },
  textButton: {
    color: colors.white,
    fontSize: 16,
  },
  dividerLeft: {
    borderColor: colors.muted,
    borderLeftWidth: 1,
    borderWidth: 0,
  },
});

export default OpenJson;
