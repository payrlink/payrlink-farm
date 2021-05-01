import React from 'react';
import { Row, Col,Image, Form, Button } from 'react-bootstrap';
import Twitter from "../assets/twitter.svg";
import Medium from "../assets/medium.svg";
import Discord from "../assets/discord.svg";
import Telegram from "../assets/telegram.svg";
import Youtube from "../assets/youtube.svg";
import Logo from "../assets/footer_logo.png";

const Footer = (props) => {
    return (
        <>
        <Row className="p-3 p-md-5 justify-content-center app_secondery">
            <Col xl="3" className="mb-5 mr-xl-5 feature_card">
                <div className={`contact_us_${props.themeClass ? 'light' : 'dark'} text-white px-3 py-4`}>
                    <h4>Contact Us</h4>
                <Form>
                {/* ${props.themeClass} */}
                    <Form.Group >
                        <Form.Control type="text" className="mb-3" />
                        <Form.Control type="text" className="mb-3" />
                        <Form.Control type="text" as="textarea" className="mb-3" style={{minHeight:"100px"}} />
                    </Form.Group>
                    <div className="w-100 d-flex justify-content-end">
                        <Button type="submit" variant="light" className="px-5 submit_footer">SUBMIT</Button>
                        </div>
                </Form>
                </div>
            </Col>
            <Col xl="4" className="ml-xl-5">
                <div className="d-flex justify-content-center">
                    <div className="pr-4 d-flex flex-column h-auto">
                        <div>
                            <h5 className="mb-3"><a className="text-white font-weight-light" href="#">WHITEPAPER</a></h5>
                            <h5 className="mb-3"><a className="text-white font-weight-light" href="#">VIDEO</a></h5>
                            <h5 className="mb-3"><a className="text-white font-weight-light" href="#">ARTICLES</a></h5>
                        </div>
                        <div className="d-flex mt-auto">
                            <a href="#"><img src={Twitter} className="mr-2" /></a>
                            <a href="#"><img src={Telegram} className="mr-2" /></a>
                            <a href="#"><img src={Discord} className="mr-2" /></a>
                            <a href="#"><img src={Youtube} className="mr-2" /></a>
                            <a href="#"><img src={Medium} className="mr-2" /></a>
                        </div>
                    </div>
                    <div className="pl-4 border-left">
                        <h5 className="mb-3"><a className="text-white font-weight-light" href="#">ESCROW SERVICE</a></h5>
                        <h5 className="mb-3"><a className="text-white font-weight-light" href="#">ARBITRATION CENTER</a></h5>
                        <h5 className="mb-3"><a className="text-white font-weight-light" href="#">FARM</a></h5>
                        <h5 className="mb-3"><a className="text-white font-weight-light" href="#">BUY TOKENS</a></h5>
                        
                    </div>
                </div>

            </Col>
            <Col xl="2" className="text-center mt-5">
                <Image src={Logo} fluid />
            </Col>
            
        </Row>
        <Row>
            <Col xl="12" className="text-white pt-5 text-center app_secondery">
                <p>Copyright © 2021 designed by Sunil  |  AJ  All rights reserved.</p>
            </Col>
        </Row>
        </>
    );
}

export default Footer;
