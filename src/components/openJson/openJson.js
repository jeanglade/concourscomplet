import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';
import {validateCompetitionCode} from '../../utils/webservice';
import {saveEachSerie} from '../../utils/myasyncstorage';
import {pickOneDeviceFile} from '../../utils/localservice';

const OpenJson = props => {
  const [t] = useTranslation();
  const [codeCompetition, setCodeCompetition] = useState(null);

  const manageCode = async () => {
    const myjson = await validateCompetitionCode(
      codeCompetition,
      t,
      props.showMessage,
    );
    if (myjson != null)
      saveEachSerie(myjson, t, props.showMessage, props.addOneSerieDataTable);
    Keyboard.dismiss();
    setCodeCompetition(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{t('common:new_epreuve')}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.textinput}
          onChangeText={setCodeCompetition}
          value={codeCompetition}
          placeholder={t('common:code')}
          placeholderTextColor={colors.muted}
        />
        <TouchableWithoutFeedback onPress={manageCode}>
          <View style={styles.button}>
            <Text style={styles.textButton}>{t('common:validate')}</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.dividerLeft}>
          <TouchableWithoutFeedback
            onPress={() =>
              pickOneDeviceFile(
                t,
                props.showMessage,
                props.addOneSerieDataTable,
              )
            }>
            <View style={styles.buttonWithIcon}>
              <Image
                style={styles.iconButton}
                source={require('../../icons/import.png')}
              />
              <Text style={styles.textButton}>
                {t('common:via_local_file')}
              </Text>
            </View>
          </TouchableWithoutFeedback>
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
  },
  dividerLeft: {
    borderColor: colors.muted,
    borderLeftWidth: 1,
    borderWidth: 0,
  },
  buttonWithIcon: {
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_dark,
    padding: 20,
    marginHorizontal: 15,
    borderWidth: 3,
    borderColor: colors.ffa_blue_light,
  },
  iconButton: {width: 30, height: 30},
});

export default OpenJson;
