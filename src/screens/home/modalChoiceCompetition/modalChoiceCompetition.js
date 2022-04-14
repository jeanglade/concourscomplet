import React, {useState} from 'react';
import {styleSheet} from '_config';
import {Modal, Button, Dropdown} from '_components';
import {Image, View, Text} from 'react-native';
import i18n from 'i18next';

const ModalChoiceCompetition = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    i18n.t('common:choice_comp'),
  );

  return (
    <>
      <Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        buttonStyleView={styleSheet.icon}
        buttonContent={
          <Image
            style={styleSheet.icon20}
            source={require('../../icons/search.png')}
          />
        }
        buttonTooltip={i18n.t('common:choice_comp')}
        contentModal={
          <View>
            <Dropdown
              styleContainer={{width: 600, marginTop: 40, marginHorizontal: 5}}
              onValueChange={(value, index) => {
                if (index > 0)
                  setSelectedValue(props.allCompetitions[index - 1]);
              }}
              placeholder={i18n.t('common:choice_comp')}
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
                if (selectedValue != i18n.t('common:choice_comp')) {
                  props.setChoiceCompetition(selectedValue);
                }
                setModalVisible(false);
              }}
              styleView={[styleSheet.button]}
              content={
                <Text style={[styleSheet.text, styleSheet.textWhite]}>
                  {i18n.t('common:validate')}
                </Text>
              }
            />
          </View>
        }
      />
    </>
  );
};

export default ModalChoiceCompetition;
