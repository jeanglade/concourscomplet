import React from 'react';
import {colors} from '_config';
import {Modal, Button, Input, Dropdown, MyDateTimePicker} from '_components';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Image,
  Platform,
  Alert,
} from 'react-native';
import moment from 'moment';

import i18n from 'i18next';
import {Formik} from 'formik';
import {showMessage} from 'react-native-flash-message';
import {ValidatorsAddAthlete} from '../../utils/validators';
import {setFile} from '../../../utils/myAsyncStorage';

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

  const setNewAthlete = (values, athlete) => {
    athlete.Athlete.Prenom =
      values.firstname.charAt(0).toUpperCase() + values.firstname.slice(1);
    athlete.Athlete.Nom =
      values.name.charAt(0).toUpperCase() + values.name.slice(1);
    athlete.Athlete.Sexe = values.sex;
    athlete.Athlete.Categorie =
      values.category != i18n.t('competition:category') ? values.category : '';
    athlete.Athlete.Club =
      values.club != ''
        ? values.club.charAt(0).toUpperCase() + values.club.slice(1)
        : '';
    athlete.Athlete.Licence = values.licence_number;
    athlete.Athlete.Nationalite = 'FRA';
    athlete.Athlete.DateNaissance = setDateFormat(values.birthDate);
    athlete.Athlete.Dossard = values.dossard;
    return athlete;
  };

  const saveContent = async () => {
    props.fileContent.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats =
      props.athletesData;
    await setFile(props.fileName, JSON.stringify(props.fileContent));
  };

  const handleSubmitForm = actions => {
    const values = props.fieldsAddAthtlete;
    var newAthlete = null;
    var athlete = null;
    if (values.type === 'new') {
      const lastId = getLastIdResultat();
      newAthlete = {
        $id: (lastId + 1).toString(),
        GuidResultat: '',
        Athlete: {
          $id: (lastId + 2).toString(),
          GuidParticipant: '',
          Prenom: '',
          Nom: '',
          Categorie: '',
          Club: '',
          Nationalite: '',
          Licence: '',
          DateNaissance: '',
          Sexe: '',
          Dossard: '',
          IsNew: true,
        },
        NumCouloir: (getLastNumCouloir() + 1).toString(),
      };
      newAthlete = setNewAthlete(values, newAthlete);
      if (!isAthleteExist(newAthlete)) {
        props.athletesData.push(newAthlete);
        actions.resetForm(props.fieldsAddAthtlete);
        saveContent();
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
    } else {
      props.athletesData[
        props.athletesData.findIndex(
          a => a.$id === props.fieldsAddAthtlete.resultat.$id,
        )
      ] = setNewAthlete(values, props.fieldsAddAthtlete.resultat);
      saveContent();
      showMessage({
        message: 'Athlète modifié',
        type: 'success',
      });
    }
    props.setModalVisible(false);
  };

  const sexValues = ['M', 'F'];
  const categoryValues = props.fieldsAddAthtlete?.categories;
  const categoryEasyValues = [
    {id: 'EA', name: 'Eveil'},
    {id: 'PO', name: 'Poussin'},
    {id: 'BE', name: 'Benjamin'},
    {id: 'MI', name: 'Minime'},
    {id: 'CA', name: 'Cadet'},
    {id: 'JU', name: 'Junior'},
    {id: 'ES', name: 'Espoir'},
    {id: 'SE', name: 'Senior'},
    {id: 'MA', name: 'Master'},
  ];

  const onChangeField = (field, value) => {
    props.setFieldsAddAthtlete({
      ...props.fieldsAddAthtlete,
      [field]: value,
    });
  };

  const alertDeleteAthlete = () => {
    Alert.alert(
      i18n.t('toast:confirm_delete_athlete'),
      props.fieldsAddAthtlete.firstname?.toString() +
        ' ' +
        props.fieldsAddAthtlete.name?.toString(),
      [
        {
          text: i18n.t('toast:cancel'),
        },
        {
          text: i18n.t('toast:ok'),
          onPress: async () => {
            props.athletesData.splice(
              props.athletesData.findIndex(
                a => a.$id === props.fieldsAddAthtlete.resultat.$id,
              ),
              1,
            );
            saveContent();
            props.setModalVisible(false);
            showMessage({
              message: 'Athlète supprimé',
              type: 'success',
            });
          },
        },
      ],
    );
  };

  const findCategory = category => {
    const result = categoryEasyValues.filter(cat => cat.id == category);
    return result.length > 0 ? result[0].name : category;
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
      maxHeight={760}
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.titleText}>
                  {props.fieldsAddAthtlete.type === 'new'
                    ? i18n.t('competition:add_an_athlete')
                    : i18n.t('competition:edit_an_athlete')}
                </Text>
                {props.fieldsAddAthtlete.type === 'modify' && (
                  <Button
                    onPress={alertDeleteAthlete}
                    styleView={styles.buttonDeleteAthlete}
                    content={
                      <Image
                        style={styles.icon}
                        source={require('../../../icons/delete.png')}
                      />
                    }
                  />
                )}
              </View>
              <View style={styles.content}>
                <Formik
                  initialValues={props.fieldsAddAthtlete}
                  onSubmit={(values, actions) => handleSubmitForm(actions)}
                  validationSchema={ValidatorsAddAthlete}
                  validateOnBlur={false}
                  validateOnChange={false}>
                  {({handleSubmit, setValues, values, errors, touched}) => {
                    return (
                      <View style={styles.form}>
                        <Input
                          textContentType="nickname"
                          placeholder={i18n.t('competition:firstname') + ' *'}
                          onChange={value => {
                            onChangeField('firstname', value);
                          }}
                          onBlur={value => {
                            setValues(props.fieldsAddAthtlete);
                          }}
                          value={props.fieldsAddAthtlete.firstname}
                          touched={touched.firstname}
                          error={errors.firstname}
                        />

                        <Input
                          textContentType="familyName"
                          placeholder={i18n.t('competition:name') + ' *'}
                          onChange={value => {
                            onChangeField('name', value);
                          }}
                          onBlur={() => {
                            setValues(props.fieldsAddAthtlete);
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
                              onChangeField('sex', value);
                              setValues(props.fieldsAddAthtlete);
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
                              onChangeField('category', value);
                              setValues(props.fieldsAddAthtlete);
                            }}
                            data={categoryValues.map((v, index) => ({
                              label: findCategory(v),
                              value: v,
                            }))}
                            selectedValue={props.fieldsAddAthtlete.category}
                          />
                        </View>

                        <MyDateTimePicker
                          value={props.fieldsAddAthtlete.birthDate}
                          touched={touched.birthDate}
                          error={errors.birthDate}
                          onValueChange={value => {
                            if (value != undefined) {
                              onChangeField('birthDate', value);
                              setValues(props.fieldsAddAthtlete);
                            }
                          }}
                        />

                        <Input
                          textContentType="username"
                          placeholder={i18n.t('competition:licence_number')}
                          onChange={value => {
                            onChangeField('licence_number', value);
                          }}
                          onBlur={() => {
                            setValues(props.fieldsAddAthtlete);
                          }}
                          value={props.fieldsAddAthtlete.licence_number}
                          touched={touched.licence_number}
                          error={errors.licence_number}
                        />

                        <Input
                          textContentType="username"
                          placeholder={i18n.t('competition:club')}
                          onChange={value => {
                            onChangeField('club', value);
                          }}
                          onBlur={() => {
                            setValues(props.fieldsAddAthtlete);
                          }}
                          value={props.fieldsAddAthtlete.club}
                          touched={touched.club}
                          error={errors.club}
                        />

                        <Input
                          textContentType="username"
                          placeholder={i18n.t('competition:dossard')}
                          onChange={value => {
                            onChangeField('dossard', value);
                          }}
                          onBlur={() => {
                            setValues(props.fieldsAddAthtlete);
                          }}
                          value={props.fieldsAddAthtlete.dossard}
                          touched={touched.dossard}
                          error={errors.dossard}
                        />

                        <Button
                          onPress={e => {
                            setValues(props.fieldsAddAthtlete);
                            handleSubmit(e);
                          }}
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
    backgroundColor: colors.ffa_blue_light,
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
    minWidth: Platform.OS === 'windows' ? 300 : '50%',
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  buttonDeleteAthlete: {
    borderWidth: 2,
    backgroundColor: colors.red,
    borderColor: colors.red_light,
    borderRadius: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default ModalAddAthlete;
