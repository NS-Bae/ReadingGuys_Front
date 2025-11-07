import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { DataTable } from 'react-native-paper';

import { decryptedUserInfo } from '../types';

interface TableComponentProps
{
  info: decryptedUserInfo;
}

const InfoTable: React.FC<TableComponentProps> = ({ info }) => {
  return (
    <DataTable>
      <DataTable.Row style={styles.table_row}>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text0}>ID</DataTable.Cell>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text1}>{ info.rawUserId }</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row style={styles.table_row}>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text0}>이름</DataTable.Cell>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text1}>{ info.rawUserName }</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row style={styles.table_row}>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text0}>소속학원이름</DataTable.Cell>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text1}>{ info.rawAcademyName }</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row style={styles.table_row}>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text0}>역할</DataTable.Cell>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text1}>{ info.userType }</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Row style={styles.table_row}>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text0}>활성화여부</DataTable.Cell>
        <DataTable.Cell style={styles.table_cell} textStyle={styles.table_text1}>{ info.ok ? '⭕ 활성화' : '❌ 비활성화' }</DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

export default InfoTable;

const styles = StyleSheet.create({
  table_row: {
    borderWidth: 0,
    height: moderateScale(40),
    justifyContent: 'space-between',
  },
  table_cell: {
    justifyContent: 'center',
    borderWidth: 0,
  },
  table_text0: {
    lineHeight: moderateScale(26),
    fontSize: moderateScale(20),
    justifyContent: 'center',
  },
  table_text1: {
    lineHeight: moderateScale(26),
    fontSize: moderateScale(20),
    fontWeight: '900',
    justifyContent: 'center',
  },
});
