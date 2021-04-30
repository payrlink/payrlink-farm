import React, { Component } from 'react';
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import Logo from "../assets/logo.png"
import Footer2 from "../components/footer2";
import ETH from "../assets/eth.svg";
import Wallet from "../assets/walletSmall.svg";
import TimeCounter from "../components/timeCounter";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ConectWallet from "../components/conectWallet";

const percentage = 25;

class PreSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            connectedWallet: null
        };
      }

    onChangeWallet = (data) => {
    this.setState({connectedWallet:data,modalShow:false});
    };

    onDisconnectWallet = () => {
        this.setState({
                connectedWallet: null,
                modalShow:false
            });
        };
    
    render() {
        return (
            <Container fluid className="main_layout">
                <Row className="header py-4 px-md-5">
                   <Col xl={12} className="d-flex justify-content-between align-items-center">
                        <div>
                            <img src={Logo} alt="" />
                        </div>
                        {this.state.connectedWallet === null ?
                        <Button variant="light" className="btn_white mx-md-3" onClick={()=>this.setState({modalShow:true})}>Connect Wallet</Button>
                        :
                        <Dropdown>
                            <Dropdown.Toggle variant="" className="btn_white" id="dropdown-basic">
                                <img src={Wallet} className="mr-1" />0X13484****79
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#" onClick={this.onDisconnectWallet}>Disconnect</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        }
                        <ConectWallet show={this.state.modalShow} onHide={() => this.setState({modalShow:false})} onChangeWallet={this.onChangeWallet} />
                    </Col>
                </Row>
                <Row className="justify-content-center mb-5">
                <Col sm={12} md={12} lg={9} xl={7} className="">
                    <div className=" position-relative pre_block px-5 text-center">
                        <div className="app_secondery pt-5">
                            <h1 className="text-white display-4 font-weight-bold py-5 mb-5">Pre Sale</h1>
                        </div>
                    </div>

                    <div className="py-3 counter_block mb-0 pb-0 w-auto">
                    <h2 className="text-white text-center">Starts in</h2>
                        <TimeCounter  timeTillDate="3 31 2022, 6:00 am" timeFormat="MM DD YYYY, h:mm a" />
                    </div>
                </Col>
                
                <Col sm={12} md={12} lg={9} xl={7} className="pb-3 my-4 my-xl-5">
                    <Row className="px-4">
                    <Col sm={12} md={12} lg={6} xl={6} className="px-5 text-center text-white">
                           <div style={{ width: 160, height: 160 }} className="mx-auto mb-5 mb-xl-4">
                                <CircularProgressbar value={percentage} text={`${percentage}%`}
                                    styles={buildStyles({
                                        textSize: '16px',
                                        pathColor: `white`,
                                        textColor: 'white',
                                        trailColor: 'rgba(255, 255, 255, 0.3)',
                                    })}
                                />
                           </div>
                            
                            <h3 className="text-center">0 ETH / 2000</h3>
                            <div className="w-fit-content mx-auto ">
                                <h6 className="text-left mb-0">Current Price</h6>
                                <h3 className="text-left">1 ETH = 3600 PAYR</h3>
                            </div>
                        </Col>
                        <Col sm={12} md={12} lg={6} xl={6} className="px-3 px-md-5">
                           <div className="app_secondery border_radius p-3 p-md-4 text-white">
                                <div className="d-md-flex justify-content-md-between">
                                    <h4 className="text-center mt-2">Bought</h4><h4 className="text-center mt-2">123456 PAYR</h4>
                                </div>
                                <div className="bg_gray d-flex align-items-center m py-1 px-3 rounded my-3 ml-auto" style={{width:'fit-content'}}>
                                    <img src={ETH} className="mr-2" />
                                    <h3 className="mb-0">ETH</h3>
                                </div>
                                <div className="bg_gray text-right align items-center py-1 px-3 rounded">
                                    <h3 className="mb-0 font-weight-bold">3.23</h3>
                                </div>
                                <h5 className="text-right text-white-50">Max: 7.247</h5>
                                <div className="mt-3">
                                    <Button variant="light" className="btn_white mx-md-3 w-fill-available">CONTRIBUTE</Button>
                                </div>
                           </div>
                           
                        </Col>
                    </Row>
                </Col>

                <Col sm={12} md={12} lg={9} xl={7} className="pb-3 my-4 my-xl-5">
                    <Row className="px-4">
                        <Col sm={12} className="px-3 px-md-5">
                           <div className="app_secondery border_radius p-3 py-md-4 px-md-5 text-white">
                           <h4 className="text-center mt-2">Attention!</h4>
                            <h4 className="font-weight-normal">
                                This is an admin message... By contributing you agree to the user terms that 
                                this is not an investment and a possible loss of ethereum can occur. Deor takes 
                                no responsibility for any issues of any kind, you are responsible for your own 
                                decision making when minting utility tokens for this project. Any legal or 
                                jurisdictional issues are entirely your own and you must make sure you do your 
                                due diligence before hand. Thank you from the deor project.
                            </h4>    
                           </div>
                           
                        </Col>
                    </Row>
                </Col>
                </Row>
                <Footer2 />
            </Container>
        );
    }
}

export default PreSale;
