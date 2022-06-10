import { makeStyles } from '@mui/styles';
import ColorCodes from '../../assets/theme/colorCodes';

export const useStyles = makeStyles({
  successMsg: {
    border: `1px solid ${ColorCodes.successMsgBorder} !important`,
    backgroundColor: `${ColorCodes.successMsgBg} !important`
  },
  pandingMsg: {
    border: `1px solid ${ColorCodes.pendingMsgBorder} !important`,
    backgroundColor: `${ColorCodes.pendingMsgBg} !important`
  },
  alertBox: {
    borderRadius: 4,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'flex-start !important',
    border: `1.5px solid ${ColorCodes.errorMsgBorder}`,
    backgroundColor: ColorCodes.errorMsgBg,
    '& p': {
      border: 'none',
      margin: 0,
      color: '#000',
      fontSize: 14,
      letterSpacing: -0.01,
      lineHeight: '24px'
    },
    '& a': {
      paddingLeft: 5,
      '&:hover': { textDecoration: 'underline' }
    }
  }
});
