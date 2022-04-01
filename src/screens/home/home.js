import React, {useEffect, useState} from 'react';
import i18n from 'i18next';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {colors} from '_config';
import {OpenJson, TableCompetition, ModalOpenJson} from '_components';
import {SafeAreaView, StyleSheet} from 'react-native';
import {getAllKeys, getFile, getFiles} from '../../utils/myAsyncStorage';
import {useTranslation} from 'react-i18next';

const Home = props => {
  const [t] = useTranslation();
  //Tableau avec toutes les données concours complet
  const [tableData, setTableData] = useState([]);
  //Information de la compétition des concours affichés
  const [competition, setCompetition] = useState({});
  //Liste des compétitions
  const [allCompetitions, setAllCompetitions] = useState([]);

  // Chargement des concours existants
  const getAllSeries = async () => {
    const keys = await getAllKeys();
    await addSeriesDataTable(keys.filter(key => key.match(/.+\.json/g)));
  };

  // Initialise la liste des concours complets déjà présents
  useEffect(() => {
    getAllSeries();
    var competitions = getAllCompetitionsInfo();
    setAllCompetitions(competitions);
    setCompetition(getLastCompetition(competitions));
  }, []);

  // Ajoute plusieurs concours
  const addSeriesDataTable = async keys => {
    if (keys.length > 0) {
      // Récupère les clés/valeurs des concours non chargés
      const listKeyValue = await getFiles(
        keys.filter(key => tableData.find(x => x.id === key) === undefined),
      );
      listKeyValue.forEach(keyValue => {
        //Met à jour les données des concours en triant par ordre croissant par date
        setTableData(() =>
          [...tableData, getInfoSerie(keyValue[0], keyValue[1])].sort(
            (a, b) => {
              return a.date > b.date;
            },
          ),
        );
      });
    }
  };

  const getAllCompetitionsInfo = () => {
    var result = [];
    tableData.forEach(compete => {
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
    if (key.match(/.+\.json/g)) {
      if (tableData.filter(row => row.id === key).length === 0) {
        if (data == null) {
          data = await getFile(key);
        }
        //Met à jour les données des concours en triant par ordre croissant par date
        setTableData(() =>
          [...tableData, getInfoSerie(key, data)].sort((a, b) => {
            return a.date > b.date;
          }),
        );
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
      statut: t('common:in_progress'),
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

  return (
    <SafeAreaView style={styles.container}>
      {tableData.length === 0 && (
        <OpenJson
          addOneSerieDataTable={addOneSerieDataTable}
          showMessage={showMessage}
        />
      )}
      {tableData.length > 0 && (
        <>
          <ModalOpenJson
            addOneSerieDataTable={addOneSerieDataTable}
            showMessage={showMessage}
          />
          <TableCompetition
            showMessage={showMessage}
            tableData={tableData}
            setTableData={setTableData}
            navigation={props.navigation}
            competition={competition}
            allCompetitions={allCompetitions}
            setCompetition={setCompetition}
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
