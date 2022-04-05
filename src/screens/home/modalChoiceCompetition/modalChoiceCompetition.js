import React, {useEffect, useState} from 'react';
import {colors} from '_config';
import {Modal, Button, Dropdown} from '_components';
import {Image, StyleSheet, View, Text} from 'react-native';
import i18n from 'i18next';

const ModalChoiceCompetition = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    setSelectedValue(props.competition);
  }, []);

  const selectedVal = index => {
    setSelectedValue(props.allCompetitions[index]);
  };

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
          <Text style={styles.titleText}>{i18n.t('common:choice_comp')}</Text>
          <Dropdown
            styleContainer={{width: 600}}
            onValueChange={(value, index) => {
              selectedVal(index);
            }}
            data={props.allCompetitions.map(compete => {
              return {
                label: compete.competitionInfo,
                value: compete,
              };
            })}
            selectedValue={selectedValue}
          />
          <Button
            onPress={() => {
              props.setChoiceCompetition(selectedValue);
              setModalVisible(false);
            }}
            styleView={styles.button}
            content={
              <Text style={styles.textButton}>{i18n.t('common:validate')}</Text>
            }
          />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  iconPosition: {
    width: 55,
    height: 55,
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
    borderWidth: 3,
    borderColor: colors.ffa_blue_light,
  },
  textButton: {
    color: colors.white,
    fontSize: 16,
  },
});

export default ModalChoiceCompetition;
