import React, {useState} from 'react';
import {colors} from '_config';
import {Modal, Button, Input, Dropdown} from '_components';
import moment from 'moment';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import i18n from 'i18next';
import {Formik} from 'formik';
import Validators from '../../utils/validators';
import DateTimePicker from '@react-native-community/datetimepicker';

const ModalAddAthlete = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sex, setSex] = useState(i18n.t('competition:sex'));
  const [category, setCategory] = useState(i18n.t('competition:category'));
  const setDateFormat = date => {
    return moment(date, moment.ISO_8601).format(
      i18n.language == 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
    );
  };

  const [birthDate, setBirthDate] = useState(new Date());
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);

  const maxHeightField = 55;
  const handleSubmitForm = values => {
    console.log('handleSubmitForm', values);
  };

  const sexValues = ['H', 'F', 'X'];
  const setSexValue = index => {
    if (index > 0) {
      setSex(sexValues[index - 1]);
    }
  };

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
  const setCategoryValue = index => {
    setCategory(categoryValues[index - 1]);
  };

  const setBirthDateValue = (event, date) => {
    if (date !== undefined) {
      setBirthDate(date);
    }
    setDateTimePickerVisible(false);
  };

  return (
    <Modal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
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
                  initialValues={{
                    firstname: '',
                    name: '',
                    sex: i18n.t('competition:sex'),
                    licence_number: '',
                    club: '',
                    category: i18n.t('competition:category'),
                  }}
                  onSubmit={values => handleSubmitForm(values)}
                  validationSchema={Validators}>
                  {({
                    handleChange,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                    dirty,
                  }) => {
                    return (
                      <View style={styles.form}>
                        <Input
                          textContentType="nickname"
                          placeholder={i18n.t('competition:firstname') + ' *'}
                          onChange={handleChange('firstname')}
                          value={values.firstname}
                          touched={touched.firstname}
                          error={errors.firstname}
                        />

                        <Input
                          textContentType="familyName"
                          placeholder={i18n.t('competition:name') + ' *'}
                          onChange={handleChange('name')}
                          value={values.name}
                          touched={touched.name}
                          error={errors.name}
                        />

                        <View
                          style={{
                            flexDirection:
                              Platform.OS === 'ios' ? 'row' : column,
                            justifyContent:
                              Platform.OS === 'ios'
                                ? 'space-around'
                                : 'flex-start',
                          }}>
                          <Dropdown
                            styleContainer={{}}
                            stylePickerIOS={{width: 200}}
                            placeholder={i18n.t('competition:sex') + ' *'}
                            onValueChange={(value, index) => {
                              setSexValue(index);
                            }}
                            data={sexValues.map(v => ({
                              label: v,
                              value: v,
                            }))}
                            selectedValue={sex}
                          />

                          <Dropdown
                            styleContainer={{}}
                            stylePickerIOS={{width: 200}}
                            placeholder={i18n.t('competition:category')}
                            onValueChange={(value, index) => {
                              setCategoryValue(index);
                            }}
                            data={categoryValues.map((v, index) => ({
                              label: categoryEasyValues[index],
                              value: v,
                            }))}
                            selectedValue={category}
                          />
                        </View>

                        <View
                          style={{
                            color: colors.black,
                            borderWidth: 2,
                            borderColor: colors.muted,
                            marginBottom: 10,
                            fontSize: 16,
                            borderRadius: Platform.OS === 'ios' ? 50 : 0,

                            maxHeight: maxHeightField,
                            backgroundColor:
                              Platform.OS === 'windows'
                                ? colors.muted
                                : colors.white,
                          }}>
                          {Platform.OS === 'android' ? (
                            <Button
                              styleView={{padding: 15}}
                              onPress={() => setDateTimePickerVisible(true)}
                              content={
                                <>
                                  <Text
                                    style={{
                                      color:
                                        setDateFormat(birthDate).toString() !==
                                        setDateFormat(new Date()).toString()
                                          ? colors.black
                                          : colors.muted,
                                    }}>
                                    {setDateFormat(birthDate)}
                                  </Text>
                                  {dateTimePickerVisible && (
                                    <DateTimePicker
                                      value={birthDate}
                                      maximumDate={new Date()}
                                      onChange={setBirthDateValue}
                                    />
                                  )}
                                </>
                              }
                            />
                          ) : (
                            <DateTimePicker
                              style={{
                                height: maxHeightField,
                                width: 280,
                              }}
                              value={birthDate}
                              maximumDate={new Date()}
                              onChange={setBirthDateValue}
                            />
                          )}
                        </View>

                        <Input
                          textContentType="username"
                          placeholder={i18n.t('competition:licence_number')}
                          onChange={handleChange('licence_number')}
                          value={values.licence_number}
                          touched={touched.licence_number}
                          error={errors.licence_number}
                        />

                        <Input
                          textContentType="username"
                          placeholder={i18n.t('competition:club')}
                          onChange={handleChange('club')}
                          value={values.club}
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
