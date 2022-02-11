import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  View,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import R from '../assets/R';
import {render} from 'react-dom';

function HomeScreen(props) {
  const [t] = useTranslation();
  const [codeCompetition, onChangeText] = useState();
  const onPress = () => {
    props.navigation.navigate('CompetitionSheet');
  };
  const validateCompetitionCode = () => {
    props.navigation.navigate('CompetitionSheet');
  };
  const openDeviceFiles = () => {
    props.navigation.navigate('CompetitionSheet');
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
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
            onChangeText={onChangeText}
            placeholder="1234567"
            placeholderTextColor={R.colors.muted}
            value={codeCompetition}
          />
          <TouchableWithoutFeedback onPress={validateCompetitionCode}>
            <View style={styles.button}>
              <Text>{t('common:validate')}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={openDeviceFiles}>
            <View style={styles.button}>
              <Text>{t('common:via_local_file')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text style={styles.titleText}>
          {t('common:list_competion_sheets')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: R.colors.white,
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
    padding: 10,
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
});

export default HomeScreen;
