import React, { Component } from 'react';
import { Row, Col, Image, Button } from 'react-bootstrap';
import Feature1 from "../assets/feature1.png";
import Feature2 from "../assets/feature2.png";
import Feature3 from "../assets/feature3.png";
import Wallet from "../assets/wallet.svg";
import Transfer from "../assets/transfer.svg";
import Lock from "../assets/lock.svg";
import Line from "../assets/line.png";

class features extends Component {
    render() {
        return (
            <Row className="px-md-5 px-3 pb-5 mb-5">
                
            <Col xl="12">
                <h1 className="text-white font-weight-bold my-5 py-5 text-center">Our Features</h1>
            </Col>

            <Col xl="12" className="text-white pl-5">
                <div>
                    <Row>
                        <Col xl="6" className="line_side d-none align-items-center d-xl-flex pb-5">
                            <div className="w-75">
                                <div className="position-relative">
                                    <Image src={Feature1} alt="" className="feature_img" />
                                    <div className="icon_round d-flex justify-content-center align-items-center">
                                        <img src={Wallet} />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xl="6" className="pb-5">
                            <div className="h-100 position-relative d-flex align-items-center">
                            <Image src={Feature1} alt="" className="w-25 mr-5 d-none d-xl-none d-md-block" />
                                <div className="feature_card ml-auto">
                                    <div className="text-left">
                                        <h2 className="text-white font-weight-bold mb-3">Crypto Escrow service</h2>
                                        <h3 className="font-weight-normal">Send cryptos to get secured by PayrLink.</h3>
                                        <Button variant="light font-weight-bold px-4 " className="mt-4">Read More</Button>
                                    </div>
                                </div>
                                <img src={Line} className="icon_line d-none d-xl-block" />
                            </div>
                        </Col>
                        
                        <Col xl="6" className="line_side d-none align-items-center d-xl-flex py-5">
                            <div className="position-relative w-75">
                                <div>
                                    <Image src={Feature2} alt=""  className="feature_img" />
                                    <div className="icon_round d-flex justify-content-center align-items-center">
                                        <img src={Transfer} />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xl="6" className="py-5">
                            <div className="h-100 position-relative d-flex align-items-center">
                            <Image src={Feature2} alt="" className="w-25 mr-5 d-none d-xl-none d-md-block" />
                                <div className="feature_card ml-auto">
                                    <div className="text-left">
                                        <h2 className="text-white font-weight-bold mb-3">Decentralized Arbitration</h2>
                                        <h3 className="font-weight-normal">The recipient's address is protected by ZKP scheme, so that no one can track, even PayrLink.</h3>
                                        <h3 className="font-weight-normal">All the transactions are managed in a private manner by PayrLink.</h3>
                                        <Button variant="light font-weight-bold px-4 " className="mt-4">Read More</Button>
                                    </div>
                                </div>
                                <img src={Line} className="icon_line d-none d-xl-block" />
                            </div>
                        </Col>
                        
                        <Col xl="6" className="line_side d-none align-items-center d-xl-flex py-5">
                            <div className="position-relative w-75">
                                <div>
                                    <Image src={Feature3} alt=""  className="feature_img" />
                                    <div className="icon_round d-flex justify-content-center align-items-center">
                                        <img src={Lock} />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xl="6" className="py-5">
                            <div className="h-100 position-relative d-flex align-items-center">
                            <Image src={Feature3} alt="" className="w-25 mr-5 d-none d-xl-none d-md-block" />
                                <div className="feature_card ml-auto">
                                    <div className="text-left">
                                        <h2 className="text-white font-weight-bold mb-3">Private Transfer</h2>
                                        <h3 className="font-weight-normal">Improved system of borrower's verification.</h3>
                                        <h3 className="font-weight-normal">Providing verification services for other services.</h3>
                                        <Button variant="light font-weight-bold px-4 " className="mt-4">Read More</Button>
                                    </div>
                                </div>
                                <img src={Line} className="icon_line d-none d-xl-block" />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>
            </Row>
        );
    }
}

export default features;
