import React from 'react';

import {
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Table, Row, Cell, TableWrapper} from 'react-native-table-component';
import {useTranslation} from 'react-i18next';
import {useToast} from 'react-native-toast-notifications';

import R from '../assets/R';

function DataTable(props) {
  const toast = useToast();
  const [t] = useTranslation();
  const tableState = props.tableState;

  function componentTable(index, data, type) {
    code = '';
    switch (type) {
      case 'button':
        code = (
          <TouchableWithoutFeedback
            onPress={() => toast.show(`This is row ${index + 1}`)}>
            <View style={styles.cell}>
              <Text style={styles.cellButton}>{data}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
        break;
      case 'text':
        code = (
          <View style={styles.cell}>
            <Text style={styles.cellText}>{data}</Text>
          </View>
        );
        break;
      case 'textInput':
        code = (
          <View style={styles.cell}>
            <TextInput style={styles.cellTextInput} value={data} />
          </View>
        );
        break;
    }
    return code;
  }

  return (
    <View>
      <Table style={styles.headerTable}>
        <Row
          data={tableState.headerTitles}
          flexArr={tableState.flexColumn}
          textStyle={styles.textHeaderTable}
        />
      </Table>
      <ScrollView>
        <Table>
          {tableState.data.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  width={
                    (tableState.maxWidth * tableState.flexColumn[cellIndex]) /
                    tableState.sumFlexValue
                  }
                  data={componentTable(
                    index,
                    cellData,
                    tableState.columnType[cellIndex],
                  )}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTable: {
    width: Dimensions.get('window').width - 20,
    paddingBottom: 10,
  },
  textHeaderTable: {
    color: R.colors.ffa_blue_light,
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    paddingVertical: 10,
    marginBottom: 5,
    backgroundColor: '#E7E6E1',
    width: Dimensions.get('window').width - 20,
    flexDirection: 'row',
    borderRadius: 5,
    maxHeight: 100,
  },
  cellText: {color: R.colors.black, fontSize: 16},
  cellButton: {
    backgroundColor: R.colors.ffa_blue_light,
    color: R.colors.white,
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  cellTextInput: {
    borderWidth: 1,
    color: R.colors.black,
    fontSize: 16,
    borderColor: R.colors.black,
    borderRadius: 5,
  },
  cell: {paddingHorizontal: 10},
});

export default DataTable;
