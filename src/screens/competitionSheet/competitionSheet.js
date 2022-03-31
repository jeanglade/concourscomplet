import React, {useState} from 'react';
import {StyleSheet, Text, SafeAreaView, View} from 'react-native';
import {colors} from '_config';
import {showMessage} from 'react-native-flash-message';
import {TableConcoursSb} from '_components';

function CompetitionSheet(props) {
  //Initialisation des données du concours
  const dataConcours = props.route.params.item;
  const compData = JSON.parse(dataConcours.data);
  const listAthlete =
    compData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0].LstResultats;
  const [tableData, setTableData] = useState(listAthlete);

  //Options
  // const [optionAddAthlete, setOptionAddAthlete] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.titleText}>
          {dataConcours.epreuve} - {dataConcours.dateInfo}
        </Text>
      </View>
      {compData.EpreuveConcoursComplet.CodeFamilleEpreuve === 'SB' && (
        <TableConcoursSb
          showMessage={showMessage}
          dataConcours={dataConcours}
          tableData={tableData}
          setTableData={setTableData}
          compData={compData}
        />
      )}

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
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
    paddingVertical: 10,
  },
});

export default CompetitionSheet;
