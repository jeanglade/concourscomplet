import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import i18n from 'i18next';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {colors} from '_config';
import {OpenJson, TableHome} from '_components';

import {getAllKeys, getFile, getFiles} from '../../utils/myasyncstorage';

const Home = props => {
  const [tableData, setTableData] = useState([]);

  // Chargement des concours existants
  const getAllSeries = async () => {
    const keys = await getAllKeys();
    await addSeriesDataTable(keys.filter(key => key.match(/.+\.json/g)));
  };
  useEffect(() => {
    getAllSeries();
  }, []);

  const addSeriesDataTable = async keys => {
    if (keys.length > 0) {
      const listKeyValue = await getFiles(
        keys.filter(
          key => tableData.filter(row => row.id === key).length === 0,
        ),
      );
      listKeyValue.forEach(keyValue => {
        setTableData(tableData => [
          ...tableData,
          getInfoSerie(keyValue[0], keyValue[1]),
        ]);
      });
    }
  };

  const addOneSerieDataTable = async (key, data = null) => {
    if (key.match(/.+\.json/g)) {
      if (tableData.filter(row => row.id == key).length === 0) {
        if (data == null) data = await getFile(key);
        setTableData(tableData => [...tableData, getInfoSerie(key, data)]);
      }
    }
  };

  const getInfoSerie = (key, data) => {
    const infoConcours = JSON.parse(data);
    const dateConcours =
      infoConcours.EpreuveConcoursComplet.TourConcoursComplet.SerieConcoursComplet.DateHeureSerie.toString();
    return {
      id: key,
      data: data,
      date:
        moment(dateConcours, moment.ISO_8601).format(
          i18n.language == 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
        ) +
        ' - ' +
        moment(dateConcours, moment.ISO_8601).format('h:mm'),
      epreuve:
        infoConcours.EpreuveConcoursComplet.Nom +
        ' - ' +
        infoConcours.EpreuveConcoursComplet.TourConcoursComplet
          .SerieConcoursComplet.Libelle +
        ' \\ ' +
        infoConcours.EpreuveConcoursComplet.Categorie +
        infoConcours.EpreuveConcoursComplet.Sexe,
      statut: 'A venir',
    };
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <OpenJson
        addOneSerieDataTable={addOneSerieDataTable}
        showMessage={showMessage}
      />
      <TableHome
        showMessage={showMessage}
        tableData={tableData}
        setTableData={setTableData}
        navigation={props.navigation}
      />
    </SafeAreaView>
  );
};

export default Home;
