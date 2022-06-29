import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  stepper: {
    '& .MuiStepLabel-root': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& .MuiStepLabel-iconContainer': {
        [`& svg[data-testid="DoneIcon"]`]: {
          boxSizing: 'content-box',
          padding: 5,
          borderRadius: 50,
          backgroundColor: '#00C48C',
          color: '#fff',
          fontSize: 18
        },
        [`& svg[data-testid="HourglassEmptyIcon"]`]: {
          boxSizing: 'content-box',
          padding: 5,
          borderRadius: 50,
          backgroundColor: '#F18D5A',
          color: '#fff',
          fontSize: 18
        },
        [`& svg[data-testid="ErrorIcon"]`]: {
          boxSizing: 'content-box',
          padding: 5,
          borderRadius: 50,
          backgroundColor: '#EF5265',
          color: '#fff',
          fontSize: 18
        }
      },
      '& .MuiStepLabel-label': {
        color: '#9B9B9B',
        fontSize: 14,
        letterSpacing: 0.15,
        lineHeight: '20px',
        textAlign: 'center'
      },
      '& .MuiSvgIcon-root': { fontSize: 28 },
      '& .MuiStepLabel-labelContainer': {
        '& .Mui-active': { color: '#212121' }
      }
    }
  },
  adaEthTokenAndValueContainer: {
    '& hr': { paddingTop: 12 }
  },
  amtSymbolAndValueContainer: {
    padding: '0 41px 0 47px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& p': {
      padding: 0,
      border: 'none',
      fontWeight: 600
    }
  },
  tokenAndAmtContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& p': {
      border: 'none',
      color: '#9B9B9B',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '12px'
    },
    '& div': {
      '& span': {
        color: '#212121',
        fontSize: 20,
        fontWeight: 600,
        lineHeight: '28px',
        '&:first-of-type': { paddingRight: 5 }
      }
    }
  },
  inputBoxAndCopyBtnContainer: {
    margin: '32px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .MuiFormControl-root': {
      width: 388,
      '& label': {
        color: '#333',
        fontSize: 16,
        letterSpacing: 0.4,
        lineHeight: '16px'
      },
      '& input.Mui-disabled': {
        '-webkit-text-fill-color': '#212121',
        fontSize: 16,
        letterSpacing: 0.15,
        lineHeight: '24px',
        textOverflow: 'ellipsis'
      }
    },
    '& button': {
      padding: '6px 44px',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: 1.25,
      '@media(max-width:680px)': { marginTop: 15 }
    },
    '@media(max-width:680px)': { flexDirection: 'column' }
  },
  btnContainer: {
    marginTop: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& button': {
      padding: '10px 24px',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: 1.25,
      lineHeight: '16px',
      '&:first-of-type': { marginRight: 32 }
    }
  },
  successMsgIconContainer: {
    margin: '0 0 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& h3': {
      color: '#9B9B9B',
      fontSize: 16,
      fontWeight: 600,
      lineHeight: '28px'
    },
    '& svg': { color: '#00C48C' }
  },
  receiptList: {
    borderBottom: '1px solid #ebebeb',
    padding: '10px 22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    '& p': {
      color: '#666',
      fontSize: 16,
      lineHeight: '40px'
    }
  },
  processingStatus: {
    marginTop: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& span': {
      border: 'none',
      color: '#9B9B9B',
      fontSize: 16,
      fontWeight: 600,
      lineHeight: '28px',
      textAlign: 'center',
      '& svg': { color: '#2086ff' }
    },
    '& p': {
      border: 'none',
      marginTop: 15,
      color: '#212121',
      fontSize: 16,
      lineHeight: '20px'
    }
  },
  checkCircleIcon: {
    color: '#00C48C',
    fontSize: 48
  }
});
