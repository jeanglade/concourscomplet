import React from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import R from '../assets/R';

function CompetitionSheetScreen(props) {
  const [t] = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titleText}>{t('common:competition_sheet')}</Text>
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
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: R.colors.ffa_blue_light,
    padding: 10,
    marginVertical: 15,
  },
});

export default CompetitionSheetScreen;
