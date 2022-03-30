import React, {useState} from 'react';
import {StyleSheet, Text, SafeAreaView, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';
import {showMessage} from 'react-native-flash-message';
import {TableConcoursSb} from '_components';

function CompetitionSheet(props) {
  const [t] = useTranslation();

  //Initialisation des données du concours
  const dataConcours = props.route.params.item;
  const compData = JSON.parse(dataConcours.data);
  const listAthlete =
    compData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0].LstResultats;
  const [tableData, setTableData] = useState(listAthlete);

  //Options
  const [optionAddAthlete, setOptionAddAthlete] = useState(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        padding: 10,
      }}>
      <View>
        <Text style={styles.titleText}>
          {dataConcours.epreuve} - {dataConcours.dateInfo}
        </Text>
      </View>

      <TableConcoursSb
        showMessage={showMessage}
        dataConcours={dataConcours}
        tableData={tableData}
        setTableData={setTableData}
        compData={compData}
      />

      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingBottom: 20,
        }}>
        <Text style={styles.titleText}>{t('common:options')} : </Text>
        <TouchableWithoutFeedback onPress={() => setAddAnAthleteVisible(true)}>
          <Text style={styles.button}>{t('competition:add_an_athlete')}</Text>
        </TouchableWithoutFeedback>
        <AddAnAthleteModal
          modalVisible={addAnAthleteVisible}
          setModalVisible={setAddAnAthleteVisible}
          setAthletesData={setTableData}
          athletesData={tableData}
        />
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
    paddingVertical: 10,
  },
});

export default CompetitionSheet;
