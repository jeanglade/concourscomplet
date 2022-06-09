import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {styleSheet} from '_config';
import {MyButton} from '_components';

const MyDataTable = props => {
  return (
    <View style={[styleSheet.flex1, {marginTop: 20}]}>
      <View
        style={[styleSheet.flexRow, {marginHorizontal: 10, paddingBottom: 5}]}>
        {props.headerTable.map(item => {
          var res = null;
          if (item?.type === 'text') {
            res = (
              <View
                style={[
                  item?.flex && {flex: item?.flex},
                  item?.width && {width: item?.width},
                  item?.style,
                ]}>
                <Text style={[styleSheet.text, {fontSize: 13}]}>
                  {item?.text}
                </Text>
              </View>
            );
          } else {
            res = (
              <MyButton
                tooltip={item?.tooltip}
                styleView={item?.style}
                onPress={item?.onPress}
                content={item?.content}
              />
            );
          }
          return res;
        })}
      </View>
      <View style={styleSheet.flex1}>
        <FlatList
          contentContainerStyle={styleSheet.flexGrow1}
          data={props.tableData}
          renderItem={props.renderItem}
          keyExtractor={(item, index) => {
            return index;
          }}
        />
      </View>
    </View>
  );
};

export default MyDataTable;
