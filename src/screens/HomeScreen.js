// import React, {useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   TextInput,
//   Text,
//   View,
//   SafeAreaView,
//   Dimensions,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Alert,
// } from 'react-native';
// import i18n from 'i18next';
// import moment from 'moment';
// import {useTranslation} from 'react-i18next';
// import {useToast} from 'react-native-toast-notifications';
// import ReactNativeBlobUtil from 'react-native-blob-util';
// import DocumentPicker from 'react-native-document-picker';
// import {Table, Row, Cell, TableWrapper} from 'react-native-table-component';
// import {unzip} from 'react-native-zip-archive';
// import {Picker} from '@react-native-picker/picker';
// import {showMessage} from 'react-native-flash-message';
// import {colors} from '_config';

// import {
//   getAllKeys,
//   getFile,
//   getFiles,
//   setFile,
//   removeFile,
// } from '../utils/myasyncstorage';

// const HomeScreen = props => {
//   // Initialisation des variables
//   const [t] = useTranslation();
//   const [codeCompetition, onChangeTextCodeComp] = useState();
//   const [tableData, setTableData] = useState([]);
//   const [competitionName, setCompetitionName] = useState();
//   const [competitionDate, setCompetitionDate] = useState();
//   // Configuration du tableau Liste des concours
//   var tableState = {
//     minWidthColumn: [
//       160,
//       200,
//       Dimensions.get('window').width - (620 + 20 + 10),
//       100,
//       160,
//     ],
//     headerTitles: [
//       t('common:date'),
//       t('common:discipline'),
//       '',
//       t('common:status'),
//       t('common:action'),
//     ],
//     maxWidth: Dimensions.get('window').width - 20, //20 : padding left/right
//     columnType: ['text', 'text', 'text', 'textStatutConcours', 'actionHome'],
//   };

//   // Chargement des concours existants
//   const getAllSeries = async () => {
//     const keys = await getAllKeys();
//     await addSeriesDataTable(keys.filter(key => key.match(/.+\.json/g)));
//   };

//   useEffect(() => {
//     getAllSeries();
//   }, []);

//   // Gère le champs code de la compétition
//   const validateCompetitionCode = () => {
//     if (codeCompetition != null)
//       showMessage({
//         message: 'TODO: récupérer à partir WebService',
//         type: 'warning',
//       });
//     else
//       showMessage({
//         message: t('toast:competition_sheet_empty'),
//         type: 'danger',
//       });
//   };

//   const getInfoSerie = serie => {
//     const formatDate = i18n.language == 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
//     const infoConcours = JSON.parse(serie[1]);
//     const statutConcours = 'A venir';
//     setCompetitionName(
//       infoConcours.NomCompetition + ' - ' + infoConcours.Stade,
//     );
//     const dateConcours = moment(
//       infoConcours.EpreuveConcoursComplet.TourConcoursComplet.SerieConcoursComplet.DateHeureSerie.toString(),
//       moment.ISO_8601,
//     ).format(formatDate);
//     const heureConcours = moment(
//       infoConcours.EpreuveConcoursComplet.TourConcoursComplet.SerieConcoursComplet.DateHeureSerie.toString(),
//       moment.ISO_8601,
//     ).format('h:mm');
//     setCompetitionDate(dateConcours);
//     // serie contient déjà la clé (nom du fichier json) et son contenu
//     serie.push(
//       // Date épreuve
//       dateConcours + ' - ' + heureConcours,
//       // Nom épreuve
//       infoConcours.EpreuveConcoursComplet.Nom +
//         ' - ' +
//         infoConcours.EpreuveConcoursComplet.TourConcoursComplet
//           .SerieConcoursComplet.Libelle +
//         ' \\ ' +
//         infoConcours.EpreuveConcoursComplet.Categorie +
//         infoConcours.EpreuveConcoursComplet.Sexe,
//       '',
//       // Nom compétition
//       //infoConcours.NomCompetition + '\n' + infoConcours.Stade,
//       // Status épreuve
//       statutConcours,
//       // Action
//       ['Editer', 'Supprimer'],
//       /*<Image source={images.logo_ffa} style={{width: 10, height: 10}} />,*/
//     );
//     return serie;
//   };

