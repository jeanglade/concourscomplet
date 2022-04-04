import React, {useEffect, useState} from 'react';
import i18n from 'i18next';
import moment from 'moment';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import {getAllKeys, getFile, getFiles} from '../../utils/myAsyncStorage';
import {
  OpenJson,
  TableCompetition,
  ModalOpenJson,
  ModalChoiceCompetition,
} from '_homeComponents';
import {colors} from '_config';

const Home = props => {
  //Tableau avec toutes les données concours complet
  const [tableData, setTableData] = useState([]);
  //Information de la compétition des concours affichés
  const [competition, setCompetition] = useState({});
  //Liste des compétitions
  const [allCompetitions, setAllCompetitions] = useState([]);

  // Chargement des concours existants
  const getAllSeries = async tab => {
    const keys = await getAllKeys();
    const series = await addSeriesDataTable(
      keys.filter(key => key.match(/.+\.json/g)),
      tab,
    );
    return series;
  };

  async function refreshData(tab, comp = null) {
    const competitions = getAllCompetitionsInfo(tab);
    setTableData(tab);
    setAllCompetitions(competitions);
    setCompetition(comp == null ? getLastCompetition(competitions) : comp);
  }

  function initData() {
    const tab = tableData;
    getAllSeries(tab).then(tabSeries => {
      if (tabSeries != null) {
        refreshData(tabSeries);
      }
    });
  }

  // Initialise la liste des concours complets déjà présents
  useEffect(() => {
    initData();
  }, []);

  // Ajoute plusieurs concours
  const addSeriesDataTable = async (keys, tab) => {
    var res = [];
    if (keys.length > 0) {
      // Récupère les clés/valeurs des concours non chargés
      const listKeyValue = await getFiles(
        keys.filter(key => tab.find(x => x.id === key) === undefined),
      );
      listKeyValue.forEach(keyValue => {
        res.push(getInfoSerie(keyValue[0], keyValue[1]));
      });
      return res.sort((a, b) => {
        return a.date > b.date;
      });
    }
  };

  const getAllCompetitionsInfo = tab => {
    var result = [];
    tab.forEach(compete => {
      // Si la compétition n'est pas déjà présente dans result
      if (
        !result
          .map(a => a.idCompetition)
          .includes(JSON.parse(compete.data).GuidCompetition)
      ) {
        result.push(getCompetitionInfo(compete.data));
      }
    });
    return result;
  };

  // Ajoute 1 concours
  const addOneSerieDataTable = async (key, data = null) => {
    var tab = tableData;
    if (key.match(/.+\.json/g)) {
      if (tableData.filter(row => row.id === key).length === 0) {
        if (data == null) {
          data = await getFile(key);
        }
        //Met à jour les données des concours en triant par ordre croissant par date
        tab.push(getInfoSerie(key, data));
        tab.sort((a, b) => {
          return a.date > b.date;
        });
        refreshData(tab);
      }
    }
  };

  const getInfoSerie = (key, data) => {
    const infoConcours = JSON.parse(data);
    const dateConcours =
      infoConcours.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].DateHeureSerie.toString();
    return {
      id: key,
      data: data,
      date: dateConcours,
      dateInfo:
        moment(dateConcours, moment.ISO_8601).format(
          i18n.language === 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
        ) +
        ' - ' +
        moment(dateConcours, moment.ISO_8601).format('H:mm'),
      epreuve:
        infoConcours.EpreuveConcoursComplet.Nom +
        ' ' +
        infoConcours.EpreuveConcoursComplet.Categorie +
        infoConcours.EpreuveConcoursComplet.Sexe +
        ' / ' +
        infoConcours.EpreuveConcoursComplet.TourConcoursComplet
          .LstSerieConcoursComplet[0].Libelle,
      statut: i18n.t('common:in_progress'),
    };
  };

  // Récupère la compétition la plus récente à partir de maintenant
  const getLastCompetition = competitions => {
    var result = null;
    if (competitions.length > 0) {
      competitions.sort((a, b) => {
        a.dateCompetition > b.dateCompetition;
      });
      result = competitions[0];
      const recentC = competitions.filter(a => {
        a.dateCompetition > moment();
      });
      if (recentC.length > 0) {
        result = recentC[0];
      }
    }
    return result;
  };

  const getCompetitionInfo = compete => {
    compete = JSON.parse(compete);
    return {
      idCompetition: compete.GuidCompetition,
      /*idEpreuve:
        compete.EpreuveConcoursComplet.TourConcoursComplet
          .LstSerieConcoursComplet[0].GuidSerie,*/
      dateCompetition: compete.DateDebutCompetition,
      /*dateEpreuve:
        compete.EpreuveConcoursComplet.TourConcoursComplet
          .LstSerieConcoursComplet[0].DateHeureSerie,*/
      nomCompetition: compete.NomCompetition?.toString(),
      lieuCompetition:
        compete.Stade?.toString() != null
          ? compete.Stade?.toString()
          : compete.Lieu?.toString(),
      competitionInfo:
        moment(
          compete.DateDebutCompetition?.toString(),
          moment.ISO_8601,
        ).format(i18n.language === 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY') +
        ' - ' +
        compete.NomCompetition,
    };
  };

  const setChoiceCompetition = comp => {
    if (comp !== null && JSON.stringify(comp) !== JSON.stringify({})) {
      if (comp.idCompetition !== undefined) {
        if (comp.idCompetition !== competition?.idCompetition?.toString()) {
          refreshData(tableData, comp);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {tableData.length === 0 && (
        <OpenJson addOneSerieDataTable={addOneSerieDataTable} />
      )}
      {tableData.length > 0 && (
        <>
          <View style={{flexDirection: 'row-reverse'}}>
            <ModalOpenJson addOneSerieDataTable={addOneSerieDataTable} />
            {/* S il y a plusieurs competitions */}
            {allCompetitions.length > 1 && (
              <ModalChoiceCompetition
                competition={competition}
                setChoiceCompetition={setChoiceCompetition}
                allCompetitions={allCompetitions}
              />
            )}
          </View>
          <TableCompetition
            tableData={tableData}
            setTableData={setTableData}
            navigation={props.navigation}
            competition={competition}
            allCompetitions={allCompetitions}
            setCompetition={setCompetition}
            refreshData={refreshData}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
});

export default Home;
