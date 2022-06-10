import propTypes from 'prop-types';
import { useState, lazy } from 'react';
import { useDispatch } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { RefreshOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { isNil } from 'lodash';
import { toLocalDateTime } from '../../utils/Date';
import Columns from './Columns';
import Rows from './Rows';
import { setFromAddress, setToAddress } from '../../services/redux/slices/wallet/walletSlice';
import { conversionStatuses, conversionSteps } from '../../utils/ConverterConstants';

import { useStyles } from './styles';
import SnetPagination from './Pagination';

const SNETConversion = lazy(() => import('../snet-conversion-info'));

const SnetDataGrid = ({
  paginationInfo,
  onPageChange,
  currentPage,
  rows,
  refreshTxnHistory,
  loading,
  onItemSelect,
  pageSizes,
  paginationSize,
  totalNoOfTransaction,
  getTransactionHistory,
  expanded,
  setExpandedValue
}) => {
  const classes = useStyles();

  const [conversion, setConversion] = useState(null);
  const [openConversionModal, setOpenConversionModal] = useState(false);
  const [isReadyToClaim, setReadyToClaim] = useState(false);

  const dispatch = useDispatch();

  const toggleConversionModal = () => {
    setOpenConversionModal(!openConversionModal);
  };
  const handleResume = (conversionInfo, conversionStatus) => {
    let activeStep;
    switch (conversionStatus) {
      case conversionStatuses.WAITING_FOR_CLAIM:
        activeStep = conversionSteps.CLAIM_TOKENS;
        break;

      case conversionStatuses.USER_INITIATED:
        activeStep = conversionSteps.DEPOSIT_TOKENS;
        break;

      default:
        activeStep = conversionSteps.CONVERT_TOKENS;
        break;
    }

    const { wallet } = conversionInfo;

    dispatch(setFromAddress(wallet.from_address));
    dispatch(setToAddress(wallet.to_address));
    setConversion(conversionInfo);
    setReadyToClaim(conversionStatus === conversionStatuses.WAITING_FOR_CLAIM);
    toggleConversionModal();
  };

  const closeConfirmationPopup = () => {
    refreshTxnHistory();
    setConversion(null);
    toggleConversionModal();
  };

  return (
    <div className={classes.transactionHistoryTable}>
      <Backdrop open={loading}>
        <CircularProgress color="white" />
      </Backdrop>
      <Box className={classes.transactionHistoryHeader}>
        <Box display="flex" justifyContent="flex-end" marginY={2} className={classes.refreshDataContainer}>
          <LoadingButton loading={loading} onClick={refreshTxnHistory} startIcon={<RefreshOutlined />} variant="text">
            Refresh Data
          </LoadingButton>
        </Box>
        <Box className={classes.totalRecordsContainer}>
          <Typography>{totalNoOfTransaction} transactions</Typography>
        </Box>
      </Box>
      <Columns />
      {rows.map((row, index) => {
        return (
          <Rows
            key={row.id}
            id={row.id}
            date={toLocalDateTime(row.lastUpdatedAt)}
            fromToken={row.fromToken}
            chainType={row.chainType}
            fromAddress={row.fromAddress}
            toAddress={row.toAddress}
            toToken={row.toToken}
            status={row.status}
            getTransactionHistory={getTransactionHistory}
            transactions={row.transactions}
            conversionDirection={row.conversionDirection}
            handleResume={() => handleResume(row.conversionInfo, row.status)}
            depositAmount={row.depositAmount}
            receivingAmount={row.receivingAmount}
            confirmationRequired={row.confirmationRequired}
            expanded={expanded[row.id]}
            setExpandedValue={setExpandedValue}
          />
        );
      })}
      <SnetPagination
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
        currentPage={currentPage}
        paginationSize={paginationSize}
        onItemSelect={onItemSelect}
        pageSizes={pageSizes}
      />
      {!isNil(conversion) && (
        <SNETConversion
          conversion={conversion}
          openPopup={openConversionModal}
          handleConversionModal={closeConfirmationPopup}
          openLink={closeConfirmationPopup}
          readyToClaim={isReadyToClaim}
        />
      )}
    </div>
  );
};

SnetDataGrid.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  rows: propTypes.arrayOf(propTypes.object).isRequired,
  refreshTxnHistory: propTypes.func.isRequired,
  loading: propTypes.bool.isRequired,
  onItemSelect: propTypes.func.isRequired,
  pageSizes: propTypes.arrayOf(propTypes.number).isRequired,
  paginationSize: propTypes.number.isRequired,
  currentPage: propTypes.number.isRequired,
  onPageChange: propTypes.func.isRequired,
  getTransactionHistory: propTypes.func.isRequired,
  paginationInfo: propTypes.string.isRequired,
  totalNoOfTransaction: propTypes.number.isRequired,
  expanded: propTypes.object.isRequired,
  setExpandedValue: propTypes.func.isRequired
};

export default SnetDataGrid;
