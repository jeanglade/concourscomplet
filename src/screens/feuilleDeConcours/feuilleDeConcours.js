import React, {useState} from 'react';
import {StyleSheet, Text, SafeAreaView, View} from 'react-native';
import i18n from 'i18next';

import {TableConcoursSb} from '_concoursComponents';
import {colors} from '_config';

function FeuilleDeConcours(props) {
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
        <Text style={styles.titleText}>{i18n.i18n.t('common:options')} : </Text>
        <TouchableWithoutFeedback onPress={() => setAddAnAthleteVisible(true)}>
          <Text style={styles.button}>{i18n.i18n.t('competition:add_an_athlete')}</Text>
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

export default FeuilleDeConcours;
