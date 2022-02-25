import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useToast} from 'react-native-toast-notifications';

import R from '../assets/R';

function CompetitionSheetScreen(props) {
  const [t] = useTranslation();
  const toast = useToast();

  const competitionDataTable = props.route.params.competitionData;
  const competitionKey = competitionDataTable[0];
  const competitionData = JSON.parse(competitionDataTable[1]);
  const competitionDate = competitionDataTable[2];
  const competitionName = competitionDataTable[3];
  const listAthlete =
    competitionData.EpreuveConcoursComplet.TourConcoursComplet
      .SerieConcoursComplet.LstResultats;

  const [tableData, setTableData] = useState([]);

  // Chargement des concours existants
  const getAllAthletes = () => {
    listAthlete.forEach(element => {
      const row = [];
      row.push(
        '',
        '',
        element.NumCouloir,
        element.NumCouloir,
        element.Athlete.Prenom +
          ' ' +
          element.Athlete.Nom +
          '\n' +
          element.Athlete.Club +
          ' - ' +
          element.Athlete.Categorie,
        '',
        '',
      );
      setTableData(tableData => [...tableData, row]);
    });
  };
  useEffect(() => {
    getAllAthletes();
  }, []);

  // Configuration du tableau Liste des concours
  const tableFlexColumn = [1, 1, 1, 1, 1, 1, 1];
  var tableState = {
    flexColumn: tableFlexColumn,
    widthColumn: [0.0, 0.0, 20.0, 20.0, 50.0, 20.0, 20.0],
    headerTitles: [
      t('competition:order'),
      t('competition:number'),
      t('competition:athlete'),
      t('competition:performance'),
      t('competition:place'),
    ],
    sumFlexValue: tableFlexColumn.reduce((partialSum, a) => partialSum + a, 0),
    maxWidth: Dimensions.get('window').width - 20, //padding left/right
    columnType: ['text', 'text', 'textAthlete', 'text', 'text'],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titleText}>
          {competitionName} - {competitionDate}
        </Text>
        <Text style={styles.text}>
          {competitionData.NomCompetition.toString() +
            '- Heure de début : - Heure de fin : '}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: R.colors.white,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: R.colors.ffa_blue_light,
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    color: R.colors.black,
  },
});

export default CompetitionSheetScreen;
