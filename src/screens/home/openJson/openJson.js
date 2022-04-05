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
import {colors} from '_config';
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
      }
    } else {
      console.error(i18n.t('toast:no_internet_connexion'));
      showMessage({
        message: i18n.t('toast:no_internet_connexion'),
        type: 'danger',
      });
    }
    Keyboard.dismiss();
    setCodeConcours(null);
    if (props.setModalVisible) {
      props.setModalVisible(false);
    }
  };

  return (
    <View style={props.modal != null ? {} : styles.container}>
      <Text style={styles.titleText}>{i18n.t('common:new_epreuve')}</Text>
      <View style={[styles.row]}>
        <TextInput
          style={[
            styles.textinput,
            Platform.OS === 'windows' && styles.textInputSize,
          ]}
          onChangeText={setCodeConcours}
          value={codeConcours}
          placeholder={i18n.t('common:code')}
          placeholderTextColor={colors.muted}
        />
        <Button
          onPress={manageCode}
          styleView={styles.button}
          content={
            <Text style={styles.textButton}>{i18n.t('common:validate')}</Text>
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
            styleView={styles.button}
            content={
              <Text style={styles.textButton}>
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
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
  },
  row: {
    display: 'flex',
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
  textInputSize: {height: 55},
});

export default OpenJson;
