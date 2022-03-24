import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Table, Row, Cell, TableWrapper} from 'react-native-table-component';
import {colors} from '_config';
import {removeFile} from '../../utils/myasyncstorage';

const TableHome = props => {
  const [t] = useTranslation();
  const [competitionName, setCompetitionName] = useState();
  const [competitionDate, setCompetitionDate] = useState();

  // Configuration du tableau Liste des concours
  var tableState = {
    minWidthColumn: [
      160,
      200,
      Dimensions.get('window').width - (620 + 20 + 10),
      100,
      160,
    ],
    headerTitles: [
      t('common:date'),
      t('common:discipline'),
      '',
      t('common:status'),
      t('common:action'),
    ],
    maxWidth: Dimensions.get('window').width - 20, //20 : padding left/right
    columnType: ['text', 'text', 'text', 'textStatutConcours', 'actionHome'],
  };

  function componentTable(index, data, type) {
    code = '';
    switch (type) {
      case 'actionHome':
        code = (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('CompetitionSheet', {
                  competitionData: props.tableData[index],
                });
              }}>
              <View style={styles.cell}>
                <Text style={styles.cellButton}>{data[0]}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                Alert.alert(
                  'Voulez-vous supprimer ce concours?',
                  JSON.parse(props.tableData[index][1]).NomCompetition,
                  [
                    {
                      text: 'Annuler',
                    },
                    {
                      text: 'OK',
                      onPress: async () => {
                        try {
                          await removeFile(props.tableData[index][0]);
                          props.setTableData(
                            props.tableData.filter(
                              (item, itemIndex) => index !== itemIndex,
                            ),
                          );
                          props.showMessage({
                            message: t('toast:file_deleted'),
                            type: 'success',
                          });
                        } catch (e) {
                          console.error(e);
                        }
                      },
                    },
                  ],
                );
              }}>
              <View style={styles.cell}>
                <Text style={[styles.cellButton, styles.backRed]}>
                  {data[1]}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        );
        break;
      case 'text':
        code = (
          <View style={styles.cell}>
            <Text style={styles.cellText}>{data}</Text>
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
    <>
      <View style={styles.containerCenter}>
        <Text style={styles.titleText}>
          {t('common:list_competion_sheets')}
        </Text>

        {props.tableData.length > 0 ? (
          <ScrollView>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  paddingVertical: 15,
                }}>
                {/* <Text style={styles.textHeaderTable}>Filtres : </Text>
                <View style={styles.dropdown}>
                <Picker
                selectedValue={competitionDate}
                dropdownIconColor={colors.black}
                onValueChange={value => {
                    setCompetitionDate(value);
                }}
                mode="dropdown">
                {tableData.map((rowData, index) => {
                    return (
                        <></>
                        // <Picker.Item
                        //   style={styles.dropdownItem}
                        //   label={rowData.DateHeureSerie}
                        //   value={rowData.DateHeureSerie}
                        // />
                        );
                    })}
                    </Picker>
                </View> */}
              </View>
              <Text style={[styles.textHeaderTable, {textAlign: 'center'}]}>
                {competitionName}
              </Text>
              <Table style={styles.headerTable}>
                <Row
                  data={tableState.headerTitles}
                  textStyle={styles.textHeaderTable}
                  widthArr={tableState.minWidthColumn}
                  //flexArr={tableState.flexColumn}
                />
              </Table>
              <ScrollView>
                <Table>
                  {props.tableData.map((rowData, index) => {
                    return (
                      <TableWrapper key={index} style={styles.row}>
                        {rowData
                          .filter(
                            (cellData, cellIndex) =>
                              cellIndex != 0 && cellIndex != 1,
                          )
                          .map((cellData, cellIndex) => (
                            <Cell
                              key={cellIndex}
                              width={tableState.minWidthColumn[cellIndex]}
                              /*width={
                                      (tableState.maxWidth *
                                        tableState.flexColumn[cellIndex]) /
                                        tableState.sumFlexValue
                                    }*/
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
          </ScrollView>
        ) : (
          <Text style={styles.text}>
            {t('common:no_imported_competitions') + '...'}
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 5,
  },
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
  },
  text: {
    color: colors.ffa_blue_light,
    fontSize: 14,
    paddingHorizontal: 10,
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
    borderColor: colors.ffa_blue_light,
  },
  iconButton: {width: 30, height: 30},
  textButton: {
    color: colors.white,
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

export default TableHome;
