import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {colors, styleSheet} from '_config';
import {Button} from '_components';

const DataTable = props => {
  return (
    <View style={[styleSheet.flex1, {marginTop: 20}]}>
      <View style={[styleSheet.flexRow, {paddingLeft: 10, paddingBottom: 5}]}>
        {props.headerTable.map((item, index) => {
          var res = null;
          if (item.type === 'text') {
            res = (
              <View style={{flex: item.flex}}>
                <Text style={styleSheet.text}>{item.text}</Text>
              </View>
            );
          } else {
            res = (
              <Button
                styleView={item.style}
                onPress={item.onPress}
                content={item.content}
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

export default DataTable;
