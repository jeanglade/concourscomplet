import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import i18n from 'i18next';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {colors} from '_config';
import {OpenJson, TableHome} from '_components';

import {getAllKeys, getFile, getFiles} from '../../utils/myasyncstorage';

const Home = () => {
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
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
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

export default Home;
