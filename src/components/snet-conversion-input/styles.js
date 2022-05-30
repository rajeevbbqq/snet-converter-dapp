import colorCodes from '../../assets/theme/colorCodes';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const styles = {
  formControl: {
    width: 303,
    '& p': {
      marginLeft: '5px !important',
      color: '#212121',
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.1
    },
    '& fieldset': {
      border: 'none',
      backgroundColor: 'rgba(204,180,225,0.1)'
    },
    '@media(max-width: 960px)': { width: 260 }
  },
  dropDownLabel: {
    color: '#212121',
    fontSize: 14,
    fontWeight: 800,
    lineHeight: '18px'
  },
  dropdownWithBorders: {
    borderRadius: 20,
    backgroundColor: colorCodes.lightGray,
    overflow: 'hidden'
  },
  dropdown: {
    borderRadius: '4px',
    backgroundColor: colorCodes.lightGray,
    overflow: 'hidden'
  },
  texfieldWithDropdown: {
    padding: 1.6,
    paddingRight: 0
  },
  walletAddress: {
    fontSize: '11px',
    color: '#9b9b9b',
    fontStyle: 'italic',
    fontWeight: 300,
    letterSpacing: -0.18,
    lineHeight: '16px'
  },
  walletIcon: {
    color: '#9b9b9b',
    fontSize: '16px'
  },
  avatar: {
    width: 25,
    height: 25
  },
  amtDropdown: {
    '& .Mui-disabled': {
      backgroundColor: '#fafafa',
      '& fieldset': { bordreColor: '#eee' }
    },
    '& > div': {
      paddingRight: '8px !important',
      '& > fieldset': { bordreColor: '#828282' },
      '& > div': {
        width: 295,
        padding: '8px 0',
        '& > div': {
          width: '100%',
          '& .MuiSelect-select': { padding: '13px 14px' },
          '& .MuiTypography-root': { fontSize: 16 }
        }
      }
    },
    '& input': { fontSize: 26 }
  },
  fromToDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '16px',
    justifyContent: 'space-between',
    '@media(max-width: 540px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  fromToDropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    '& > div': {
      margin: '0 0 0 8px !important',
      '@media(max-width: 540px)': { width: '100%' }
    },
    '@media(max-width: 540px)': { width: '100%' }
  },
  walletAddressContainer: {
    margin: '0 !important',
    flexDirection: 'row',
    alignItems: 'end',
    '& > p': { margin: '0 0 0 8px !important' },
    '@media(max-width: 540px)': { marginTop: '10px !important' }
  }
};

export { MenuProps, styles };
