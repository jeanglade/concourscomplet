import React from 'react';
import {colors} from '_config';
import {Modal, Button, Input, Dropdown, MyDateTimePicker} from '_components';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import moment from 'moment';

import i18n from 'i18next';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import {ValidatorsAddAthlete} from '../../utils/validators';

const ModalAddAthlete = props => {
  const setDateFormat = date => {
    return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
  };

  const getLastIdResultat = () => {
    return Math.max(
      ...props.athletesData.map(athlete => parseInt(athlete.$id)),
    );
  };

  const getLastNumCouloir = () => {
    return Math.max(
      ...props.athletesData.map(athlete => parseInt(athlete.NumCouloir)),
    );
  };

  const isAthleteExist = athlete => {
    return (
      props.athletesData.filter(athleteData => {
        athleteData.Athlete.Prenom == athlete.Athlete.Prenom &&
          athleteData.Athlete.Nom == athlete.Athlete.Nom &&
          athleteData.Athlete.Sexe == athlete.Athlete.Sexe &&
          athleteData.Athlete.Categorie == athlete.Athlete.Categorie &&
          athleteData.Athlete.Club == athlete.Athlete.Club;
      }).lenght > 0
    );
  };

  const handleSubmitForm = actions => {
    const values = props.fieldsAddAthtlete;
    const lastId = getLastIdResultat();
    console.log('values', values);
    var newAthlete = {
      $id: (lastId + 1).toString(),
      GuidResultat: '',
      Athlete: {
        $id: (lastId + 2).toString(),
        GuidParticipant: '',
        Prenom:
          values.firstname.charAt(0).toUpperCase() + values.firstname.slice(1),
        Nom: values.name.charAt(0).toUpperCase() + values.name.slice(1),
        Categorie:
          values.category != i18n.t('competition:category')
            ? values.category
            : '',
        Club:
          values.club != ''
            ? values.club.charAt(0).toUpperCase() + values.club.slice(1)
            : '',
        Nationalite: 'FRA',
        DateNaissance: setDateFormat(values.birthDate),
        Sexe: values.sex,
        IsNew: true,
      },
      NumCouloir: (getLastNumCouloir() + 1).toString(),
    };
    if (!isAthleteExist(newAthlete)) {
      console.log(newAthlete);
      props.athletesData.push(newAthlete);
      actions.resetForm(props.fieldsAddAthtlete);
      props.setModalVisible(false);
      showMessage({
        message: 'Athlète ajouté',
        type: 'success',
      });
    } else {
      console.error('Athlète déjà présent dans ce concours.');
      showMessage({
        message: 'Athlète déjà présent dans ce concours.',
        type: 'danger',
      });
    }
  };
  const sexValues = ['H', 'F', 'X'];
  const categoryValues = ['PO', 'BE', 'MI', 'CA', 'JU', 'ES', 'SE', 'MA'];
  const categoryEasyValues = [
    'Poussin',
    'Benjamin',
    'Minime',
    'Cadet',
    'Junior',
    'Espoir',
    'Senior',
    'Master',
  ];

  const onChangeField = (field, value, setValues) => {
    console.log('value', value);
    console.log('props.fieldsAddAthtlete', props.fieldsAddAthtlete);
    const result = {
      ...props.fieldsAddAthtlete,
      [field]: value,
    };
    props.setFieldsAddAthtlete(result);
    console.log(result);
  };

  return (
    <Modal
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      buttonStyleView={styles.button}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonContent={
        <Text style={styles.textButton}>
          {i18n.t('competition:add_an_athlete')}
        </Text>
      }
      contentModal={
        <View
          style={[
            styles.container,
            Platform.OS === 'windows' && {minHeight: 400},
          ]}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={0}>
            <ScrollView
              style={
                ([{flex: 1}], Platform.OS === 'windows' && {maxHeight: 380})
              }>
              <View>
                <Text style={styles.titleText}>
                  {i18n.t('competition:add_an_athlete')}
                </Text>
              </View>
              <View style={styles.content}>
                <Formik
                  initialValues={props.fieldsAddAthtlete}
                  onSubmit={(values, actions) => handleSubmitForm(actions)}
                  validationSchema={ValidatorsAddAthlete}>
                  {({
                    handleChange,
                    handleSubmit,
                    setValues,
                    values,
                    errors,
                    touched,
                  }) => {
                    return (
                      <View style={styles.form}>
                        <Input
                          textContentType="nickname"
                          placeholder={i18n.t('competition:firstname') + ' *'}
                          onChange={value => {
                            onChangeField('firstname', value, setValues);
                          }}
                          value={props.fieldsAddAthtlete.firstname}
                          touched={touched.firstname}
                          error={errors.firstname}
                        />

                        <Input
                          textContentType="familyName"
                          placeholder={i18n.t('competition:name') + ' *'}
                          onChange={value => {
                            onChangeField('name', value, setValues);
                          }}
                          value={props.fieldsAddAthtlete.name}
                          touched={touched.name}
                          error={errors.name}
                        />

                        <View
                          style={{
                            flexDirection:
                              Platform.OS === 'ios' ? 'row' : 'column',
                            justifyContent:
                              Platform.OS === 'ios'
                                ? 'space-around'
                                : 'flex-start',
                          }}>
                          <Dropdown
                            name="sex"
                            styleContainer={{}}
                            stylePickerIOS={{width: 200}}
                            placeholder={i18n.t('competition:sex') + '*'}
                            onValueChange={value => {
                              onChangeField('sex', value, setValues);
                            }}
                            data={sexValues.map(v => ({
                              label: v,
                              value: v,
                            }))}
                            selectedValue={props.fieldsAddAthtlete.sex}
                            touched={touched.sex}
                            error={errors.sex}
                          />

                          <Dropdown
                            styleContainer={{}}
                            stylePickerIOS={{width: 200}}
                            placeholder={i18n.t('competition:category')}
                            onValueChange={value => {
                              onChangeField('category', value, setValues);
                            }}
                            data={categoryValues.map((v, index) => ({
                              label: categoryEasyValues[index],
                              value: v,
                            }))}
                            selectedValue={props.fieldsAddAthtlete.category}
                          />
                        </View>

                        <MyDateTimePicker
                          values={values}
                          value={props.fieldsAddAthtlete.birthDate}
                          touched={touched.birthDate}
                          error={errors.birthDate}
                          setValues={setValues}
                        />

                        <Input
                          textContentType="username"
                          placeholder={i18n.t('competition:licence_number')}
                          onChange={value => {
                            onChangeField('licence_number', value, setValues);
                          }}
                          value={props.fieldsAddAthtlete.licence_number}
                          touched={touched.licence_number}
                          error={errors.licence_number}
                        />

                        <Input
                          textContentType="username"
                          placeholder={i18n.t('competition:club')}
                          onChange={value => {
                            onChangeField('club', value, setValues);
                          }}
                          value={props.fieldsAddAthtlete.club}
                          touched={touched.club}
                          error={errors.club}
                        />

                        <Button
                          onPress={handleSubmit}
                          styleView={styles.button}
                          content={
                            <Text style={styles.textButton}>
                              {i18n.t('common:validate')}
                            </Text>
                          }
                        />
                      </View>
                    );
                  }}
                </Formik>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
  },
  button: {
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_dark,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 3,
    borderColor: colors.ffa_blue_light,
  },
  textButton: {
    color: colors.white,
    fontSize: 16,
  },
  container: {
    maxHeight: '80%',
    minWidth: Platform.OS === 'windows' ? 300 : '50%',
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

export default ModalAddAthlete;
