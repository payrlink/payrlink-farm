import React, { useContext, useState } from 'react';
import { Row, Col, Button, Modal, Accordion, Form } from 'react-bootstrap';
import BigNumber from 'bignumber.js'

import useFarms from '../hooks/useFarms';
import useAllStakedValue from '../hooks/useAllStakedValue';
import usePayr from '../hooks/usePayr';

import ETH from "../assets/eth.svg";
import DAL from "../assets/dal-cl.svg";
import BNC from "../assets/bnc-cl.svg";
import BTC from "../assets/btc-cl.svg";
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import AccordionContext from "react-bootstrap/AccordionContext";
import UpArrow from "../assets/up-arrow.svg";
import DownArrow from "../assets/down-arrow.svg";
import ConectWallet from "../components/conectWallet";

import { BASIC_TOKEN } from '../constants/config';
import { useWallet } from 'use-wallet';
import { useEffect } from 'react';
import { getEarned, getFarmContract, getPoolWeight, getStaked, harvest, stake, unstake } from '../contracts/utils';
import { bnToDec } from '../utils';
import useAllowance from '../hooks/useAllowance';
import useApprove from '../hooks/useApprove';
import { useCallback } from 'react';

function ContextAwareToggle({ children, eventKey,theme, callback }) {
    const currentEventKey = useContext(AccordionContext);
    const decoratedOnClick = useAccordionToggle(
      eventKey,
      () => callback && callback(eventKey),
    );
    const isCurrentEventKey = currentEventKey === eventKey;
  
    return (
    <button
        type="button"
        onClick={decoratedOnClick}
        className="w-100 border-0 bg_transprent mt-3"
    >
        {isCurrentEventKey ? 
			<h6 className={`font-weight-bold ${!theme && 'text-white'}`}><img alt="upArrow" src={UpArrow} className="ml-1" /></h6> : 
			<h6 className={`font-weight-bold ${!theme && 'text-white'}`}><img alt="downArrow" src={DownArrow} className="ml-1" /></h6>
		}
    </button>
    );
  }

