import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useToast} from 'react-native-toast-notifications';
import {Table, Row, Cell, TableWrapper} from 'react-native-table-component';
import {colors} from '_config';
//import AddAnAthleteModal from './AddAnAthleteModal';

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
      .LstSerieConcoursComplet[0].LstResultats;

  const [tableData, setTableData] = useState([]);
  const [addAnAthleteVisible, setAddAnAthleteVisible] = useState(false);

  // Chargement des concours existants
  const getAllAthletes = () => {
    listAthlete
      .filter(
        element =>
          tableData.filter(row => row[0] == element.NumCouloir).length == 0,
      )
      .forEach(element => {
        const row = [];
        row.push(
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
  var tableState = {
    maxWidthColumn: [70, 80, 200, Dimensions.get('window').width - 510, 70, 70],
    headerTitles: [
      t('competition:order'),
      t('competition:number'),
      t('competition:athlete'),
      '',
      t('competition:performance').substring(0, 4) + '.',
      t('competition:place'),
    ],
    columnType: [
      'textCenter',
      'textCenter',
      'textAthlete',
      'text',
      'text',
      'text',
    ],
  };

  function componentTable(index, data, type) {
    code = '';
    switch (type) {
      case 'button':
        code = (
          <TouchableWithoutFeedback>
            <View style={styles.cell}>
              <Text style={styles.cellButton}>{data}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
        break;
      case 'text':
        code = (
          <View style={styles.cell}>
            <Text style={styles.cellText}>{data}</Text>
          </View>
        );
        break;
      case 'textCenter':
        code = (
          <View style={styles.cell}>
            <Text
              style={{
                color: colors.black,
                fontSize: 16,
                textAlign: 'center',
              }}>
              {data}
            </Text>
          </View>
        );
        break;
      case 'textAthlete':
        code = (
          <View style={styles.cell}>
            <Text
              style={{color: colors.black, fontSize: 16, fontWeight: 'bold'}}
              numberOfLines={1}>
              {data.split('\n')[0]}
            </Text>
            <Text style={{color: colors.black, fontSize: 16}} numberOfLines={1}>
              {data.split('\n')[1]}
            </Text>
          </View>
        );
        break;
      case 'textInput':
        code = (
          <View style={styles.cell}>
            <TextInput style={styles.cellTextInput} value={data} />
          </View>
        );
        break;
      case 'textStatutConcours':
        const colorText = colors.ffa_blue_dark;
        code = (
          <View style={styles.cell}>
            <Text style={{color: colorText, fontWeight: 'bold', fontSize: 16}}>
              {data}
            </Text>
          </View>
        );
        break;
    }
    return code;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{paddingBottom: 30}}>
          <Text style={styles.titleText}>
            {competitionName} - {competitionDate}
          </Text>
          <Text style={styles.text}>
            {competitionData.NomCompetition.toString() +
              '- Heure de début : - Heure de fin : '}
          </Text>
        </View>

        <View>
          <Table style={styles.headerTable}>
            <Row
              data={tableState.headerTitles}
              textStyle={styles.textHeaderTable}
              widthArr={tableState.maxWidthColumn}
            />
          </Table>
          <ScrollView>
            <Table>
              {tableData.map((rowData, index) => {
                return (
                  <TableWrapper key={index} style={styles.row}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        width={
                          cellIndex == 3
                            ? Dimensions.get('window').width - 510
                            : tableState.maxWidthColumn[cellIndex]
                        }
                        data={componentTable(
                          index,
                          cellData,
                          tableState.columnType[cellIndex],
                        )}
                      />
                    ))}
                  </TableWrapper>
                );
              })}
            </Table>
          </ScrollView>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <Text style={styles.titleText}>{t('common:options')} : </Text>
          <TouchableWithoutFeedback
            onPress={() => setAddAnAthleteVisible(true)}>
            <Text style={styles.button}>{t('competition:add_an_athlete')}</Text>
          </TouchableWithoutFeedback>
          <AddAnAthleteModal
            modalVisible={addAnAthleteVisible}
            setModalVisible={setAddAnAthleteVisible}
            toast={toast}
            setAthletesData={setTableData}
            athletesData={tableData}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.ffa_blue_light,
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    color: colors.black,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 5,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  headerTable: {
    width: Dimensions.get('window').width - 20,
    paddingBottom: 10,
  },
  textHeaderTable: {
    color: colors.ffa_blue_light,
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  row: {
    paddingVertical: 10,
    marginBottom: 5,
    backgroundColor: '#E7E6E1',
    width: Dimensions.get('window').width - 20,
    flexDirection: 'row',
    borderRadius: 5,
    maxHeight: 100,
  },
  cellText: {color: colors.black, fontSize: 16},
  cellTextCenter: {color: colors.black, fontSize: 16, textAlign: 'center'},
  cellButton: {
    backgroundColor: colors.ffa_blue_light,
    color: colors.white,
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  cellTextInput: {
    borderWidth: 1,
    color: colors.black,
    fontSize: 16,
    borderColor: colors.black,
    borderRadius: 5,
  },
  cell: {paddingHorizontal: 10},
});

export default CompetitionSheetScreen;
