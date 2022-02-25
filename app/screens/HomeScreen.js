import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import i18n from 'i18next';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useToast} from 'react-native-toast-notifications';
import ReactNativeBlobUtil from 'react-native-blob-util';
import DocumentPicker from 'react-native-document-picker';
import {Table, Row, Cell, TableWrapper} from 'react-native-table-component';

import R from '../assets/R';
import {
  getAllKeys,
  getFile,
  getFiles,
  setFile,
  removeFile,
} from '../api/MyAsyncStorage';

const HomeScreen = props => {
  // Initialisation des variables
  const [t] = useTranslation();
  const toast = useToast();

  const [codeCompetition, onChangeTextCodeComp] = useState();
  const [tableData, setTableData] = useState([]);

  // Chargement des concours existants
  const getAllSeries = async () => {
    const keys = await getAllKeys();
    await addSeriesDataTable(keys.filter(key => key.match(/.+\.json/g)));
  };

  useEffect(() => {
    getAllSeries();
  }, []);

  // Configuration du tableau Liste des concours
  const tableFlexColumn = [1, 1, 1, 1, 1];
  var tableState = {
    flexColumn: tableFlexColumn,
    headerTitles: [
      t('common:date'),
      t('common:discipline'),
      t('common:competition'),
      t('common:status'),
      t('common:action'),
    ],
    sumFlexValue: tableFlexColumn.reduce((sum, a) => sum + a, 0),
    maxWidth: Dimensions.get('window').width - 20, //20 : padding left/right
    columnType: ['text', 'text', 'text', 'text', 'actionHome'],
  };

  // Gère le champs code de la compétition
  const validateCompetitionCode = () => {
    if (codeCompetition != null)
      toast.show('TODO: récupérer à partir WebService', {
        type: 'warning',
        placement: 'top',
      });
    else
      toast.show(t('toast:competition_sheet_empty'), {
        type: 'danger',
        placement: 'top',
      });
  };

  const getInfoSerie = serie => {
    const formatDate =
      i18n.language == 'fr' ? 'DD/MM/YYYY - h:mm' : 'MM/DD/YYYY - h:mm';
    const infoConcours = JSON.parse(serie[1]);
    // serie contient déjà la clé (nom du fichier json) et son contenu
    serie.push(
      // Date épreuve
      moment(
        infoConcours.EpreuveConcoursComplet.TourConcoursComplet.SerieConcoursComplet.DateHeureSerie.toString(),
        moment.ISO_8601,
      ).format(formatDate),
      // Nom épreuve
      'Nom épreuve - ' +
        infoConcours.EpreuveConcoursComplet.TourConcoursComplet
          .SerieConcoursComplet.Libelle +
        ' \\ ' +
        infoConcours.EpreuveConcoursComplet.Categorie +
        infoConcours.EpreuveConcoursComplet.Sexe,
      // Nom compétition
      infoConcours.NomCompetition,
      // Status épreuve
      'Concours futur',
      // Action
      ['Editer', 'Supprimer'],
      /*<Image source={R.images.logo_ffa} style={{width: 10, height: 10}} />,*/
    );
    return serie;
  };

  const addOneSerieDataTable = async key => {
    // Vérification de la clé (nom de fichier .json)
    if (key.match(/.+\.json/g)) {
      // Vérification que la série n'existe pas dans le tableau
      if (tableData.filter(row => row[0] == key).length == 0) {
        const contentFile = await getFile(key);
        setTableData([...tableData, getInfoSerie([key, contentFile])]);
      }
    }
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

  const saveFile = async (fileName, content) => {
    try {
      const contentFile = await getFile(fileName);
      if (contentFile != null) {
        toast.show(t('toast:file_already_exist'), {
          type: 'warning',
          placement: 'top',
        });
      } else {
        await setFile(fileName, content);
        await addOneSerieDataTable(fileName);
        toast.show(t('toast:uploaded_file'), {
          type: 'success',
          placement: 'top',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const readFile = async newFile => {
    try {
      if (newFile != null) {
        if (newFile.type == 'application/json') {
          await ReactNativeBlobUtil.fs
            .readFile(newFile.uri.toString())
            .then(content => {
              saveFile(newFile.name, content);
            })
            .catch(e => {
              console.error(e);
              toast.show("Erreur d'import", {
                type: 'danger',
                placement: 'top',
              });
            });
        } else {
          toast.show(t('toast:json_format'), {
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
      if (newFile.type == 'application/zip') {
        const newPath =
          Platform.OS === 'android'
            ? '/data/user/0/com.concourscomplet/files'
            : '/';
        unzip(newFile.fileCopyUri.substring(5), newPath)
          .then(path => {
            ReactNativeBlobUtil.fs
              .ls('file:' + path)
              .then(files => {
                files.forEach(file => {
                  if (file.match(/.+\.json/g)) {
                    readFile({
                      type: 'application/json',
                      name: file,
                      uri: '/data/user/0/com.concourscomplet/files/' + file,
                    });
                  }
                });
              })
              .catch(e => console.error(e));
          })
          .catch(e => console.error(e));
      } else readFile(newFile);
    } catch (e) {
      if (DocumentPicker.isCancel(e)) {
        toast.show(t('toast:loading_cancelled'), {
          type: 'warning',
          placement: 'top',
        });
      }
      console.error(e);
    }
  }

  function componentTable(index, data, type) {
    code = '';
    switch (type) {
      case 'actionHome':
        code = (
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('CompetitionSheet', {
                  competitionData: tableData[index],
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
                  JSON.parse(tableData[index][1]).NomCompetition,
                  [
                    {
                      text: 'Annuler',
                    },
                    {
                      text: 'OK',
                      onPress: async () => {
                        try {
                          await removeFile(tableData[index][0]);
                          setTableData(
                            tableData.filter(
                              (item, itemIndex) => index !== itemIndex,
                            ),
                          );
                          toast.show(t('toast:file_deleted'), {
                            type: 'success',
                            placement: 'top',
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
                <Text style={styles.cellButton}>{data[1]}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        );
        break;
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
      case 'textAthlete':
        code = (
          <View style={styles.cell}>
            <Text style={styles.cellText}>{data}</Text>
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
      default:
        code = <Text>TODO</Text>;
        break;
    }
    return code;
  }

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
        <Text style={styles.titleText}>
          {t('common:list_competion_sheets')}
        </Text>
        {tableData.length > 0 ? (
          <View>
            <Table style={styles.headerTable}>
              <Row
                data={tableState.headerTitles}
                textStyle={styles.textHeaderTable}
                flexArr={tableState.flexColumn}
              />
            </Table>
            <ScrollView>
              <Table>
                {tableData.map((rowData, index) => {
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
                            width={
                              (tableState.maxWidth *
                                tableState.flexColumn[cellIndex]) /
                              tableState.sumFlexValue
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
  headerTable: {
    width: Dimensions.get('window').width - 20,
    paddingBottom: 10,
  },
  textHeaderTable: {
    color: R.colors.ffa_blue_light,
    fontWeight: 'bold',
    fontSize: 16,
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
  cellText: {color: R.colors.black, fontSize: 16},
  cellButton: {
    backgroundColor: R.colors.ffa_blue_light,
    color: R.colors.white,
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  cellTextInput: {
    borderWidth: 1,
    color: R.colors.black,
    fontSize: 16,
    borderColor: R.colors.black,
    borderRadius: 5,
  },
  cell: {paddingHorizontal: 10},
});

export default HomeScreen;
