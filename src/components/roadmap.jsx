import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Cloud from "../assets/cloud.png";
import Wallet from "../assets/wallet.svg";
import Line from "../assets/line2.png";

import Hand from "../assets/hand.svg";
import Hierarchy from "../assets/hierarchy.svg";
import Idea from "../assets/idea.svg";
import Rocket from "../assets/rocket.svg";
import Seeting2 from "../assets/seeting2.svg";
import SettingsG  from "../assets/settings-gears.svg";
import Web from "../assets/web.svg";

class roadmap extends Component {
    render() {
        return (
            <>
                <Row className="app_secondery px-3 px-xl-5 pb-5 ">
                    <Col md="12">
                        <h1 className="text-white font-weight-bold my-5 py-3 py-xl-5 text-center">Our RoadMap</h1>
                    </Col>

                    <Col md="12" className="text-white px-xl-5 px-3">
                    <div>
                        <Row className="justify-content-center">
                            <Col md={12}><div className="d-flex justify-content-center"><h3 className="text-white text-center year_switch px-5 py-2 mb-xl-0">2020</h3></div></Col>
                            <Col md="6" className="line_side py-3 py-xl-5">
                                <div className="position-relative mr-xl-auto feature_card">
                                    <div className="icon_right">
                                        <div className="position-relative mr-xl-auto feature_card roadmap_card p-4 d-flex align-items-center justify-content-center justify-content-xl-end">
                                            <div className="mr-xl-5 text-center text-xl-right">
                                                <div className="d-flex d-xl-none mb-3 justify-content-center align-items-center">
                                                <img src={Idea} />
                                                </div>
                                                <h6 className="text-white-50">(September - October)</h6>
                                                    <h1>Idea</h1>
                                            </div>
                                            <div className="icon_round_left d-xl-flex d-none justify-content-center align-items-center">
                                            <img src={Idea} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col md="6" className="py-3 py-xl-5">
                            <div className="position-relative ml-auto feature_card">
                                    <div className="icon_right">
                                        <div className="position-relative ml-auto feature_card roadmap_card p-4 d-flex align-items-center justify-content-xl-start justify-content-center">
                                            <div className="ml-xl-5 text-center text-xl-left">
                                                <div className="d-flex d-xl-none mb-3 justify-content-center align-items-center">
                                                    <img src={SettingsG} />
                                                </div>
                                                <h6 className="text-white-50">(October - December)</h6>
                                                <h1>Market Research</h1>
                                            </div>
                                            <div className="icon_round d-xl-flex d-none justify-content-center align-items-center">
                                                <img src={SettingsG} />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div>
                                    <img src={Line} className="icon_line_roadmap d-none d-lg-block" />
                                </div>
                            </Col>
                            
                            <Col md={12}><div className="d-flex justify-content-center"><h3 className="text-white text-center year_switch px-5 py-2 mb-0">2021</h3></div></Col>
                            <Col md={12} className="mb-3 mb-xl-0"></Col>
                            <Col md="6" className="line_side pb-3 py-xl-5">
                                <div className="position-relative mr-auto feature_card">
                                    <div className="icon_right">
                                        <div className="position-relative mr-auto feature_card roadmap_card p-4 d-flex align-items-center justify-content-xl-end justify-content-center">
                                            <div className="mr-xl-5 text-center text-xl-right">
                                                <div className="d-flex d-xl-none mb-3 justify-content-center align-items-center">
                                                <img src={Web} />
                                                </div>
                                                <h6 className="text-white-50">(January)</h6>
                                                <h1>Organize Team<br/>Start Development</h1>
                                            </div>
                                            <div className="icon_round_left d-xl-flex d-none justify-content-center align-items-center">
                                            <img src={Web} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md="6" className="pb-3 py-xl-5">
                            <div className="position-relative ml-auto feature_card">
                                    <div className="icon_right">
                                        <div className="position-relative ml-auto feature_card roadmap_card p-4 d-flex align-items-center justify-content-start">
                                            <div className="ml-xl-5 mx-auto text-center text-xl-left">
                                            <div className="d-flex d-xl-none mb-3 justify-content-center align-items-center">
                                                    <img src={Hierarchy} />
                                                </div>
                                                <h6 className="text-white-50">(February - March)</h6>
                                                <h1>WhitePaper<br/>Landing Page</h1>
                                            </div>
                                            <div className="icon_round d-xl-flex d-none justify-content-center align-items-center">
                                                <img src={Hierarchy} />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div>
                                    <img src={Line} className="icon_line_roadmap d-none d-lg-block" />
                                </div>
                            </Col>

                            <Col md="6" className="line_side py-3 py-xl-5">
                                <div className="position-relative mr-auto feature_card">
                                    <div className="icon_right">
                                        <div className="position-relative mr-auto feature_card roadmap_card p-4 d-flex align-items-center justify-content-center justify-content-xl-end">
                                            <div className="mr-xl-5 text-center text-xl-right">
                                                <div className="d-flex d-xl-none mb-3 justify-content-center align-items-center">
                                                <img src={Seeting2} />
                                                </div>
                                                <h6 className="text-white-50">(April)</h6>
                                                        <h1>Pre-Sale<br/>
                                                        ICO<br/>
                                                        Farming Pool</h1>
                                            </div>
                                            <div className="icon_round_left d-xl-flex d-none justify-content-center align-items-center">
                                            <img src={Seeting2} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md="6" className="py-3 py-xl-5">
                            <div className="position-relative ml-auto feature_card">
                                    <div className="icon_right">
                                        <div className="position-relative ml-auto feature_card roadmap_card p-4 d-flex align-items-center justify-content-start">
                                            <div className="ml-xl-5  mx-auto  text-center text-xl-left">
                                            <div className="d-flex d-xl-none mb-3 justify-content-center align-items-center">
                                                    <img src={Rocket} />
                                                </div>
                                                <h6 className="text-white-50">(May - June)</h6>
                                                <h1>Launch<br/>
                                                PayrLink v1.0</h1>
                                            </div>
                                            <div className="icon_round d-xl-flex d-none justify-content-center align-items-center">
                                                <img src={Rocket} />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div>
                                    <img src={Line} className="icon_line_roadmap d-none d-lg-block" />
                                </div>
                            </Col>

                            <Col md="6" className="pb-3 pb-xl-5">
                            <div className="position-relative mx-auto feature_card">
                                    <div className="icon_top">
                                        <div className="position-relative mx-auto roadmap_card p-4 d-flex align-items-center justify-content-center">
                                            <div className=" text-xl-right text-center mt-5">
                                            <div className="d-flex d-xl-none mb-3 justify-content-center align-items-center">
                                                    <img src={Hand} />
                                                </div>
                                                <h6 className="text-white-50">(June - )</h6>
                                                <h1>Update Platform Juror<br/>
                                                Reputations Private Solution<br />
                                                Arbitration Engine</h1>
                                            </div>
                                            <div className="icon_round d-xl-flex d-none justify-content-center align-items-center">
                                                <img src={Hand} />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                6+
                            </Col>
                        </Row>
                    </div>
                </Col>
                </Row>

                <Row>
                    <Col md="12" className="px-0">
                        <img src={Cloud} alt="" width="100%" />
                    </Col>
                </Row>
            </>
        );
    }
}

export default roadmap;
