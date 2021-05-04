import React, { useContext, useState } from 'react';
import { Row, Col, Button, Modal, Accordion, Form } from 'react-bootstrap';

import useFarms from '../hooks/useFarms';

import ETH from "../assets/eth.svg";
import DAL from "../assets/dal-cl.svg";
import BNC from "../assets/bnc-cl.svg";
import BTC from "../assets/btc-cl.svg";
import Select from 'react-select';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import AccordionContext from "react-bootstrap/AccordionContext";
import UpArrow from "../assets/up-arrow.svg";
import DownArrow from "../assets/down-arrow.svg";
import ConectWallet from "../components/conectWallet";

const pools = [{
    name: 'BNB-PAYR LP',
    icon: ETH,
    multiply: '4',
    apr:'324.97',
    stack:'BNB-PAYR LP',
    earn:'PAYR',
    depositFee:'0',
    payrEarned: '0',
    depost: 'BNB-PAYR LP',
    totalValue:'5,581,349',
    stakedValue:'0',
    noFee: true
},
{
    name: 'BNB-PAYR LP',
    icon: ETH,
    multiply: '4',
    apr:'324.97',
    stack:'BNB-PAYR LP',
    earn:'PAYR',
    depositFee:'0',
    payrEarned: '0',
    depost: 'BNB-PAYR LP',
    totalValue:'5,581,349',
    stakedValue:'0',
    noFee: true
},
{
    name: 'BNB-PAYR LP',
    icon: ETH,
    multiply: '4',
    apr:'324.97',
    stack:'BNB-PAYR LP',
    earn:'PAYR',
    depositFee:'0',
    payrEarned: '0',
    depost: 'BNB-PAYR LP',
    totalValue:'5,581,349',
    stakedValue:'0',
    noFee: true
},
{
    name: 'BNB-PAYR LP',
    icon: ETH,
    multiply: '4',
    apr:'324.97',
    stack:'BNB-PAYR LP',
    earn:'PAYR',
    depositFee:'0',
    payrEarned: '0',
    depost: 'BNB-PAYR LP',
    totalValue:'5,581,349',
    stakedValue:'0',
    noFee: true
}]

const options = [
    { value: '1', label: <div className="d-flex"><img alt="eth" src={ETH} height="20px" /><h6 className="pl-2 mb-0">ETH</h6></div> },
    { value: '2', label: <div className="d-flex"><img alt="dai" src={DAL} height="20px" /><h6 className="pl-2 mb-0">DAL</h6></div> },
    { value: '3', label: <div className="d-flex"><img alt="bnc" src={BNC} height="20px" /><h6 className="pl-2 mb-0">BNC</h6></div> },
    { value: '4', label: <div className="d-flex"><img alt="btc" src={BTC} height="20px" /><h6 className="pl-2 mb-0">BTC</h6></div> },
  ];

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
			<h6 className={`font-weight-bold ${!theme && 'text-white'}`}>Hide<img alt="upArrow" src={UpArrow} className="ml-1" /></h6> : 
			<h6 className={`font-weight-bold ${!theme && 'text-white'}`}>Detail<img alt="downArrow" src={DownArrow} className="ml-1" /></h6>
		}
    </button>
    );
  }

