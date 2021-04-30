import React, { Component } from 'react';
import moment from "moment";


class timeCounter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            days:0,
            hours:0,
            minutes:0,
            seconds:0,
            interval:0,
            duration: null
        };
       
      }

      componentDidMount() {
        var eventTime= moment(this.props.timeTillDate,this.props.timeFormat).unix(); 
        var currentTime = moment().unix();
        var diffTime = eventTime - currentTime;
        var duration = moment.duration(diffTime*1000, 'milliseconds');

        if(duration>0){
        this.countDownTimer=setInterval(()=>{
            duration = moment.duration(duration - 1000, 'milliseconds');
            this.setState({
                duration
            })
          }, 1000);
        }
      }
      componentWillUnmount() {
        clearInterval(this.countDownTimer);
      }
      

    render() {
        return (
            <div className="bg-white d-flex justify-content-center counter_white">
                            <div className="text-center">
                                <h1 className="px-md-3 px-2 text_large font-weight-bold">{parseInt(this.state.duration?.asDays()??0)}</h1>
                                <h6>DAYS</h6>
                            </div>
                            <h1 className="px-md-3 px-2 text_large font-weight-bold">:</h1>
                            <div className="text-center">
                                <h1 className="px-md-3 px-2 text_large font-weight-bold">{this.state.duration?.hours()??"0"}</h1>
                                <h6>HOURS</h6>
                            </div>
                            <h1 className="px-md-3 px-2 text_large font-weight-bold">:</h1>
                            <div className="text-center">
                                <h1 className="px-md-3 px-2 text_large font-weight-bold">{this.state.duration?.minutes()??"0"}</h1>
                                <h6>MINUTES</h6>
                            </div>
                            <h1 className="px-md-3 px-2 text_large font-weight-bold">:</h1>
                            <div className="text-center">
                                <h1 className="px-md-3 px-2 text_large font-weight-bold">{this.state.duration?.seconds()??"0"}</h1>
                                <h6>SECONDS</h6>
                            </div>
                        </div>
        );
    }
}

export default timeCounter;
