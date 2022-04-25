import React from 'react';
import {styleSheet, colors} from '_config';
import {
  MyModal,
  MyButton,
  MyInput,
  MyDropdown,
  MyDateTimePicker,
} from '_components';
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
import {getStatusColor} from '../../../utils/convertor';

const ModalAddAthlete = props => {
  const setDateFormat = date => {
    return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
  };

  const getLastIdResultat = () => {
    return Math.max(
      ...props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.map(
        athlete => parseInt(athlete.$id),
      ),
    );
  };

  const getLastNumCouloir = () => {
    return Math.max(
      ...props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.map(
        athlete => parseInt(athlete.NumCouloir),
      ),
    );
  };

  const isAthleteExist = athlete => {
    return (
      props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.filter(
        athleteData => {
          athleteData.Athlete.Prenom === athlete.Athlete.Prenom &&
            athleteData.Athlete.Nom === athlete.Athlete.Nom &&
            athleteData.Athlete.Sexe === athlete.Athlete.Sexe &&
            athleteData.Athlete.Categorie === athlete.Athlete.Categorie &&
            athleteData.Athlete.Club === athlete.Athlete.Club;
        },
      ).lenght > 0
    );
  };

  const setNewAthlete = (values, athlete) => {
    athlete.Athlete.Prenom =
      values.firstname.charAt(0).toUpperCase() + values.firstname.slice(1);
    athlete.Athlete.Nom = values.name.toUpperCase();
    athlete.Athlete.Sexe = values.sex;
    athlete.Athlete.Categorie =
      values.category !== i18n.t('competition:category') ? values.category : '';
    athlete.Athlete.Club =
      values.club !== ''
        ? values.club.charAt(0).toUpperCase() + values.club.slice(1)
        : '';
    athlete.Athlete.Licence = values.licence_number;
    athlete.Athlete.Nationalite = 'FRA';
    athlete.Athlete.DateNaissance = setDateFormat(values.birthDate);
    athlete.Athlete.Dossard = values.dossard;
    return athlete;
  };

  const saveContent = async () => {
    props.concoursData._.nbAthlete =
      props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats?.length;
    //Changement du statut du concours
    if (props.concoursData._.statut === i18n.t('common:ready')) {
      props.concoursData._.statut = i18n.t('common:in_progress');
      props.concoursData._.statutColor = getStatusColor(
        props.concoursData._.statut,
      );
    }
    await setFile(
      props.concoursData?._?.id,
      JSON.stringify(props.concoursData),
    );
  };

  const handleSubmitForm = actions => {
    const values = props.fieldsAddAthtlete;
    if (values.firstname !== '') {
      var newAthlete = null;
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
          props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.push(
            newAthlete,
          );
          actions.setSubmitting(false);
          actions.resetForm({
            values: props.fieldsAddAthtlete,
          });
          saveContent();
          showMessage({
            message: 'Athlète ajouté',
            type: 'success',
          });
        } else {
          showMessage({
            message: 'Athlète déjà présent dans ce concours.',
            type: 'danger',
          });
        }
      } else {
        props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
          props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.findIndex(
            a => a.$id === props.fieldsAddAthtlete?.resultat.$id,
          )
        ] = setNewAthlete(values, props.fieldsAddAthtlete?.resultat);
        saveContent();
        showMessage({
          message: 'Athlète modifié',
          type: 'success',
        });
      }
      props.setModalVisible(false);
    }
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
      props.fieldsAddAthtlete?.firstname?.toString() +
        ' ' +
        props.fieldsAddAthtlete?.name?.toString(),
      [
        {
          text: i18n.t('toast:cancel'),
        },
        {
          text: i18n.t('toast:ok'),
          onPress: async () => {
            props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.splice(
              props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.findIndex(
                a => a.$id === props.fieldsAddAthtlete?.resultat.$id,
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
    const result = categoryEasyValues.filter(cat => cat.id === category);
    return result.length > 0 ? result[0].name : category;
  };

  return (
    <MyModal
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      buttonStyleView={[styleSheet.icon, {backgroundColor: colors.muted}]}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonTooltip={i18n.t('competition:add_an_athlete')}
      buttonContent={
        <Image
          style={styleSheet.icon20}
          source={require('../../icons/add_athlete.png')}
        />
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
              <View style={styleSheet.flexRowCenter}>
                <Text style={styleSheet.textTitle}>
                  {props.fieldsAddAthtlete?.type === 'new'
                    ? i18n.t('competition:add_an_athlete')
                    : i18n.t('competition:edit_an_athlete')}
                </Text>
                {props.fieldsAddAthtlete?.type === 'modify' && (
                  <MyButton
                    onPress={alertDeleteAthlete}
                    styleView={[
                      styleSheet.buttonDelete,
                      styleSheet.backRed,
                      {marginLeft: 5},
                    ]}
                    content={
                      <Image
                        style={styleSheet.icon10}
                        source={require('../../../icons/delete.png')}
                      />
                    }
                  />
                )}
              </View>
              <View style={styles.content}>
                <Formik
                  initialValues={
                    props.fieldsAddAthtlete !== undefined
                      ? props.fieldsAddAthtlete
                      : {}
                  }
                  onSubmit={(values, actions) => handleSubmitForm(actions)}
                  validationSchema={ValidatorsAddAthlete}
                  validateOnBlur={false}
                  validateOnChange={false}>
                  {({
                    handleSubmit,
                    setValues,
                    values,
                    errors,
                    touched,
                    validateForm,
                  }) => {
                    return (
                      <View style={styles.form}>
                        <View style={styles.field}>
                          <MyInput
                            type="nickname"
                            placeholder={i18n.t('competition:firstname') + ' *'}
                            onChange={value => {
                              onChangeField('firstname', value);
                              props.setFieldsAddAthtlete(oldFields => ({
                                ...oldFields,
                                firstname: value,
                              }));
                            }}
                            onBlur={value => {
                              setValues(props.fieldsAddAthtlete);
                            }}
                            value={props.fieldsAddAthtlete?.firstname}
                            touched={touched.firstname}
                            error={errors.firstname}
                          />
                        </View>

                        <View style={styles.field}>
                          <MyInput
                            type="familyName"
                            placeholder={i18n.t('competition:name') + ' *'}
                            onChange={value => {
                              onChangeField('name', value);
                              props.setFieldsAddAthtlete(oldFields => ({
                                ...oldFields,
                                name: value,
                              }));
                            }}
                            onBlur={() => {
                              setValues(props.fieldsAddAthtlete);
                            }}
                            value={props.fieldsAddAthtlete?.name}
                            touched={touched.name}
                            error={errors.name}
                          />
                        </View>

                        <View style={styles.field}>
                          <MyDateTimePicker
                            value={props.fieldsAddAthtlete?.birthDate}
                            touched={touched.birthDate}
                            error={errors.birthDate}
                            onValueChange={value => {
                              if (value !== undefined) {
                                onChangeField('birthDate', value);
                                setValues(props.fieldsAddAthtlete);
                              }
                            }}
                          />
                        </View>

                        <View
                          style={{
                            flexDirection:
                              Platform.OS === 'ios' ? 'row' : 'column',
                            justifyContent:
                              Platform.OS === 'ios'
                                ? 'space-around'
                                : 'flex-start',
                          }}>
                          <View style={styles.field}>
                            <MyDropdown
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
                              selectedValue={props.fieldsAddAthtlete?.sex}
                              touched={touched.sex}
                              error={errors.sex}
                            />
                          </View>

                          <View style={styles.field}>
                            <MyDropdown
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
                              selectedValue={props.fieldsAddAthtlete?.category}
                            />
                          </View>
                        </View>

                        <View style={styles.field}>
                          <MyInput
                            type="username"
                            placeholder={i18n.t('competition:licence_number')}
                            onChange={value => {
                              onChangeField('licence_number', value);
                            }}
                            onBlur={() => {
                              setValues(props.fieldsAddAthtlete);
                            }}
                            value={props.fieldsAddAthtlete?.licence_number}
                            touched={touched.licence_number}
                            error={errors.licence_number}
                          />
                        </View>

                        <View style={styles.field}>
                          <MyInput
                            type="username"
                            placeholder={i18n.t('competition:club')}
                            onChange={value => {
                              onChangeField('club', value);
                            }}
                            onBlur={() => {
                              setValues(props.fieldsAddAthtlete);
                            }}
                            value={props.fieldsAddAthtlete?.club}
                            touched={touched.club}
                            error={errors.club}
                          />
                        </View>

                        <View style={styles.field}>
                          <MyInput
                            type="username"
                            placeholder={i18n.t('competition:dossard')}
                            onChange={value => {
                              onChangeField('dossard', value);
                            }}
                            onBlur={() => {
                              setValues(props.fieldsAddAthtlete);
                            }}
                            value={props.fieldsAddAthtlete?.dossard}
                            touched={touched.dossard}
                            error={errors.dossard}
                            keyboardType="numeric"
                          />
                        </View>

                        <View style={styles.field}>
                          <MyButton
                            onPress={async e => {
                              await setValues(props.fieldsAddAthtlete);
                              handleSubmit(e);
                            }}
                            styleView={[
                              styleSheet.button,
                              {marginHorizontal: 5},
                            ]}
                            content={
                              <Text
                                style={[styleSheet.text, styleSheet.textWhite]}>
                                {i18n.t('common:validate')}
                              </Text>
                            }
                          />
                        </View>
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
  container: {
    minWidth: 400,
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 10,
  },
  field: {
    marginVertical: 5,
  },
});

export default ModalAddAthlete;