//   const addOneSerieDataTable = async key => {
//     // Vérification de la clé (nom de fichier .json)
//     if (key.match(/.+\.json/g)) {
//       // Vérification que la série n'existe pas dans le tableau
//       if (tableData.filter(row => row[0] == key).length == 0) {
//         const contentFile = await getFile(key);
//         setTableData(tableData => [
//           ...tableData,
//           getInfoSerie([key, contentFile]),
//         ]);
//       }
//     }
//   };

//   const addSeriesDataTable = async keys => {
//     if (keys.length > 0) {
//       const listKeyValue = await getFiles(
//         keys.filter(
//           key =>
//             // Vérification que la série n'existe pas dans le tableau
//             tableData.filter(row => row[0] === key).length === 0,
//         ),
//       );
//       listKeyValue.forEach(keyValue => {
//         setTableData(tableData => [...tableData, getInfoSerie(keyValue)]);
//       });
//     }
//   };

//   const saveFile = async (fileName, content) => {
//     try {
//       const contentFile = await getFile(fileName);
//       if (contentFile != null) {
//         toast.show(t('toast:file_already_exist'), {
//           type: 'warning',
//           placement: 'top',
//         });
//       } else {
//         await setFile(fileName, content);
//         await addOneSerieDataTable(fileName);
//         toast.show(t('toast:uploaded_file'), {
//           type: 'success',
//           placement: 'top',
//         });
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const readFile = async newFile => {
//     try {
//       if (newFile != null) {
//         if (newFile.type == 'application/json') {
//           /*await ReactNativeBlobUtil.fs
//             .exists(newFile.uri.toString())
//             .then(exist => {
//               console.log(`file ${exist ? '' : 'not'} exists`);
//             })
//             .catch(() => {
//               console.log('cejsdlkjsl');
//             });
//           console.log(newFile);
//           console.log(newFile.uri.toString());*/
//           await ReactNativeBlobUtil.fs
//             .readFile(newFile.uri.toString(), 'utf8')
//             .then(content => {
//               saveFile(newFile.name, content);
//             })
//             .catch(e => {
//               console.error(e);
//               toast.show(newFile.name.toString(), {
//                 type: 'danger',
//                 placement: 'top',
//               });
//             });
//         } else {
//           toast.show(t('toast:json_format'), {
//             type: 'warning',
//             placement: 'top',
//           });
//         }
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   async function pickOneDeviceFile() {
//     try {
//       const newFile = await DocumentPicker.pickSingle({
//         presentationStyle: 'fullScreen',
//         copyTo: 'cachesDirectory',
//       });
//       if (newFile.type == 'application/zip') {
//         const newPath =
//           Platform.OS === 'android'
//             ? '/data/user/0/com.concourscomplet/files'
//             : '/';
//         unzip(newFile.fileCopyUri.substring(5), newPath)
//           .then(path => {
//             ReactNativeBlobUtil.fs
//               .ls('file:' + path)
//               .then(files => {
//                 files.forEach(file => {
//                   if (file.match(/.+\.json/g)) {
//                     readFile({
//                       type: 'application/json',
//                       name: file,
//                       uri: '/data/user/0/com.concourscomplet/files/' + file,
//                     });
//                   }
//                 });
//               })
//               .catch(e => console.error(e));
//           })
//           .catch(e => console.error(e));
//       } else {
//         /* ReactNativeBlobUtil.fs.isDir(newFile.uri).then(isDir => {
//           console.log(`fil1 is ${isDir ? '' : 'not'} a directory`);
//         });*/
//         /*ReactNativeBlobUtil.fs
//           .exists(newFile.uri)
//           .then(isDir => {
//             console.log(`fil2 ${isDir ? 'exist' : 'not exist'}`);
//           })
//           .catch(e => {
//             console.error('klalalala ' + e.toString());
//           });*/
//         /*ReactNativeBlobUtil.fs.ls(newFile.uri).then(isDir => {
//           console.log(`file3 ${isDir}`);
//         });*/
//         readFile(newFile);
//       }
//     } catch (e) {
//       if (DocumentPicker.isCancel(e)) {
//         toast.show(t('toast:loading_cancelled'), {
//           type: 'warning',
//           placement: 'top',
//         });
//       }
//       console.error(e);
//     }
//   }

//   function componentTable(index, data, type) {
//     code = '';
//     switch (type) {
//       case 'actionHome':
//         code = (
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//             }}>
//             <TouchableWithoutFeedback
//               onPress={() => {
//                 props.navigation.navigate('CompetitionSheet', {
//                   competitionData: tableData[index],
//                 });
//               }}>
//               <View style={styles.cell}>
//                 <Text style={styles.cellButton}>{data[0]}</Text>
//               </View>
//             </TouchableWithoutFeedback>
//             <TouchableWithoutFeedback
//               onPress={() => {
//                 Alert.alert(
//                   'Voulez-vous supprimer ce concours?',
//                   JSON.parse(tableData[index][1]).NomCompetition,
//                   [
//                     {
//                       text: 'Annuler',
//                     },
//                     {
//                       text: 'OK',
//                       onPress: async () => {
//                         try {
//                           await removeFile(tableData[index][0]);
//                           setTableData(
//                             tableData.filter(
//                               (item, itemIndex) => index !== itemIndex,
//                             ),
//                           );
//                           toast.show(t('toast:file_deleted'), {
//                             type: 'success',
//                             placement: 'top',
//                           });
//                         } catch (e) {
//                           console.error(e);
//                         }
//                       },
//                     },
//                   ],
//                 );
//               }}>
//               <View style={styles.cell}>
//                 <Text style={[styles.cellButton, styles.backRed]}>
//                   {data[1]}
//                 </Text>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         );
//         break;
//       case 'text':
//         code = (
//           <View style={styles.cell}>
//             <Text style={styles.cellText}>{data}</Text>
//           </View>
//         );
//         break;
//       case 'textStatutConcours':
//         const colorText = colors.ffa_blue_dark;
//         code = (
//           <View style={styles.cell}>
//             <Text style={{color: colorText, fontWeight: 'bold', fontSize: 16}}>
//               {data}
//             </Text>
//           </View>
//         );
//         break;
//     }
//     return code;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         {/* Ouvrir les concours d'une compétition */}
//         <Text style={styles.titleText}>
//           {t('common:open_competion_sheets')}
//         </Text>
//         <View
//           style={{
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             alignItems: 'center',
//           }}>
//           <Text style={styles.text}>{t('common:competition_code')} :</Text>
//           <TextInput
//             style={styles.textinput}
//             onChangeText={onChangeTextCodeComp}
//             value={codeCompetition}
//           />
//           <TouchableWithoutFeedback onPress={validateCompetitionCode}>
//             <View style={styles.button}>
//               <Text style={styles.textButton}>{t('common:validate')}</Text>
//             </View>
//           </TouchableWithoutFeedback>
//           <TouchableWithoutFeedback onPress={() => pickOneDeviceFile()}>
//             <View style={styles.button}>
//               <Text style={styles.textButton}>
//                 {t('common:via_local_file')}
//               </Text>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//         <Text style={styles.titleText}>
//           {t('common:open_competion_sheets')}
//         </Text>
//         {tableData.length > 0 ? (
//           <View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 flexWrap: 'wrap',
//                 alignItems: 'center',
//                 paddingVertical: 15,
//               }}>
//               <Text style={styles.textHeaderTable}>Filtres : </Text>
//               <View style={styles.dropdown}>
//                 <Picker
//                   selectedValue={competitionDate}
//                   dropdownIconColor={colors.black}
//                   onValueChange={value => {
//                     setCompetitionDate(value);
//                   }}
//                   mode="dropdown">
//                   {tableData.map((rowData, index) => {
//                     return (
//                       <Picker.Item
//                         style={styles.dropdownItem}
//                         label={rowData.DateHeureSerie}
//                         value={rowData.DateHeureSerie}
//                       />
//                     );
//                   })}
//                 </Picker>
//               </View>
//             </View>
//             <Text style={[styles.textHeaderTable, {textAlign: 'center'}]}>
//               {competitionName}
//             </Text>
//             <Table style={styles.headerTable}>
//               <Row
//                 data={tableState.headerTitles}
//                 textStyle={styles.textHeaderTable}
//                 widthArr={tableState.minWidthColumn}
//                 //flexArr={tableState.flexColumn}
//               />
//             </Table>
//             <ScrollView>
//               <Table>
//                 {tableData.map((rowData, index) => {
//                   return (
//                     <TableWrapper key={index} style={styles.row}>
//                       {rowData
//                         .filter(
//                           (cellData, cellIndex) =>
//                             cellIndex != 0 && cellIndex != 1,
//                         )
//                         .map((cellData, cellIndex) => (
//                           <Cell
//                             key={cellIndex}
//                             width={tableState.minWidthColumn[cellIndex]}
//                             /*width={
//                               (tableState.maxWidth *
//                                 tableState.flexColumn[cellIndex]) /
//                               tableState.sumFlexValue
//                             }*/
//                             data={componentTable(
//                               index,
//                               cellData,
//                               tableState.columnType[cellIndex],
//                             )}
//                           />
//                         ))}
//                     </TableWrapper>
//                   );
//                 })}
//               </Table>
//             </ScrollView>
//           </View>
//         ) : (
//           <Text style={styles.text}>
//             {t('common:no_imported_competitions') + '...'}
//           </Text>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     backgroundColor: colors.white,
//     padding: 10,
//   },
//   button: {
//     alignItems: 'center',
//     backgroundColor: colors.ffa_blue_light,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginHorizontal: 15,
//     borderRadius: 5,
//     fontSize: 16,
//   },
//   textButton: {
//     color: colors.white,
//   },
//   titleText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: colors.ffa_blue_light,
//     marginVertical: 15,
//   },
//   text: {
//     color: colors.ffa_blue_light,
//     fontSize: 16,
//     paddingHorizontal: 10,
//   },
//   textinput: {
//     fontSize: 16,
//     padding: 10,
//     width: 200,
//     height: 45,
//     color: colors.black,
//     backgroundColor: colors.white,
//     borderColor: colors.black,
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   headerTable: {
//     width: Dimensions.get('window').width - 20,
//     paddingBottom: 10,
//     paddingStart: 10,
//   },
//   textHeaderTable: {
//     color: colors.black,
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   row: {
//     paddingVertical: 10,
//     marginBottom: 5,
//     backgroundColor: '#E7E6E1',
//     width: Dimensions.get('window').width - 20,
//     flexDirection: 'row',
//     borderRadius: 5,
//     maxHeight: 100,
//   },
//   cellText: {color: colors.black, fontSize: 16},
//   cellButton: {
//     backgroundColor: colors.ffa_blue_light,
//     color: colors.white,
//     padding: 10,
//     borderRadius: 5,
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   backRed: {
//     backgroundColor: colors.red,
//   },
//   cellTextInput: {
//     borderWidth: 1,
//     color: colors.black,
//     fontSize: 16,
//     borderColor: colors.black,
//     borderRadius: 5,
//   },
//   cell: {paddingHorizontal: 10},
//   dropdown: {
//     fontSize: 14,
//     width: 200,
//     color: colors.black,
//     backgroundColor: colors.white,
//     borderColor: colors.black,
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   dropdownItem: {
//     color: colors.black,
//     backgroundColor: colors.white,
//   },
// });

// export default HomeScreen;
