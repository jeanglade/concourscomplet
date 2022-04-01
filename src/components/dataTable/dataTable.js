import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {colors} from '_config';
import {Button} from '_components';

const DataTable = props => {
  return (
    <View style={styles.flex1}>
      <View style={styles.headerTable}>
        {props.headerTable.map((item, index) => {
          var res = null;
          if (item.type === 'text') {
            res = (
              <View style={{flex: item.flex}}>
                <Text style={styles.text}>{item.text}</Text>
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
      <View style={styles.flex1}>
        <FlatList
          contentContainerStyle={styles.flexGrow1}
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

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  text: {
    color: colors.black,
    fontSize: 16,
  },
  headerTable: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingBottom: 5,
    marginTop: 20,
  },
});

export default DataTable;
