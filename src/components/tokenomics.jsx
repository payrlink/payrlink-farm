import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Cloud1 from "../assets/cloud1.png";
import { Doughnut } from 'react-chartjs-2';
import Ellipse1 from "../assets/Ellipse1.png";
import Ellipse2 from "../assets/Ellipse2.png";
import Ellipse3 from "../assets/Ellipse3.png";
import Ellipse4 from "../assets/Ellipse4.png";
import Ellipse5 from "../assets/Ellipse5.png";
import Ellipse6 from "../assets/Ellipse6.png";

const labels = [
    'Pool Mining',
    'Public Sale',
    'Reserved for the long-term operations',
    'Reserved for the Dev team',
    'Reserved for the Advisors',
    'Pre-sale',
  ];
  
const data = {
    labels: labels,
    datasets: [{

      backgroundColor: ['#3266CC','#D7350F','#FF9600','#049E1C','#910792','#0398C3'],
      borderColor: ['#3266CC','#D7350F','#FF9600','#049E1C','#910792','#0398C3'],
      data: [40, 20, 20, 10, 5,5],
    }]
  };
  
  const data1 = [{
    icon: Ellipse1,
    perc: "40%",
    name: "Pool Mining"
  },
  {
    icon: Ellipse2,
    perc: "20%",
    name: "Public Sale"
  },
  {
    icon: Ellipse3,
    perc: "20%",
    name: "Reserved for the long-term operations"
  },
  {
    icon: Ellipse4,
    perc: "10%",
    name: "Reserved for the Dev team"
  },
  {
    icon: Ellipse5,
    perc: "5%",
    name: "Reserved for the Advisors"
  },
  {
    icon: Ellipse6,
    perc: "5%",
    name: "Pre-sale"
  }
]

const icoData = [
    {
        raised: '< 300 ETH',
        bonus: '7.8% ~ 10.5%'
    },
    {
        raised: '< 500 ETH',
        bonus: '5.2% ~ 7.8%'
    },
    {
        raised: '< 700 ETH',
        bonus: '2.6% ~ 5.2%'
    },
    {
        raised: '< 1000 ETH',
        bonus: '0% ~ 2.6%'
    }
]

class tokenomics extends Component {
    
    render() {
        return (
           <> <Row className="px-3 px-xl-5">
                <Col xl="12">
                    <h1 className="text-white font-weight-bold py-3 py-xl-5 text-center">Tokenomics</h1>
                </Col>
                <Col xl="6" className="px-xl-5 mb-5">
                    <div className="chart_sec p-3 pb-5 p-xl-5 h-100">
                    <div className="chart_container mx-auto py-5">
                    <Doughnut
                            id="chart-area"
                            data={data}
                            width={60}
                            height={60}
                            options={{ maintainAspectRatio: false }}
                            
                            options={{
                                
                            cutoutPercentage: 70,
                            tooltips: {
                                enabled: true,
                            },
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                datalabels: {
                                display: false,
                                },
                            },
                            }}
                        />
                        </div>
                        <table className="text-white mx-auto">
                            {data1.map(e => 
                            (<tr>
                                <td><img src={e.icon} className="mb-2 mr-3" height={20} /></td>
                                <td><h3 className="mb-2 mr-5 text-right">{e.perc}</h3></td>
                                <td><h3 className="mb-2 text-white-50">{e.name}</h3></td>
                            </tr>
                            ))}
                        </table>
                    </div>
                </Col>
                <Col xl="6" className="px-md-5 mb-5 tokenomics_side">
                    <div className="chart_sec mb-5 text-white text-center">
                        <div className="lable_top d-flex justify-content-center">
                            <h3 className="font-weight-bold py-2 rounded-bottom">PRE-SALE</h3>
                        </div>
                        <div>
                            <h4 className="my-4">Target - to Raise ETH 300</h4>
                            <div className="round_div mx-auto my-5">
                                <h1>10%</h1>
                                <h5>Special Bonus</h5>
                            </div>
                            <div className="pb-5">
                                <span className="price_tag px-5 py-2">Price 1 PAYR</span>
                            </div>
                        </div>
                    </div>
                    <div className="chart_sec text-white text-center">
                        <div className="lable_top d-flex justify-content-center">
                            <h3 className="font-weight-bold py-2 rounded-bottom">ICO</h3>
                        </div>
                        <div>
                            <h4 className="my-4">Target – to Raise ETH 1,000</h4>
                            
                            <div className="pb-5 mt-5">
                                <span className="price_tag px-5 py-2">Price 1 PAYR</span>
                            </div>
                            <div>
                                <h3>Bonus for ICO:</h3>
                                <table className="d-flex justify-content-center pb-5">
                                    <tbody>
                                        <tr className="mb-3">
                                            <td className="text-center mr-4" style={{color:"#0398C3"}}><h4 className="font-weight-bold my-3">ETH Raised</h4></td>
                                            <td className="text-center " style={{color:"#0398C3"}}><h4 className="font-weight-bold my-3">Bonus</h4></td>
                                        </tr>
                                    {icoData.map(e=> (
                                    <tr>
                                        <td><h4 className="mr-5 text-left">{e.raised}</h4></td>
                                        <td className="text-right"><h4>{e.bonus}</h4></td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xl="12" className="px-0">
                    <img src={Cloud1} alt="" width="100%" />
                </Col>
        </Row>
        </>
        );
    }
}

export default tokenomics;
