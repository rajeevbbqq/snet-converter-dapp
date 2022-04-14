import { makeStyles } from '@mui/styles';
import ColorCodes from '../../assets/theme/colorCodes';

export const useStyles = makeStyles({
  successMsg: {
    border: `1px solid ${ColorCodes.successMsgBorder} !important`,
    backgroundColor: `${ColorCodes.successMsgBg} !important`
  },
  pandingMsg: {
    border: `1px solid ${ColorCodes.pandingMsgBorder} !important`,
    backgroundColor: `${ColorCodes.pandingMsgBg} !important`
  },
  alertBox: {
    borderRadius: 4,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'flex-start !important',
    border: `1.5px solid ${ColorCodes.errorMsgBorder}`,
    backgroundColor: ColorCodes.errorMsgBg,
    '& p': {
      margin: 0,
      color: '#000',
      fontSize: 14,
      letterSpacing: -0.01,
      lineHeight: '18px'
    },
    '& a': {
      paddingLeft: 10,
      '&:hover': { textDecoration: 'underline' }
    }
  }
});