const FarmCard = (props) => {

	const [farms] = useFarms();
	console.log(farms);

    const [showDeposit, setShowDeposit] = useState(false);
    const [showHarvest, setShowHarvest] = useState(false);
    const [showWidhdraw, setShowWidhdraw ] = useState(false);
    const [selectOption, setSelectOption] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    function  handleChange(selectedOption) {
        setSelectOption(selectedOption);
	};

	const customStyles = {
        menu: (provided, state) => ({
			...provided,
			background: props?.themeClass ? 'white' : '#333333',
			color: state.selectProps.menuColor,
        }),
        
        control: (provided) => ({
            ...provided,
            border: props?.themeClass ? '2px solid #141132' : '2px solid #403894' ,
            background: 'transparent',
        }),
        container: (provided) => ({
            ...provided,
            // background: '#141132',
            borderRadius: '20px',
        }),
        indicatorsContainer: () => ({
            background: props?.themeClass ? '#141132' : '#403894',
            borderRadius: '0 7px 7px 0',    
        }),      
        singleValue: (provided, state) => {        
          const transition = 'opacity 300ms';
          const color = props?.themeClass ? '' : 'white';
          return { ...provided, transition, color };
        }
    }
    
    return (
        <>
        {pools.map((e, key) => ( 
            <Col key={key} md="10" lg="6" xl="4" className="farm_card px-md-4 mb-5">
                <div className="p-4 card_sec shadow border_radius">
                    <div className="d-flex mb-4">
                        <img alt="icon" src={e.icon} height="40" className="mr-3" />
                        <div>
                            <h5 className="mb-0 font-weight-bold">{e.name}</h5>
                            <span className="badge badge-pill badge-primary">{e.multiply}x</span>
                        </div>
                    </div>
                
                    <table className="w-100">
                        <tbody>
                            <tr>
                                <td><h5>APR</h5></td>
                                <td><h5 className="font-weight-bold text-right">{e.apr}%</h5></td>
                            </tr>
                            <tr>
                                <td><h5>STAKE</h5></td>
                                <td><h5 className="font-weight-bold text-right">{e.stack}</h5></td>
                            </tr>
                            <tr>
                                <td><h5>EARN</h5></td>
                                <td><h5 className="font-weight-bold text-right">{e.earn}</h5></td>
                            </tr>
                            <tr>
                                <td><h5>DEPOSIT FEE</h5></td>
                                <td><h5 className="font-weight-bold text-right">{e.depositFee}%</h5></td>
                            </tr>
                        </tbody>
                    </table>
                
                    <div className="bg_harvest border_radius p-3 font-weight-bold mb-4">
                        <span className="text_app">PAYR EARNED</span>
                        <div className="d-flex justify-content-between">
                            <h3 className="text_app font-weight-bold">{e.payrEarned}</h3>
                            <Button 
								size="sm" 
								className="py-1 px-3 shadow border-0 bg_app_dark h-100 rounded" 
								onClick={() => setShowHarvest(true)}
							>
								<h6 className="mb-0">HARVEST</h6>
							</Button>
                        </div>
                        <span className="text_app">{e.name}</span><span>{' '}STAKED</span>
                    </div>
                
                    {props.account === null ?
                        <Button 
							className="font-weight-bold w-100 bg_app_dark rounded border-0" 
							onClick={() => setModalShow(true)}
						>
							UNLOCK WALLET
						</Button>
                    :   <>
                            <Button 
								className="font-weight-bold w-100 bg_app_dark rounded border-0 mb-2" 
								onClick={() => setShowDeposit(true)}
							>
								DEPOSIT
							</Button>
                            <Button 
								variant="outline-primary" 
								className="font-weight-bold w-100 rounded app_border" 
								onClick={() => setShowWidhdraw(true)}
							>
								WITHDRAW
							</Button>
                        </>
                    }
                    
                    <Accordion>
                        <ContextAwareToggle eventKey="1" theme={props.themeClass} />

                        <Accordion.Collapse eventKey="1">
                            <div>
                                <table className="w-100">
                                    <tbody>
                                        <tr>
                                            <td><h5>DEPOSIT</h5></td>
                                            <td><h5 className="font-weight-bold text-right">{e.depost}</h5></td>
                                        </tr>
                                        <tr>
                                            <td><h5>TOTAL VALUE</h5></td>
                                            <td><h5 className="font-weight-bold text-right">${e.totalValue}</h5></td>
                                        </tr>
                                        <tr>
                                            <td><h5>MY STAKED VALUE</h5></td>
                                            <td><h5 className="font-weight-bold text-right">${e.stakedValue}</h5></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                </div>
            </Col>
            ))}

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
							<Select
								value={selectOption}
								onChange={handleChange}
								options={options}
								isSearchable={false}
								styles={customStyles}
								theme={theme => ({
									...theme,
									borderRadius: 10
									})}
							/>
						</Col>
						<Col lg='7' className="custom_select text-center">
							<h5 className="h_title">Amount</h5>
							<Form.Control as="input" className="custom_imput text-right text-large" />
							<h5 className="text-right h_title">Max: 7.247</h5>
						</Col>
					</Row>
					<div className="px-4 deposit_card py-3 mt-3">
						<div className="d-flex justify-content-between mb-2">
							<h5>Current Balance</h5>
							<h5 className="font-weight-bold">4.85 ETH</h5>
						</div>
						<div className="d-flex justify-content-between">
							<h5>Total Balance</h5>
							<h5 className="font-weight-bold">8.08 ETH</h5>
						</div>
						<div className="mt-3 d-flex text-center align-items-center">
							<div className="px-2 w-50">
								<Button className="w-100 font-weight-bold bg-white text_app_color rounded border-0 px-4">Deposit</Button>
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
							<Select
								value={selectOption}
								onChange={handleChange}
								options={options}
								isSearchable={false}
								className="abcd"
								styles={customStyles}
								theme={theme => ({
									...theme,
									borderRadius: 10
									})}
							/>
						</Col>
						<Col lg='7' className="custom_select text-center">
							<h5 className="h_title">Amount</h5>
							<Form.Control as="input" className="custom_imput text-right text-large" />
							<h5 className="text-right h_title">Max: 7.247</h5>
						</Col>
					</Row>
                    <div className="px-4 deposit_card py-3 mt-3">
                        <div className="d-flex justify-content-between mb-2">
                            <h5>Current Balance</h5>
                            <h5 className="font-weight-bold">5.747 ETH</h5>
                        </div>
                        <div className="d-flex justify-content-between">
                            <h5>Remaining Balance</h5>
                            <h5 className="font-weight-bold">4.247 ETH</h5>
                        </div>
                        <div className="mt-3 d-flex text-center align-items-center">
                            <div className="px-2 w-50">
                                <Button className="w-100 font-weight-bold bg-white text_app_color rounded border-0 px-4">Withdraw</Button>
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
						<Col lg='5' className="custom_select text-center">
						<h5 className="h_title">Pool</h5>
							<Select
								value={selectOption}
								onChange={handleChange}
								options={options}
								isSearchable={false}
								className="abcd"
								styles={customStyles}
								theme={theme => ({
									...theme,
									borderRadius: 10
									})}
							/>
						</Col>
						<Col lg='7' className="custom_select text-center">
							<h5 className="h_title">Amount</h5>
							<Form.Control as="input" className="custom_imput text-right text-large" />
							<h5 className="text-right h_title">Max: 7.247</h5>
						</Col>
						<Col>
							<div className="mt-3 d-flex text-center align-items-center">
								<div className="px-2 w-50">
									<Button className="w-100 font-weight-bold bg_app_dark text-white rounded border-0 px-4">Harvest</Button>
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

export default FarmCard;

