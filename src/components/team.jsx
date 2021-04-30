import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Linkdin from "../assets/linkdin.svg";
import Github from "../assets/github.svg";
import Twitter from "../assets/twitter.svg";
import Discord from "../assets/discord.svg";
import Telegram from "../assets/telegram.svg";

const teamData = [
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    },
    {
        name: "Maxsim Boiko J.",
        occupation: "(Founder & CEO)",
        linkdin: "#",
        github: "#",
        twitter: "#",
        telegram: "#",
        discord: "#",
        discreption:"Maxsim Boiko is highly motivated Founder of PayrLink with a combined experience in blockchain, which includes leadership, program and organizational development. Specialized expertise in the development of innovative Defi and he is pushing Payrlink to the goal of next generation Escrow."
    }
]

class team extends Component {
    render() {
        return (
            <>
            <Row className="app_secondery px-5">
                <Col md="12" xl="12">
                    <h1 className="text-white font-weight-bold my-5 py-3 py-md-5 text-center">Our Team</h1>
                </Col>
            </Row>
            <Row className="px-md-5 app_secondery text-white">
                
                {teamData.map(e=> (<Col md="6" xl="4" className="my-3">
                    <div className="card_div">
                       <h2 className="font-weight-bold">{e.name}</h2>
                       <h4 className="text-white-50">{e.occupation}</h4>
                        <div className="d-flex my-4">
                            <div className="icon_over mr-3">
                                <a href={e.linkdin}><img src={Linkdin} width="20" alt="" /></a>
                            </div>
                            <div className="icon_over mr-3">
                                <a href={e.github}><img src={Github} width="28" alt="" /></a>
                            </div>
                            <div className="icon_over mr-3">
                                <a href={e.twitter}><img src={Twitter} width="20" alt="" /></a>
                            </div>
                            <div className="icon_over mr-3">
                                <a href={e.telegram}><img src={Telegram} width="20" alt="" /></a>
                            </div>
                            <div className="icon_over mr-3">
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
            </>
        );
    }
}

export default team;
