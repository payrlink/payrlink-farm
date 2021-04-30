import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const about = () => {
    return (
                <Row className="d-flex align-items-center justify-content-between p-3 p-md-5 app_secondery">
                    <Col xl="6" className="pl-md-5 my-5">
                        <div className="text-white">
                            <h1 className=" font-weight-bold mb-5">About The PayrLink</h1>
                            <h3 className="font-weight-normal mb-4">
                                PayrLink is a decentralized application powered by Blockchain
                                technology that works as a decentralized third-party arbitrates
                                transactions in a private manner from very simple and highly
                                complex ones. 
                            </h3>
                            <h3 className="font-weight-normal pb-4">
                                The result is a private solution and secure escrow service that
                                renders ultimate judgements in a fast, inexpensive, reliable
                                and decentralized way.
                            </h3>
                            <Button variant="light" className="btn_white mr-5 px-5 font-weight-bold">WHITEPAPER</Button>
                    
                        </div>
                    </Col>
                    <Col xl="5" className=" mb-3 my-md-5">
                        <div>
                            <iframe width="100%" height="400px" src="https://www.youtube.com/embed/qC5DbPsap-0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </Col>
                </Row>

    );
}

export default about;
