import React from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import logo1 from "../assets/1.svg";
import logo2 from "../assets/2.svg";
import logo3 from "../assets/3.svg";
import logo4 from "../assets/4.svg";
import logo5 from "../assets/5.svg";
import Img1 from "../assets/image2.png";

const welcome = () => {
    return (
        <Row className="d-flex align-items-center justify-content-between p-3 p-xl-5 intro_section">
                    <Col xl="6" className="pl-xl-5  text-center text-xl-left">
                        <div className="mb-3 mb-xl-5">
                            <img src={logo1} alt="" className="mr-2" />
                            <img src={logo2} alt="" className="mr-2" />
                            <img src={logo3} alt="" className="mr-2" />
                            <img src={logo4} alt="" className="mr-2" />
                            <img src={logo5} alt="" className="mr-2" />
                        </div>
                        <div className="text-white">
                            <h1 className="display-4 font font-weight-bold">Welcome to <i>PayrLink</i></h1>
                            <h2 className="font-weight-normal pb-4">
                            Secure Blockchain-Powered Escrow Service with <br />Private Transactions and Decentralized Arbitration.
                            </h2>
                            <Button variant="light" className="btn_white mr-md-5 mb-3 mb-xl-0 px-5 font-weight-bold">BUY TOKENS</Button>
                            <Button variant="outline-light" className="mb-3 mb-xl-0 font-weight-bold px-5">WHITEPAPER</Button>
                        </div>
                    </Col>
                    <Col xl="5" className="d-flex mx-auto justify-content-center justify-content-xl-end">
                        <div className="">
                            <Image src={Img1} fluid alt="" className="rounded mt-3 mb-5 my-xl-0" />
                        </div>
                    </Col>
                </Row>

    );
}

export default welcome;
