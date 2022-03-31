// import React, {useState} from 'react';
// import {
//   StyleSheet,
//   TextInput,
//   TouchableWithoutFeedback,
//   Text,
//   View,
//   Image,
//   Modal,
//   ScrollView,
// } from 'react-native';
// import {useTranslation} from 'react-i18next';
// import {Picker} from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import i18n from 'i18next';
// import moment from 'moment';
// import {Close} from '_icons';
// import {colors} from '_config';

// const AddAnAthleteModal = props => {
//   const [t] = useTranslation();
//   const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
//   // Champs obligatoires
//   const [nameAthlete, onChangeNameAthlete] = useState();
//   const [firstnameAthlete, onChangeFirstnameAthlete] = useState();
//   const [sexAthlete, onChangeSexAthlete] = useState();
//   const [birthDateAthlete, onChangeBirthDateAthlete] = useState(new Date());
//   const [birthDateAthleteFormat, onChangeBirthDateAthleteFormat] = useState();
//   // Champs optionnels
//   const [licenceNumberAthlete, onChangeLicenceNumberAthlete] = useState();
//   const [clubAthlete, onChangeClubAthlete] = useState();
//   const [categoryAthlete, onChangeCategoryAthlete] = useState();

//   const validateFormAthlete = () => {
//     if (
//       nameAthlete == null ||
//       firstnameAthlete == null ||
//       sexAthlete == '' ||
//       birthDateAthlete == null
//     ) {
//       props.toast.show(t('toast:required_fields_error'), {
//         type: 'danger',
//         placement: 'top',
//       });
//     } else {
//       props.setAthletesData([
//         ...props.athletesData,
//         {
//           $id: (
//             Math.max(
//               ...athletesData.map(athlete => {
//                 return athlete.id;
//               }),
//             ) + 1
//           ).toString(),
//           GuidResultat: '',
//           Athlete: {
//             $id: (
//               Math.max(
//                 ...athletesData.map(athlete => {
//                   return athlete.Athlete.id;
//                 }),
//               ) + 1
//             ).toString(),
//             GuidParticipant: '',
//             Prenom: firstnameAthlete,
//             Nom: nameAthlete,
//             Categorie: categoryAthlete,
//             Club: clubAthlete,
//             DateNaissance: birthDateAthleteFormat,
//             Sexe: sexAthlete,
//             IsNew: true,
//           },
//           NumCouloir: 1,
//         },
//       ]);
//       props.toast.show(t('toast:athlete_added'), {
//         type: 'success',
//         placement: 'top',
//       });
//     }
//   };

//   return (
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={props.modalVisible}
//       onRequestClose={() => props.setModalVisible(!props.modalVisible)}>
//       <View style={styles.centeredView}>
//         <ScrollView style={styles.modalView}>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingBottom: 20,
//             }}>
//             <Text style={styles.titleText}>
//               {t('competition:add_an_athlete')}
//             </Text>
//             <TouchableWithoutFeedback
//               onPress={() => props.setModalVisible(false)}>
//               <View>
//                 <Close />
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//           <View style={styles.fieldForm}>
//             <Text style={styles.text}>{t('competition:firstname')} :</Text>
//             <TextInput
//               style={styles.textinput}
//               onChangeText={onChangeFirstnameAthlete}
//               value={firstnameAthlete}
//             />
//             <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
//           </View>
//           <View style={styles.fieldForm}>
//             <Text style={styles.text}>{t('competition:name')} :</Text>
//             <TextInput
//               style={styles.textinput}
//               onChangeText={onChangeNameAthlete}
//               value={nameAthlete}
//             />
//             <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
//           </View>
//           <View style={styles.fieldForm}>
//             <Text style={styles.text}>{t('competition:sex')} :</Text>
//             <View style={styles.dropdown}>
//               <Picker
//                 selectedValue={sexAthlete}
//                 dropdownIconColor={colors.black}
//                 onValueChange={value => {
//                   onChangeSexAthlete(value);
//                 }}
//                 mode="dropdown">
//                 <Picker.Item style={styles.dropdownItem} label="" value="" />
//                 <Picker.Item style={styles.dropdownItem} label="H" value="H" />
//                 <Picker.Item style={styles.dropdownItem} label="F" value="F" />
//               </Picker>
//             </View>
//             <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
//           </View>
//           <View style={styles.fieldForm}>
//             <Text style={styles.text}>{t('competition:birth_date')} :</Text>
//             <TouchableWithoutFeedback
//               onPress={() => setDateTimePickerVisible(!dateTimePickerVisible)}>
//               <Text style={styles.textinput}>{birthDateAthleteFormat}</Text>
//             </TouchableWithoutFeedback>
//             {dateTimePickerVisible && (
//               <DateTimePicker
//                 style={styles.text}
//                 value={birthDateAthlete}
//                 maximumDate={new Date()}
//                 onChange={(event, selectedDate) => {
//                   onChangeBirthDateAthleteFormat(
//                     moment(selectedDate, moment.ISO_8601)
//                       .format(
//                         i18n.language == 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
//                       )
//                       .toString(),
//                   );
//                   onChangeBirthDateAthlete(selectedDate);
//                   setDateTimePickerVisible(false);
//                 }}
//               />
//             )}
//             <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
//           </View>
//           <View style={styles.fieldForm}>
//             <Text style={styles.text}>{t('competition:licence_number')} :</Text>
//             <TextInput
//               style={styles.textinput}
//               onChangeText={onChangeLicenceNumberAthlete}
//               value={licenceNumberAthlete}
//               keyboardType="numeric"
//               maxLength={7}
//             />
//           </View>
//           <View style={styles.fieldForm}>
//             <Text style={styles.text}>{t('competition:club')} :</Text>
//             <TextInput
//               style={styles.textinput}
//               onChangeText={onChangeClubAthlete}
//               value={clubAthlete}
//             />
//           </View>
//           <View style={styles.fieldForm}>
//             <Text style={styles.text}>{t('competition:category')} :</Text>
//             <TextInput
//               style={styles.textinput}
//               onChangeText={onChangeCategoryAthlete}
//               value={categoryAthlete}
//             />
//           </View>
//           <Text style={{width: 500, color: colors.black, textAlign: 'right'}}>
//             * : {t('common:required')}
//           </Text>
//           <View style={{marginTop: 15, maxWidth: 500}}>
//             <TouchableWithoutFeedback onPress={validateFormAthlete}>
//               <View style={styles.button}>
//                 <Text>{t('common:validate')}</Text>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.white,
//     padding: 10,
//     flex: 1,
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
//     width: 200,
//   },
//   textinput: {
//     borderWidth: 1,
//     paddingStart: 10,
//     width: 300,
//     color: colors.black,
//     borderColor: colors.black,
//     borderRadius: 5,
//     textAlignVertical: 'center',
//     height: 50,
//   },
//   fieldForm: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     marginVertical: 5,
//   },
//   dropdown: {
//     width: 300,
//     borderWidth: 1,
//     borderColor: colors.black,
//     borderRadius: 5,
//   },
//   dropdownItem: {
//     color: colors.black,
//     backgroundColor: colors.white,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(52, 52, 52, 0.8)',
//   },
//   modalView: {
//     backgroundColor: colors.white,
//     borderRadius: 15,
//     padding: 30,
//     shadowColor: colors.black,
//     shadowOpacity: 0.25,
//     elevation: 100,
//     maxHeight: 640,
//   },
// });

// export default AddAnAthleteModal;
