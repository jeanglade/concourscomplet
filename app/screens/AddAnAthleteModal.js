import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  View,
  SafeAreaView,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useToast} from 'react-native-toast-notifications';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import i18n from 'i18next';
import moment from 'moment';

import R from '../assets/R';

const AddAnAthleteModal = props => {
  // Initialisation des variables
  const [t] = useTranslation();
  const toast = useToast();
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Champs obligatoires
  const [nameAthlete, onChangeNameAthlete] = useState();
  const [firstnameAthlete, onChangeFirstnameAthlete] = useState();
  const [sexAthlete, onChangeSexAthlete] = useState();
  const [birthDateAthlete, onChangeBirthDateAthlete] = useState(new Date());
  const [birthDateAthleteFormat, onChangeBirthDateAthleteFormat] = useState();
  // Champs optionnels
  const [licenceNumberAthlete, onChangeLicenceNumberAthlete] = useState();
  const [clubAthlete, onChangeClubAthlete] = useState();
  const [categoryAthlete, onChangeCategoryAthlete] = useState();

  const validateFormAthlete = () => {
    if (
      nameAthlete == null ||
      firstnameAthlete == null ||
      sexAthlete == '' ||
      birthDateAthlete == null
    ) {
      toast.show(t('toast:required_fields_error'), {
        type: 'danger',
        placement: 'top',
      });
    } else {
      props.setAthletesData(athletesData => [
        ...athletesData,
        {
          $id: (
            Math.max(
              ...athletesData.map(athlete => {
                return athlete.id;
              }),
            ) + 1
          ).toString(),
          GuidResultat: '',
          Athlete: {
            $id: (
              Math.max(
                ...athletesData.map(athlete => {
                  return athlete.Athlete.id;
                }),
              ) + 1
            ).toString(),
            GuidParticipant: '',
            Prenom: firstnameAthlete,
            Nom: nameAthlete,
            Categorie: categoryAthlete,
            Club: clubAthlete,
            DateNaissance: birthDateAthleteFormat,
            Sexe: sexAthlete,
            IsNew: true,
          },
          NumCouloir: 1,
        },
      ]);
      toast.show(t('toast:athlete_added'), {
        type: 'success',
        placement: 'top',
      });
    }
  };

  return (
    <View style={styles.centeredView}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <Text style={styles.button}>Show Modal</Text>
      </TouchableWithoutFeedback>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            {/* Ouvrir les concours d'une compétition */}
            <Text style={styles.titleText}>
              {t('competition:add_an_athlete')}
            </Text>
            <View style={styles.fieldForm}>
              <Text style={styles.text}>{t('competition:firstname')} :</Text>
              <TextInput
                style={styles.textinput}
                onChangeText={onChangeFirstnameAthlete}
                value={firstnameAthlete}
              />
              <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
            </View>
            <View style={styles.fieldForm}>
              <Text style={styles.text}>{t('competition:name')} :</Text>
              <TextInput
                style={styles.textinput}
                onChangeText={onChangeNameAthlete}
                value={nameAthlete}
              />
              <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
            </View>
            <View style={styles.fieldForm}>
              <Text style={styles.text}>{t('competition:sex')} :</Text>
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={sexAthlete}
                  dropdownIconColor={R.colors.black}
                  onValueChange={value => {
                    onChangeSexAthlete(value);
                  }}
                  mode="dropdown">
                  <Picker.Item style={styles.dropdownItem} label="" value="" />
                  <Picker.Item
                    style={styles.dropdownItem}
                    label="H"
                    value="H"
                  />
                  <Picker.Item
                    style={styles.dropdownItem}
                    label="F"
                    value="F"
                  />
                </Picker>
              </View>
              <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
            </View>
            <View style={styles.fieldForm}>
              <Text style={styles.text}>{t('competition:birth_date')} :</Text>
              <TouchableWithoutFeedback
                onPress={() =>
                  setDateTimePickerVisible(!dateTimePickerVisible)
                }>
                <Text style={styles.textinput}>{birthDateAthleteFormat}</Text>
              </TouchableWithoutFeedback>
              {dateTimePickerVisible && (
                <DateTimePicker
                  style={styles.text}
                  value={birthDateAthlete}
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    onChangeBirthDateAthleteFormat(
                      moment(selectedDate, moment.ISO_8601)
                        .format(
                          i18n.language == 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
                        )
                        .toString(),
                    );
                    onChangeBirthDateAthlete(selectedDate);
                    setDateTimePickerVisible(false);
                  }}
                />
              )}
              <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
            </View>
            <View style={styles.fieldForm}>
              <Text style={styles.text}>
                {t('competition:licence_number')} :
              </Text>
              <TextInput
                style={styles.textinput}
                onChangeText={onChangeLicenceNumberAthlete}
                value={licenceNumberAthlete}
                keyboardType="numeric"
                maxLength={7}
              />
            </View>
            <View style={styles.fieldForm}>
              <Text style={styles.text}>{t('competition:club')} :</Text>
              <TextInput
                style={styles.textinput}
                onChangeText={onChangeClubAthlete}
                value={clubAthlete}
              />
            </View>
            <View style={styles.fieldForm}>
              <Text style={styles.text}>{t('competition:category')} :</Text>
              <TextInput
                style={styles.textinput}
                onChangeText={onChangeCategoryAthlete}
                value={categoryAthlete}
              />
            </View>
            <Text
              style={{width: 500, color: R.colors.black, textAlign: 'right'}}>
              * : {t('common:required')}
            </Text>
            <View style={{marginTop: 15, maxWidth: 500}}>
              <TouchableWithoutFeedback onPress={validateFormAthlete}>
                <View style={styles.button}>
                  <Text>{t('common:validate')}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    padding: 10,
    flex: 1,
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
    width: 200,
  },
  textinput: {
    borderWidth: 1,
    paddingStart: 10,
    width: 300,
    color: R.colors.black,
    borderColor: R.colors.black,
    borderRadius: 5,
    textAlignVertical: 'center',
    height: 50,
  },
  fieldForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },
  dropdown: {
    width: 300,
    borderWidth: 1,
    borderColor: R.colors.black,
    borderRadius: 5,
  },
  dropdownItem: {
    color: R.colors.black,
    backgroundColor: R.colors.white,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddAnAthleteModal;
