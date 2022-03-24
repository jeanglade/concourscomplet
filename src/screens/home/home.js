import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import i18n from 'i18next';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {Table, Row, Cell, TableWrapper} from 'react-native-table-component';
import {Picker} from '@react-native-picker/picker';
import {showMessage} from 'react-native-flash-message';
import {colors} from '_config';
import {OpenJson, TableHome} from '_components';

import {
  getAllKeys,
  getFile,
  getFiles,
  removeFile,
} from '../../utils/myasyncstorage';

const Home = props => {
  // Initialisation des variables
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [codeCompetition, setCodeCompetition] = useState(null);

  // Chargement des concours existants
  const getAllSeries = async () => {
    const keys = await getAllKeys();
    await addSeriesDataTable(keys.filter(key => key.match(/.+\.json/g)));
  };

  useEffect(() => {
    getAllSeries();
  }, []);

  const getInfoSerie = serie => {
    const formatDate = i18n.language == 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
    const infoConcours = JSON.parse(serie[1]);
    const statutConcours = 'A venir';
    /*setCompetitionName(
      infoConcours.NomCompetition + ' - ' + infoConcours.Stade,
    );*/
    const dateConcours = moment(
      infoConcours.EpreuveConcoursComplet.TourConcoursComplet.SerieConcoursComplet.DateHeureSerie.toString(),
      moment.ISO_8601,
    ).format(formatDate);
    const heureConcours = moment(
      infoConcours.EpreuveConcoursComplet.TourConcoursComplet.SerieConcoursComplet.DateHeureSerie.toString(),
      moment.ISO_8601,
    ).format('h:mm');
    /*setCompetitionDate(dateConcours);*/
    // serie contient déjà la clé (nom du fichier json) et son contenu
    serie.push(
      // Date épreuve
      dateConcours + ' - ' + heureConcours,
      // Nom épreuve
      infoConcours.EpreuveConcoursComplet.Nom +
        ' - ' +
        infoConcours.EpreuveConcoursComplet.TourConcoursComplet
          .SerieConcoursComplet.Libelle +
        ' \\ ' +
        infoConcours.EpreuveConcoursComplet.Categorie +
        infoConcours.EpreuveConcoursComplet.Sexe,
      '',
      // Nom compétition
      //infoConcours.NomCompetition + '\n' + infoConcours.Stade,
      // Status épreuve
      statutConcours,
      // Action
      ['Editer', 'Supprimer'],
      /*<Image source={images.logo_ffa} style={{width: 10, height: 10}} />,*/
    );
    return serie;
  };

  const addSeriesDataTable = async keys => {
    if (keys.length > 0) {
      const listKeyValue = await getFiles(
        keys.filter(
          key =>
            // Vérification que la série n'existe pas dans le tableau
            tableData.filter(row => row[0] === key).length === 0,
        ),
      );
      listKeyValue.forEach(keyValue => {
        setTableData(tableData => [...tableData, getInfoSerie(keyValue)]);
      });
    }
  };

  const addOneSerieDataTable = async (key, data = null) => {
    // Vérification de la clé (nom de fichier .json)
    if (key.match(/.+\.json/g)) {
      // Vérification que la série n'existe pas dans le tableau
      if (tableData.filter(row => row[0] == key).length == 0) {
        if (data == null) data = await getFile(key);
        setTableData(tableData => [...tableData, getInfoSerie([key, data])]);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <OpenJson
        addOneSerieDataTable={addOneSerieDataTable}
        showMessage={showMessage}
        codeCompetition={codeCompetition}
        setCodeCompetition={setCodeCompetition}
      />
      <TableHome
        showMessage={showMessage}
        tableData={tableData}
        setTableData={setTableData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 10,
  },
  dividerLeft: {
    borderColor: colors.muted,
    borderLeftWidth: 1,
    borderWidth: 0,
  },
  buttonClassic: {
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_dark,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: colors.ffa_blue_light_2,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_dark,
    padding: 20,
    marginHorizontal: 15,
    borderWidth: 2,
    borderColor: colors.ffa_blue_light_2,
  },
  iconButton: {width: 30, height: 30},
  textButton: {
    color: colors.white,
  },
  titleText: {
    fontSize: 18,
    color: colors.ffa_blue_light,
    margin: 15,
  },
  text: {
    color: colors.ffa_blue_light,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  textinput: {
    fontSize: 16,
    padding: 10,
    width: 130,
    color: colors.black,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
  },
  headerTable: {
    width: Dimensions.get('window').width - 20,
    paddingBottom: 10,
    paddingStart: 10,
  },
  textHeaderTable: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    paddingVertical: 10,
    marginBottom: 5,
    backgroundColor: '#E7E6E1',
    width: Dimensions.get('window').width - 20,
    flexDirection: 'row',
    maxHeight: 100,
  },
  cellText: {color: colors.black, fontSize: 16},
  cellButton: {
    backgroundColor: colors.ffa_blue_light,
    color: colors.white,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  backRed: {
    backgroundColor: colors.red,
  },
  cellTextInput: {
    borderWidth: 1,
    color: colors.black,
    fontSize: 16,
    borderColor: colors.black,
  },
  cell: {paddingHorizontal: 10},
  dropdown: {
    fontSize: 14,
    width: 200,
    color: colors.black,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
  },
  dropdownItem: {
    color: colors.black,
    backgroundColor: colors.white,
  },
});

export default Home;
