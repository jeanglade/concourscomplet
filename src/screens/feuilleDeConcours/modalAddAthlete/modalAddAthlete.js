import React, {useState} from 'react';
import {colors} from '_config';
import {Modal, Button, Input} from '_components';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from 'react-native';
import i18n from 'i18next';
import {Formik} from 'formik';
import Validators from '../../utils/validators';

const ModalAddAthlete = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingButtonConfirm, setLoadingButtonConfirm] = useState(false);

  const handleSubmitForm = values => {};

  return (
    <Modal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      buttonStyleView={{}}
      buttonContent={
        <Text style={styles.button}>
          {i18n.t('competition:add_an_athlete')}
        </Text>
      }
      contentModal={
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
            behavior="padding"
            enabled
            keyboardVerticalOffset={0}>
            <ScrollView>
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
                          secureTextEntry={true}
                          textContentType="text"
                          placeholder={i18n.t('competition:firstname')}
                          onChange={handleChange('firstname')}
                          value={values.firstname}
                          touched={touched.firstname}
                          error={errors.firstname}
                        />

                        <Input
                          secureTextEntry={true}
                          textContentType="text"
                          placeholder={i18n.t('competition:firstname')}
                          onChange={handleChange('firstname')}
                          value={values.firstname}
                          touched={touched.firstname}
                          error={errors.firstname}
                        />

                        <View style={styles.confirmButton}>
                          <Button
                            label="Confirmer"
                            disabled={isSubmitting || !dirty}
                            onPress={handleSubmit}
                            loading={loadingButtonConfirm}
                          />
                        </View>
                      </View>
                    );
                  }}
                </Formik>
              </View>

              <form onSubmit={formik.handleSubmit}>
                <label htmlFor="firstname">
                  {i18n.t('competition:firstname')}
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.firstname}
                />

                <label htmlFor="name">{i18n.t('competition:name')}</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />

                <button type="submit">Submit</button>
              </form>

              <View style={styles.fieldForm}>
                <Text style={styles.text}>{i18n.t('competition:sex')} :</Text>
                <View style={styles.dropdown}>
                  <Picker
                    selectedValue={sexAthlete}
                    dropdownIconColor={colors.black}
                    onValueChange={value => {
                      onChangeSexAthlete(value);
                    }}
                    mode="dropdown">
                    <Picker.Item
                      style={styles.dropdownItem}
                      label=""
                      value=""
                    />
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
                <Text style={styles.text}>
                  {i18n.t('competition:birth_date')} :
                </Text>
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
                  {i18n.t('competition:licence_number')} :
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
                <Text style={styles.text}>{i18n.t('competition:club')} :</Text>
                <TextInput
                  style={styles.textinput}
                  onChangeText={onChangeClubAthlete}
                  value={clubAthlete}
                />
              </View>
              <View style={styles.fieldForm}>
                <Text style={styles.text}>
                  {i18n.t('competition:category')} :
                </Text>
                <TextInput
                  style={styles.textinput}
                  onChangeText={onChangeCategoryAthlete}
                  value={categoryAthlete}
                />
              </View>
              <Text
                style={{width: 500, color: colors.black, textAlign: 'right'}}>
                * : {i18n.t('common:required')}
              </Text>
              <View style={{marginTop: 15, maxWidth: 500}}>
                <TouchableWithoutFeedback onPress={validateFormAthlete}>
                  <View style={styles.button}>
                    <Text>{i18n.t('common:validate')}</Text>
                  </View>
                </TouchableWithoutFeedback>
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
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_dark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 3,
    borderColor: colors.ffa_blue_light,
  },
  textButton: {
    color: colors.white,
    fontSize: 16,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    marginTop: 100,
    marginHorizontal: 25,
  },
});

export default ModalAddAthlete;
