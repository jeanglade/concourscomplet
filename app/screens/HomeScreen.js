import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useToast} from 'react-native-toast-notifications';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import R from '../assets/R';
import DataTable from './DataTable';

const HomeScreen = () => {
  const [t] = useTranslation();
  const toast = useToast();
  const [codeCompetition, onChangeTextCodeComp] = useState();
  const tableFlexColumn = [1, 1, 1, 1, 0.5];
  var tableState = {
    flexColumn: tableFlexColumn,
    headerTitles: [
      t('common:date'),
      t('common:discipline'),
      t('common:competition'),
      t('common:status'),
      t('common:action'),
    ],
    sumFlexValue: tableFlexColumn.reduce((partialSum, a) => partialSum + a, 0),
    columnCount: tableFlexColumn,
    maxWidth: Dimensions.get('window').width - 20, //padding left/right
    data: [],
    columnType: ['text', 'text', 'text', 'text', 'button'],
  };

  const validateCompetitionCode = () => {
    if (codeCompetition != null)
      toast.show('TODO: récupérer à partir WebService', {
        type: 'warning',
        placement: 'top',
      });
    else
      toast.show(t('common:competitionSheetempty'), {
        type: 'danger',
        placement: 'top',
      });
  };

  const getAllCompetitions = async () => {
    const keys = await getAllKeys();
    keys.forEach(async value => {
      await setOneRowTableData(value);
    });
  };

  const getAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (e) {
      console.error(e);
    }
  };

  const getOneFile = async key => {
    try {
      const item = await AsyncStorage.getItem(key);
      return item;
    } catch (e) {
      console.error(e);
    }
  };

  const saveFile = async (fileName, content) => {
    try {
      const contentFile = await getOneFile(fileName);
      if (contentFile != null) {
        toast.show('Fichier déjà existant', {
          type: 'warning',
          placement: 'top',
        });
      } else {
        await AsyncStorage.setItem(fileName, contentFile);
        toast.show('Fichier récupéré', {
          type: 'success',
          placement: 'top',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const readFile = async newFile => {
    var RNFS = require('react-native-fs');
    try {
      if (newFile != null) {
        if (newFile.type == 'application/json') {
          await RNFS.readFile(newFile.uri.toString())
            .then(content => {
              saveFile(newFile.name, content);
            })
            .catch(e => {
              toast.show("Erreur d'import", {
                type: 'danger',
                placement: 'top',
              });
            });
        } else {
          toast.show('Le fichier doit être au format JSON', {
            type: 'warning',
            placement: 'top',
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  async function pickOneDeviceFile() {
    try {
      const newFile = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });
      readFile(newFile);
    } catch (e) {
      console.error(e);
      if (DocumentPicker.isCancel(e)) {
        toast.show('Récupération du fichier annulée', {
          type: 'warning',
          placement: 'top',
        });
      }
    }
  }

  const setOneRowTableData = async key => {
    // Vérification de la clé (nom de fichier.json)
    if (key.match(/.+\.json/g)) {
      const serie = JSON.parse(await getOneFile(key));
      if (serie !== null) {
        const rowSeries = [];
        // Date épreuve
        rowSeries.push(
          serieJSON.EpreuveConcoursComplet.TourConcoursComplet
            .SerieConcoursComplet.DateHeureSerie,
        );
        // Nom épreuve
        rowData.push(
          'Nom épreuve - ' +
            serieJSON.EpreuveConcoursComplet.TourConcoursComplet
              .SerieConcoursComplet.Libelle +
            ' \\ ' +
            serieJSON.EpreuveConcoursComplet.Categorie +
            serieJSON.EpreuveConcoursComplet.Sexe,
        );
        // Nom compétition
        rowData.push(serieJSON.NomCompetition);
        // Status épreuve
        rowData.push('Concours futur');
        // Action
        rowData.push(
          'Editer',
          /*<Image source={R.images.logo_ffa} style={{width: 10, height: 10}} />,*/
        );
        // Ajout de la ligne dans tableState
        tableState.data.push(rowData);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Ouvrir les concours d'une compétition */}
        <Text style={styles.titleText}>
          {t('common:open_competion_sheets')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>{t('common:competition_code')} :</Text>
          <TextInput
            style={styles.textinput}
            onChangeText={onChangeTextCodeComp}
            placeholder="1234567"
            placeholderTextColor={R.colors.muted}
            value={codeCompetition}
          />
          <TouchableWithoutFeedback onPress={validateCompetitionCode}>
            <View style={styles.button}>
              <Text>{t('common:validate')}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => pickOneDeviceFile()}>
            <View style={styles.button}>
              <Text>{t('common:via_local_file')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {/* Listes des concours */}
        <Text style={styles.titleText}>
          {t('common:list_competion_sheets')}
        </Text>
        {tableState.data.length > 0 ? (
          <DataTable tableState={tableState} />
        ) : (
          <Text style={styles.text}>
            {t('common:no_imported_competitions') + '...'}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: R.colors.white,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: R.colors.ffa_blue_light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: R.colors.ffa_blue_light,
    marginVertical: 15,
  },
  text: {
    color: R.colors.ffa_blue_light,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  textinput: {
    borderWidth: 1,
    paddingStart: 10,
    width: 200,
    color: R.colors.black,
    borderColor: R.colors.black,
    borderRadius: 5,
  },
});

export default HomeScreen;