const FarmCard = (props) => {

	const [farms] = useFarms();
	const stakedValue = useAllStakedValue();

    const [showDeposit, setShowDeposit] = useState(false);
    const [showHarvest, setShowHarvest] = useState(false);
    const [showWidhdraw, setShowWidhdraw ] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [lPBalance, setLPBalance] = useState(null);
    const [stakedBalance, setStakedBalance] = useState(null);
    const [selectedPool, setSelectedPool] = useState(null);
    const [depositAmount, setDepositAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [pendingDeposit, setPendingDeposit] = useState(false);
    const [pendingWithdraw, setPendingWithdraw] = useState(false);
    const [pendingHarvest, setPendingHarvest] = useState(false);
    const [earnedBalance, setEarnedBalance] = useState(null);

    const payr = usePayr();
    const { account } = useWallet();

	const farmIndex = farms.findIndex(
		({ tokenSymbol }) => tokenSymbol === BASIC_TOKEN,
	);
	const farmPrice = farmIndex >= 0 && stakedValue[farmIndex]
      ? stakedValue[farmIndex].tokenPriceInWeth
      : new BigNumber(0);

	const BLOCKS_PER_YEAR = new BigNumber(2336000);
	// TODO: After block height xxxx, FARM_PER_BLOCK = 100;
	const FARM_PER_BLOCK = new BigNumber(1000);

	const rows = farms.reduce(
		(farmRows, farm, i) => {
            const farmWithStakedValue = {
                ...farm,
                ...stakedValue[i],
                apy: stakedValue[i]
                ? farmPrice
                    .times(FARM_PER_BLOCK)
                    .times(BLOCKS_PER_YEAR)
                    .times(stakedValue[i].poolWeight)
                    .div(stakedValue[i].totalWethValue)
                : null,
            };
            const newFarmRows = [...farmRows];
            if (newFarmRows[newFarmRows.length - 1].length === 3) {
                newFarmRows.push([farmWithStakedValue]);
            } else {
                newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue);
            }
            return newFarmRows;
		},
		[[]],
	);

    const clickHarvest = async (pool) => {
        setShowHarvest(true);
        setSelectedPool(pool);
        const balance = await getEarned(
            getFarmContract(payr),
            pool.pid,
            account
        );
        setEarnedBalance(bnToDec(new BigNumber(balance)));
    };

    const clickDeposit = async (pool) => {
        setShowDeposit(true);
        setSelectedPool(pool);
        setDepositAmount(0);
        const balance = await pool.lpContract.methods
            .balanceOf(props.account)
            .call();
        setLPBalance(bnToDec(new BigNumber(balance)));
    };

    const clickWithdraw = async (pool) => {
        setShowWidhdraw(true);
        setSelectedPool(pool);
        setWithdrawAmount(0);
        const balance = await getStaked(
            getFarmContract(payr),
            pool.pid,
            account
        );
        setStakedBalance(bnToDec(new BigNumber(balance.toNumber())));
    };
    
    return (
        <>
            {(rows[0].length > 0) ? (
                rows.map((poolRow, i) => (
                    <div key={i} md="10" lg="6" xl="4">
                        {poolRow.map((pool, j) => (
                            <PoolCard
                                key={j}
                                pool={pool}
                                account={props.account}
                                clickHarvest={clickHarvest}
                                setModalShow={setModalShow}
                                clickDeposit={clickDeposit}
                                clickWithdraw={clickWithdraw}
                            />
                        ))}
                    </div>
                ))
            ) : (
                <div></div>
            )}

            <ConectWallet 
				show={modalShow} 
				onHide={() => setModalShow(false)} 
				onChangeWallet={props.onChangeWallet} 
				themeClass={props.themeClass} 
			/>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showDeposit} 
                onHide={() => setShowDeposit(false)}
                className={`${props.themeClass ? 'custome_normal_modal_light' : 'custome_normal_modal_dark' }`}
            >
                <Modal.Header closeButton className="border-0">
					<Modal.Title id="contained-modal-title-vcenter" className="text-center text-white font-weight-bold">
						DEPOSIT
					</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4">
					<Row className="justify-content-between px-4">
						<Col lg='5' className="custom_select text-center">
						<h5 className="h_title">Pool</h5>
                            <div className="d-flex form-control custom_input">
                                <img alt="eth" src={ETH} height="20px" />
                                <h6 className="pl-2 mb-0">{selectedPool ? selectedPool.name : ''}</h6>
                            </div>
						</Col>
						<Col lg='7' className="custom_select text-center">
							<h5 className="h_title">Amount</h5>
							<Form.Control as="input" type="number" className="custom_input text-right text-large" value={depositAmount} onChange={(val) => setDepositAmount(val.target.value)} />
							<h5 className="text-right h_title">Max: {lPBalance ? lPBalance.toFixed(2) : "0.00"}</h5>
						</Col>
					</Row>
					<div className="px-4 deposit_card py-3 mt-3">
						<div className="d-flex justify-content-between mb-2">
							<h5>Available Balance</h5>
							<h5 className="font-weight-bold">{lPBalance ? lPBalance.toFixed(2) : "0.00"} {selectedPool ? selectedPool.name : ''}</h5>
						</div>
						<div className="mt-3 d-flex text-center align-items-center">
							<div className="px-2 w-50">
								<Button 
                                    disabled={lPBalance <= 0.00 || !depositAmount || parseFloat(depositAmount) > lPBalance || parseFloat(depositAmount) <= 0.00 || pendingDeposit}
                                    className="w-100 font-weight-bold bg-white text_app_color rounded border-0 px-4"
                                    onClick={async () => {
                                        setPendingDeposit(true);
                                        try {
                                            const txHash = await stake(
                                                getFarmContract(payr),
                                                selectedPool.pid,
                                                depositAmount,
                                                account,
                                            );
                                            setPendingDeposit(false);
                                            setShowDeposit(false);
                                        } catch (e) {
                                            console.log(e);
                                            setPendingDeposit(false);
                                        }
                                    }}
                                >
                                    {pendingDeposit ? 'Pending Deposit' : 'Deposit'}
                                </Button>
							</div>
							<div className="px-2 w-50">
								<Button 
									variant="outline-primary" 
									className="font-weight-bold rounded w-100 app_border text-white px-4" 
									onClick={() => setShowDeposit(false)}
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
                </Modal.Body>
            </Modal>


            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showWidhdraw} 
                onHide={() => setShowWidhdraw(false)}
                className={`${props.themeClass ? 'custome_normal_modal_light' : 'custome_normal_modal_dark' }`}

            >
                <Modal.Header closeButton className="border-0">
					<Modal.Title id="contained-modal-title-vcenter" className="text-center text-white font-weight-bold">
						WITHDRAW
					</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4">
					<Row className="justify-content-between px-4">
						<Col lg='5' className="custom_select text-center">
						<h5 className="h_title">Pool</h5>
                            <div className="d-flex form-control custom_input">
                                <img alt="eth" src={ETH} height="20px" />
                                <h6 className="pl-2 mb-0">{selectedPool ? selectedPool.name : ''}</h6>
                            </div>
						</Col>
						<Col lg='7' className="custom_select text-center">
							<h5 className="h_title">Amount</h5>
							<Form.Control as="input" type="number" className="custom_input text-right text-large" value={withdrawAmount} onChange={(val) => setWithdrawAmount(val.target.value)} />
							<h5 className="text-right h_title">Max: {stakedBalance ? stakedBalance.toFixed(2) : "0.00"}</h5>
						</Col>
					</Row>
                    <div className="px-4 deposit_card py-3 mt-3">
                        <div className="d-flex justify-content-between mb-2">
                            <h5>Available Balance</h5>
                            <h5 className="font-weight-bold">{stakedBalance ? stakedBalance.toFixed(2) : "0.00"} {selectedPool ? selectedPool.name : ''}</h5>
                        </div>
                        <div className="mt-3 d-flex text-center align-items-center">
                            <div className="px-2 w-50">
                                <Button 
                                    disabled={stakedBalance <= 0.00 || !withdrawAmount || parseFloat(withdrawAmount) > stakedBalance || parseFloat(withdrawAmount) <= 0.00 || pendingWithdraw}
                                    className="w-100 font-weight-bold bg-white text_app_color rounded border-0 px-4"
                                    onClick={async () => {
                                        setPendingWithdraw(true);
                                        try {
                                            const txHash = await unstake(
                                                getFarmContract(payr),
                                                selectedPool.pid,
                                                withdrawAmount,
                                                account,
                                            );
                                            setPendingWithdraw(false);
                                            setShowWidhdraw(false);
                                        } catch (e) {
                                            console.log(e);
                                            setPendingWithdraw(false);
                                        }
                                    }}
                                >
                                    {pendingWithdraw ? 'Pending Withdraw' : 'Withdraw'}
                                </Button>
                            </div>
                            <div className="px-2 w-50">
                                <Button 
									variant="outline-primary" 
									className="font-weight-bold rounded w-100 app_border text-white px-4" 
									onClick={() => setShowWidhdraw(false)}
								>
									Cancel
								</Button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showHarvest} 
                onHide={() => setShowHarvest(false)}
                className={`${props.themeClass ? 'custome_normal_modal_light' : 'custome_normal_modal_dark' }`}

            >
                <Modal.Header closeButton className="border-0">
					<Modal.Title id="contained-modal-title-vcenter" className="text-center text-white font-weight-bold">
					HARVEST
					</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4">
					<Row className="justify-content-between px-4">
                        <Col lg='3.5'></Col>
						<Col lg='5' className="custom_select text-center">
						<h5 className="h_title">Pool</h5>
                            <div className="d-flex form-control custom_input">
                                <img alt="eth" src={ETH} height="20px" />
                                <h6 className="pl-2 mb-0">{selectedPool ? selectedPool.name : ''}</h6>
                            </div>
						</Col>
                        <Col lg='3.5'></Col>
                        <div className="d-flex justify-content-between mb-2 px-4 harvest_card py-3 mt-3 w-100">
                            <h5>Earned Amount</h5>
                            <h5 className="font-weight-bold">{earnedBalance ? earnedBalance.toFixed(2) : "0.00"} {selectedPool ? selectedPool.earnToken : ''}</h5>
                        </div>
						<Col >
							<div className="mt-3 d-flex text-center align-items-center">
								<div className="px-2 w-50">
									<Button 
                                        disabled={pendingHarvest}
                                        className="w-100 font-weight-bold bg_app_dark text-white rounded border-0 px-4"
                                        onClick={async () => {
                                            setPendingHarvest(true);
                                            try {
                                                const txHash = await harvest(
                                                    getFarmContract(payr),
                                                    selectedPool.pid,
                                                    account,
                                                );
                                                setPendingHarvest(false);
                                                setShowHarvest(false);
                                            } catch (e) {
                                                console.log(e);
                                                setPendingHarvest(false);
                                            }
                                        }}
                                    >
                                        {pendingHarvest ? 'Pending Harvest' : 'Harvest'}
                                    </Button>
								</div>
								<div className="px-2 w-50">
									<Button 
										variant="outline-primary" 
										className="font-weight-bold rounded w-100 app_border h_title px-4" 
                                        onClick={() => setShowHarvest(false)}
									>
										Cancel
									</Button>
								</div>
							</div>
						</Col>
					</Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

