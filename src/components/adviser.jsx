import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Linkdin from "../assets/linkdin.svg";
import Github from "../assets/github.svg";
import Twitter from "../assets/twitter.svg";
import Discord from "../assets/discord.svg";
import Telegram from "../assets/telegram.svg";

const teamData = [
    {
        name: "Bennett Mason",
        occupation: "(Founder of Stokely Marcus)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Bennett Mason is one of our great Advisors and he is pushing our project to the great future success. He is one of the DeFi enthusiasm and always passionate for challenges which can change the world."
    },
    {
        name: "Bennett Mason",
        occupation: "(Founder of Stokely Marcus)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Bennett Mason is one of our great Advisors and he is pushing our project to the great future success. He is one of the DeFi enthusiasm and always passionate for challenges which can change the world."
    }
]

class adviser extends Component {
    render() {
        return (
            <Row className="app_secondery px-2 px-md-5 pb-5">
                <Col md="12">
                    <h1 className="text-white font-weight-bold my-5 pt-md-5 text-center">Our Advisors</h1>
                </Col>
                <Col md="12" className="adviser_section py-3 py-md-5">
                    <Row className="d-flex justify-content-center align-items-center">
                        {teamData.map(e=> (
                            <Col md="6" xl="4" className="mb-3 mb-md-0">
                            <div className="adviser_card text-white">
                                <h2 className="font-weight-bold">{e.name}</h2>
                                <h4 className="text-white-50">{e.occupation}</h4>
                                <div className="d-flex my-4">
                                    <div className="icon_over mr-2">
                                        <a href={e.linkdin}><img src={Linkdin} width="20" alt="" /></a>
                                    </div>
                                    <div className="icon_over mr-2">
                                        <a href={e.github}><img src={Github} width="28" alt="" /></a>
                                    </div>
                                    <div className="icon_over mr-2">
                                        <a href={e.twitter}><img src={Twitter} width="20" alt="" /></a>
                                    </div>
                                    <div className="icon_over mr-2">
                                        <a href={e.telegram}><img src={Telegram} width="20" alt="" /></a>
                                    </div>
                                    <div className="icon_over mr-2">
                                        <a href={e.discord}><img src={Discord} width="28" alt="" /></a>
                                    </div>
                                </div>
                                <h5 className="font-weight-normal mb-5">
                                    {e.discreption}
                                </h5>
                            </div>
                        </Col>
                        
                        ))}
                        
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default adviser;
