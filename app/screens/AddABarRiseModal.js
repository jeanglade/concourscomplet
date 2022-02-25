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

const AddABarRiseModal = props => {
  // Initialisation des variables
  const [t] = useTranslation();
  const toast = useToast();
  const [modalVisible, setModalVisible] = useState(false);

  // Champs obligatoires
  const [barRise, setBarRise] = useState();

  const validateFormAthlete = () => {
    if (barRise == null) {
      toast.show(t('toast:required_fields_error'), {
        type: 'danger',
        placement: 'top',
      });
    } else {
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
              {t('competition:add_a_bar_rise')}
            </Text>
            <View style={styles.fieldForm}>
              <Text style={styles.text}>{t('competition:bar_rise')} :</Text>
              <TextInput
                style={styles.textinput}
                onChangeText={onChangeFirstnameAthlete}
                value={firstnameAthlete}
                // Numeric et supp à l'autre
              />
              <Text style={{color: 'red', paddingLeft: 10}}>*</Text>
            </View>
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

export default AddABarRiseModal;