const PoolCard = (props) => {

    const [earned, setEarned] = useState(0);
    const [poolWeight, setPoolWeight] = useState(0);
    const [staked, setStaked] = useState(0);
    const [totalLpValue, setTotalLpValue] = useState(0);
    const [requestedApproval, setRequestedApproval] = useState(false);

    const { account } = useWallet();
    const { pid } = props.pool;
    const payr = usePayr();
    const allowance = useAllowance(props.pool.lpContract);
    const { onApprove } = useApprove(props.pool.lpContract);

    useEffect(() => {
        async function fetchEarned() {
            if (!payr) return;
            const farmContract = getFarmContract(payr);
            const earned = await getEarned(
                farmContract,
                pid,
                account
            );
            setEarned(bnToDec(new BigNumber(earned)).toFixed(2));
            const poolWeight = await getPoolWeight(
                farmContract,
                pid
            );
            setPoolWeight(poolWeight.toNumber() * 100);
            const staked = await getStaked(
                farmContract,
                pid,
                account
            );
            setStaked(bnToDec(new BigNumber(staked.toNumber())).toFixed(2));
            const totalLpValue = await props.pool.lpContract.methods
                .balanceOf(farmContract.options.address)
                .call();
            setTotalLpValue(bnToDec(new BigNumber(totalLpValue)).toFixed(2));
        }
        if (payr && account) {
            fetchEarned();
        }
        let refreshInterval = setInterval(fetchEarned, 10000)
        return () => clearInterval(refreshInterval)
    }, [payr, account, pid]);

    let poolApy;
    if (props.pool.apy && props.pool.apy.isNaN()) {
        poolApy = '- %';
    } else {
        poolApy = props.pool.apy
            ? `${props.pool.apy
                .times(new BigNumber(100))
                .toNumber()
                .toLocaleString('en-US')
                .slice(0, -1) || '-' }%`
            : 'Loading ...';
    }

    const handleApprove = useCallback(async () => {
        try {
            setRequestedApproval(true);
            const txHash = await onApprove();
            if (!txHash) {
                setRequestedApproval(false);
            }
        } catch (e) {
            console.log(e);
        }
    }, [onApprove, setRequestedApproval]);

    return (
        <Col className="farm_card px-md-4 mb-5">
            <div className="p-4 card_sec shadow border_radius">
                <div className="d-flex mb-4">
                    <img alt="icon" src={props.pool.icon ? props.pool.icon : ETH} height="40" className="mr-3" />
                    <div>
                        <h5 className="mb-0 font-weight-bold">{props.pool.name} POOL</h5>
                        {/* <span className="badge badge-pill badge-primary">{props.pool.multiply}x</span> */}
                        <span className="badge badge-pill badge-primary">{'EARN PAYR'}</span>
                    </div>
                </div>
            
                <table className="w-100">
                    <tbody>
                        {/* <tr>
                            <td><h5>APY</h5></td>
                            <td><h5 className="font-weight-bold text-right">{poolApy}</h5></td>
                        </tr> */}
                        <tr>
                            <td><h5>WEIGHT</h5></td>
                            <td><h5 className="font-weight-bold text-right">{poolWeight}%</h5></td>
                        </tr>
                        <tr>
                            <td><h5>STAKE</h5></td>
                            <td><h5 className="font-weight-bold text-right">{props.pool.lpToken}</h5></td>
                        </tr>
                        <tr>
                            <td><h5>EARN</h5></td>
                            <td><h5 className="font-weight-bold text-right">{props.pool.earnToken}</h5></td>
                        </tr>
                    </tbody>
                </table>
            
                <div className="bg_harvest border_radius p-3 font-weight-bold mb-4">
                    <span className="text_app">PAYR EARNED</span>
                    <div className="d-flex justify-content-between">
                        <h3 className="text_app font-weight-bold">{earned}</h3>
                        <Button 
                            size="sm" 
                            className="py-1 px-3 shadow border-0 bg_app_dark h-100 rounded" 
                            onClick={() => props.clickHarvest(props.pool)}
                        >
                            <h6 className="mb-0">HARVEST</h6>
                        </Button>
                    </div>
                    <span className="text_app">{props.pool.name} STAKED</span>
                    <h3 className="text_app font-weight-bold">{staked}</h3>
                </div>
            
                {props.account === null ?
                    <Button 
                        className="font-weight-bold w-100 bg_app_dark rounded border-0" 
                        onClick={() => props.setModalShow(true)}
                    >
                        UNLOCK WALLET
                    </Button>
                :   <>
                        {!allowance.toNumber() ? (
                            <>
                            {requestedApproval ? (
                                <Button 
                                    disabled={true}
                                    className="font-weight-bold w-100 bg_app_dark rounded border-0 mb-2"
                                >
                                    Approving...
                                </Button>    
                            ) : (
                                <Button 
                                    className="font-weight-bold w-100 bg_app_dark rounded border-0 mb-2"
                                    onClick={handleApprove}
                                >
                                    Approve {props.pool.name}
                                </Button>
                            )}
                            </>
                        ) : (
                            <>
                                <Button 
                                    className="font-weight-bold w-100 bg_app_dark rounded border-0 mb-2" 
                                    onClick={() => props.clickDeposit(props.pool)}
                                >
                                    DEPOSIT
                                </Button>
                                <Button 
                                    variant="outline-primary" 
                                    className="font-weight-bold w-100 rounded app_border" 
                                    onClick={() => props.clickWithdraw(props.pool)}
                                >
                                    WITHDRAW
                                </Button>
                            </>
                        )}                        
                    </>
                }
                
                <Accordion>
                    <ContextAwareToggle eventKey="1" theme={props.themeClass} />

                    <Accordion.Collapse eventKey="1">
                        <div>
                            <table className="w-100">
                                <tbody>
                                    <tr>
                                        <td><h5>TOTAL VALUE</h5></td>
                                        <td><h5 className="font-weight-bold text-right"><span className="text_app font-weight-bold">{totalLpValue}</span> {props.pool.name}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h5>MY STAKED</h5></td>
                                        <td><h5 className="font-weight-bold text-right"><span className="text_app font-weight-bold">{staked}</span> {props.pool.name}</h5></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Accordion.Collapse>
                </Accordion>
            </div>
        </Col>
    )
}

export default FarmCard;

