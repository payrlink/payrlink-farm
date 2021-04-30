import React, { Component } from 'react';
import { Container, Row, Col, Button, Dropdown, Accordion } from 'react-bootstrap';
import Logo from "../assets/logo.png"
import Footer2 from "../components/footer2";
import Wallet from "../assets/walletSmall.svg";
import ConectWallet from "../components/conectWallet";
import FarmCard from "../components/farmCard";
import Light from "../assets/light.svg";
import Dark from "../assets/dark.svg";


class PreSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            connectedWallet: null,
            theme: true
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
    
    changeTheme = () => {
        this.setState({theme: !this.state.theme})
    }

    render() {
        return (
            <Container fluid className="main_layout">
                <Row className="header py-4 px-md-5">
                   <Col xl={12} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <img src={Logo} alt="" /><h4 className="ml-2 text-white mb-0">Farm</h4>
                        </div>
                        <div className="d-flex align-items-center">
                            <Button variant="link" onClick={()=>this.changeTheme()}><img src={this.state.theme ? Light : Dark} /></Button>
                            {this.state.connectedWallet === null ?
                            <Button variant="light" className="btn_white mx-md-3 h-100" onClick={()=>this.setState({modalShow:true})}>Connect Wallet</Button>
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
                            <ConectWallet show={this.state.modalShow} onHide={() => this.setState({modalShow:false})} onChangeWallet={this.onChangeWallet} themeClass={this.state.theme} />
                        </div>
                    </Col>
                </Row>
                <Row className={`justify-content-center p-5 ${this.state.theme ? 'theme_light' : 'theme_dark'}`}>
                    <Col xl="10" className="">
                        <h2 className="font-weight-bold">Stake LP tokens to earn PAYR</h2>
                        <h5>Deposit Fee will be used to buyback PAYR</h5>
                        <Row className="my-4 justify-content-center justify-content-lg-start">
                            <FarmCard themeClass={this.state.theme} onChangeWallet={this.onChangeWallet} connectedWallet={this.state.connectedWallet} />   
                        </Row>
                    </Col>
                </Row>
                <Footer2 themeClass={this.state.theme} />
            </Container>
        );
    }
}

export default PreSale;
