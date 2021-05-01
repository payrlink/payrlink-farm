import React, { Component } from "react";
import { Typography } from "antd";
import FormData from "./FormData";

const { Title } = Typography;

class Step4 extends Component {
  state = {
    que_value8: 0
  };
  onChange8 = e => {
    this.setState({
      que_value8: e.target.value
    });
  };

  render() {
    const { form, data, formFields } = this.props;

    return (
      <div className="register_stepper_form">
        <Title className="text_app_color_light" level={4}>
          {data.title}
        </Title>

        {/* dynamic question start */}
        <FormData form={form} data={data} formFields={formFields} />
        {/* dynamic question end */}
      </div>
    );
  }
}

const WrappedStep4 = Step4;
export default WrappedStep4;
