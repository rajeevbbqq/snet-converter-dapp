import { makeStyles } from '@mui/styles';
import { conversionStatuses } from '../../utils/ConverterConstants';

export const useStyles = makeStyles({
  columnsContainer: {
    width: '100%',
    padding: '0 12px',
    margin: '48px 0 7px',
    '& > div': { padding: '0 !important' },
    '& p': {
      color: '#9b9b9b',
      fontSize: 14,
      fontWeight: 600
    },
    '@media(max-width:1200px)': { display: 'none' }
  },
  transactionHistoryTable: { padding: '0 16px' },
  transactionHistoryHeader: {
    borderBottom: '1px solid #f5f7f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  refreshDataContainer: {
    padding: '11px 0',
    margin: '0 40px 0',
    '& button': {
      color: '#4086FF',
      fontSize: 14,
      lineHeight: '16px',
      textTransform: 'capitalize',
      '& svg': { fontSize: 18 }
    }
  },
  totalRecordsContainer: {
    '& p': {
      color: '#999',
      fontSize: 14,
      fontWeight: 300,
      lineHeight: '18px'
    }
  },
  colName: {
    opacity: 0.53,
    color: '#9B9B9B',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: '18px'
  },
  transactionDataRow: {
    width: '100%',
    padding: '10px 16px 10px 8px',
    borderTop: '1px solid #f5f7f8',
    margin: 0,
    '& > div': {
      padding: `0 !important`,
      display: 'flex',
      alignItems: 'center',
      '@media(max-width:1200px)': {
        width: '100%',
        marginTop: 20,
        display: 'flex !important',
        justifyContent: 'flex-start'
      }
    },
    '& p': {
      display: 'flex',
      fontSize: 14
    },
    '@media(max-width:1200px)': {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  fromToAddressContainer: {
    padding: 0,
    border: 'none',
    margin: '0 0 0 auto',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    background: 'transparent',
    cursor: 'pointer',
    '& p': {
      color: '#9B9B9B',
      fontSize: 11,
      fontStyle: 'italic',
      fontWeight: 300,
      letterSpacing: -0.18,
      lineHeight: '16px',
      textAlign: 'right'
    },
    '& svg': {
      marginLeft: 4,
      color: '#9b9b9b',
      fontSize: 10
    },
    '&:hover': {
      '& p': { color: '#4086ff' },
      '& svg': { color: '#4086ff' }
    },
    '@media(max-width:1200px)': { margin: 0 }
  },
  statusData: {
    paddingTop: 2,
    display: 'flex',
    justifyContent: 'center',
    '& svg': {
      marginRight: 4,
      fontSize: 16
    }
  },
  statusValueContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    '& p': {
      fontSize: 14,
      lineHeight: '18px'
    },
    [`& p[data-status-type="${conversionStatuses.ACTION_REQUIRED}"]`]: { color: 'F18D5A' },
    [`& p[data-status-type="${conversionStatuses.USER_INITIATED}"]`]: { color: '#2196F3' },
    [`& p[data-status-type="${conversionStatuses.WAITING_FOR_CLAIM}"]`]: { color: '#2196F3' },
    [`& p[data-status-type="${conversionStatuses.PROCESSING}"]`]: { color: '#2196F3' },
    [`& p[data-status-type="${conversionStatuses.CLAIM_INITIATED}"]`]: { color: '#2196F3' },
    [`& p[data-status-type="${conversionStatuses.FAILED}"]`]: { color: '#D0021B' },
    [`& p[data-status-type="${conversionStatuses.EXPIRED}"]`]: { color: '#D0021B' },
    [`& p[data-status-type="${conversionStatuses.SUCCESS}"]`]: { color: '#00C48C' }
  },
  expandedRow: {
    backgroundColor: '#FAFAFA',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)'
  },
  expandArrowContainer: {
    '& > button': {
      border: '3px solid #4086ff',
      color: '#4086FF',
      fontSize: 14,
      fontWeight: 600,
      padding: '8px 25px',
      letterSpacing: 1.25,
      lineHeight: '16px',
      '&:hover': { borderWidth: 3 }
    },
    '& div': {
      padding: 0,
      '& button': {
        padding: 0,
        '& svg': { fontSize: 24 }
      }
    }
  },
  expandedData: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f1f1f1'
  },
  expandedDataWrapper: {
    width: '100%',
    borderTop: '1px solid #f5f7f8',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noTransactionWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  expandedDataCol: {
    padding: '26px 20px 15px 36px',
    backgroundColor: '#fff',
    '& div p': {
      color: '#9B9B9B',
      fontSize: 14,
      letterSpacing: 0.17,
      lineHeight: '18px'
    },
    '@media(max-width:900px)': { display: 'none' }
  },
  expandedDataRows: {
    padding: '7px 20px 7px 36px',
    background: '#fff',
    marginTop: 2,
    '& > div': {
      '@media(max-width:900px)': {
        marginTop: 20,
        display: 'flex'
      }
    },
    '& span': {
      color: '#666',
      fontSize: 14,
      lineHeight: '18px',
      '& p': { fontWeight: 600 }
    }
  },
  detailsData: {
    '& a': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: 'inherit',
      '& span': {
        color: '#4086FF',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }
  },
  alignRight: {
    alignItems: 'flex-end !important',
    '@media(max-width: 1200px)': { alignItems: 'flex-start !important' }
  },
  // Pagination styles
  paginationContainer: {
    marginTop: 64,
    '& nav': {
      '& ul li': {
        '&:first-of-type button': { marginRight: 14 },
        '&:last-of-type button': { marginLeft: 14 },
        '& button': {
          minWidth: 24,
          height: 24,
          padding: 0,
          margin: 0,
          fontSize: 14,
          '& svg': { fontSize: 22 }
        }
      },
      '@media(max-width:680px)': { marginBottom: 20 }
    },
    '@media(max-width:680px)': { flexDirection: 'column' }
  },
  pageCountSection: { paddingRight: 22 },
  itemPerPageTxt: {
    paddingRight: 15,
    color: '#9B9B9B',
    fontSize: 14,
    lineHeight: '18px',
    textAlign: 'right'
  },
  pageListformControl: {
    width: 73,
    marginRight: 12,
    '& div': {
      '& div': {
        padding: '2px 13px',
        fontSize: 16
      },
      '& svg': { fontSize: 22 }
    },
    '& fieldset': {
      top: 0,
      '& legend': { display: 'none' }
    }
  },
  id: { cursor: 'default' },
  responsiveColName: {
    paddingRight: 20,
    display: 'none',
    color: '#9b9b9b',
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    '@media(max-width:1200px)': { display: 'block' }
  },
  responsiveExpandedColName: {
    paddingRight: 15,
    display: 'none',
    color: '#212121',
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    '@media(max-width:900px)': { display: 'block' }
  }
});
