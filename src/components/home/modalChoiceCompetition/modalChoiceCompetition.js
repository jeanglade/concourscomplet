import React, {useState} from 'react';
import {colors} from '_config';
import {Modal, Button} from '_components';
import {Image, StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {DropdownCompetition} from '_homeComponents';

const ModalChoiceCompetition = props => {
  const [t] = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [competitionTemp, setCompetitionTemp] = useState(props.competition);

  return (
    <Modal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      buttonStyleView={styles.iconPosition}
      buttonContent={
        <Image style={styles.icon} source={require('../../icons/search.png')} />
      }
      contentModal={
        <View>
          <Text style={styles.titleText}>{t('common:choice_comp')}</Text>
          <DropdownCompetition
            competition={competitionTemp}
            setCompetition={setCompetitionTemp}
            allCompetitions={props.allCompetitions}
          />
          <Button
            onPress={() => {
              props.setCompetition(competitionTemp);
              setModalVisible(false);
            }}
            styleView={styles.button}
            content={
              <Text style={styles.textButton}>{t('common:validate')}</Text>
            }
          />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  iconPosition: {
    top: 15,
    right: 70,
    position: 'absolute',
    backgroundColor: colors.ffa_blue_dark,
    padding: 10,
    margin: 5,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.ffa_blue_light,
  },
  icon: {
    width: 30,
    height: 30,
  },
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: colors.ffa_blue_dark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 15,
    borderWidth: 3,
    borderColor: colors.ffa_blue_light,
  },
  textButton: {
    color: colors.white,
    fontSize: 16,
  },
});

export default ModalChoiceCompetition;
