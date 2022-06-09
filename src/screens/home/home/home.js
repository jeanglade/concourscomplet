import React, {useEffect, useState} from 'react';
import i18n from 'i18next';
import moment from 'moment';
import {SafeAreaView, View, Text} from 'react-native';
import {
  getAllKeys,
  getFile,
  getFiles,
  setFile,
} from '../../utils/myAsyncStorage';
import {
  OpenJson,
  TableCompetition,
  ModalOpenJson,
  ModalChoiceCompetition,
} from '_screens';
import {styleSheet} from '_config';
import {
  setConcoursStatus,
  convertEpreuveToImage,
} from '../../../utils/convertor';

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

  async function refreshData(tab, idComp = null) {
    const competitions = getAllCompetitionsInfo(tab);
    setTableData(tab);
    setAllCompetitions(competitions);
    setCompetition(
      idComp === null
        ? getLastCompetition(competitions)
        : competitions.find(c => c?.idCompetition === idComp),
    );
  }

  // Ajoute plusieurs concours
  const addSeriesDataTable = async keys => {
    var res = null;
    if (keys.length > 0) {
      // Récupère les clés/valeurs des concours non chargés
      const listKeyValue = await getFiles(keys);
      if (listKeyValue.length > 0) {
        res = [];
        listKeyValue.forEach(keyValue => res.push(keyValue[1]));
        res.sort((a, b) =>
          JSON.parse(a)._?.date > JSON.parse(b)._?.date ? 1 : -1,
        );
      }
    }
    return res;
  };

  const getAllCompetitionsInfo = tab => {
    var result = [];
    tab.forEach(compete => {
      // Si la compétition n'est pas déjà présente dans result
      if (
        !result
          .map(x => x.idCompetition)
          .includes(JSON.parse(compete)?.GuidCompetition)
      ) {
        result.push(getCompetitionInfo(compete));
      }
    });
    return result;
  };

  // Ajoute 1 concours //data is stringify
  const addOneSerieDataTable = async (key, data = null) => {
    var tab = tableData;
    if (key.match(/.+\.json/g)) {
      if (data === null) {
        data = await getFile(key);
      }

      //Met à jour les données des concours en triant par ordre croissant par date
      getInfoSerie(key, data).then(infos => {
        var element = tab.find(row => JSON.parse(row)._.id === key);
        if (element !== undefined) {
          element = infos;
        } else {
          tab.push(infos);
        }
        tab.sort((a, b) => {
          return JSON.parse(a)._?.date > JSON.parse(b)._?.date ? 1 : -1;
        });
        refreshData(tab, JSON.parse(infos)?.GuidCompetition);
      });
    }
  };

  const getJsonValue = (jsonKey, jsonDefaultValue = '') => {
    return jsonKey ? jsonKey : jsonDefaultValue;
  };

  const getInfoSerie = async (key, data) => {
    try {
      var concoursData = JSON.parse(data);
      const dateConcours = getJsonValue(
        concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
          ?.LstSerieConcoursComplet[0]?.DateHeureSerie,
        concoursData?.DateDebutCompetition,
      );
      const epreuve =
        getJsonValue(concoursData?.EpreuveConcoursComplet?.Nom) +
        ' ' +
        getJsonValue(concoursData?.EpreuveConcoursComplet?.Categorie) +
        getJsonValue(concoursData?.EpreuveConcoursComplet?.Sexe) +
        ' / ' +
        getJsonValue(
          concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
            ?.LstSerieConcoursComplet[0]?.Libelle,
        );
      concoursData._ = {
        id: key,
        date: dateConcours,
        dateInfo: moment(dateConcours?.toString(), moment.ISO_8601).format(
          i18n.language === 'fr' ? 'DD/MM/YYYY - HH:mm' : 'MM/DD/YYYY - HH:mm',
        ),
        epreuve: epreuve,
        imageEpreuve: convertEpreuveToImage(epreuve),
        statut: '',
        statutColor: '',
        type: getJsonValue(
          concoursData?.EpreuveConcoursComplet?.CodeFamilleEpreuve,
        ),
        nbAthlete: getJsonValue(
          concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
            ?.LstSerieConcoursComplet[0]?.LstResultats,
        ).length,
        nbTries: 6,
        colPerfVisible: true,
        colFlagVisible: false,
        fieldWindVisible: true,
        fieldPerfVisible: true,
        colMiddleRankVisible: true,
      };
      //TODO gérer le status si le concours arrive déjà rempli
      concoursData = setConcoursStatus(concoursData, i18n.t('common:ready'));
      await setFile(key, JSON.stringify(concoursData));
      return JSON.stringify(concoursData);
    } catch (e) {
      console.error(e);
    }
  };

  // Récupère la compétition la plus récente à partir de maintenant
  const getLastCompetition = competitions => {
    var result = null;
    if (competitions.length > 0) {
      competitions.sort((a, b) => {
        a?.dateCompetition > b?.dateCompetition;
      });
      result = competitions[0];
      const recentC = competitions.filter(a => {
        a?.dateCompetition > moment();
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
      idCompetition: getJsonValue(compete?.GuidCompetition),
      /*idEpreuve:
        compete.EpreuveConcoursComplet.TourConcoursComplet
          .LstSerieConcoursComplet[0].GuidSerie,*/
      dateCompetition: getJsonValue(compete?.DateDebutCompetition),
      /*dateEpreuve:
        compete.EpreuveConcoursComplet.TourConcoursComplet
          .LstSerieConcoursComplet[0].DateHeureSerie,*/
      nomCompetition: getJsonValue(compete?.NomCompetition),
      lieuCompetition: getJsonValue(
        compete?.Stade?.toString(),
        compete?.Lieu?.toString(),
      ),
      competitionInfo:
        moment(
          getJsonValue(compete?.DateDebutCompetition?.toString()),
          moment.ISO_8601,
        ).format(i18n.language === 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY') +
        ' - ' +
        compete?.NomCompetition,
    };
  };

  const setChoiceCompetition = comp => {
    if (comp !== null && JSON.stringify(comp) !== JSON.stringify({})) {
      if (comp?.idCompetition !== undefined) {
        if (comp?.idCompetition !== competition?.idCompetition?.toString()) {
          refreshData(tableData, comp.idCompetition);
        }
      }
    }
  };

  return (
    <SafeAreaView
      style={[styleSheet.flex1, styleSheet.backWhite, {padding: 10}]}>
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

export default Home;
