import React, { Component } from "react";
import { Row, Col, Breadcrumb, Typography, Input, Select } from "antd";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import StudyCard from "../components/studies/StudyCard";

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export class PandingStudies extends Component {
  render() {
    return (
      <div>
        <Header />
        <Row type="flex" justify="center" className="container_padding min-height-cal-regular">
          <Col
            xs={{ span: 22 }}
            sm={{ span: 22 }}
            md={{ span: 22 }}
            lg={{ span: 18 }}
          >
            <Row
              type="flex"
              justify="center"
              align="middle"
              style={{
                borderBottom: "1px solid #D9D9D9",
                padding: "1em 0"
              }}
            >
              <Col span={12}>
                <Text className="text_app_color text_semibold text_large">
                  Pending Studies
                </Text>
              </Col>
              <Col span={12}>
                <Breadcrumb style={{ float: "right" }}>
                  <Breadcrumb.Item>BPRG</Breadcrumb.Item>
                  <Breadcrumb.Item>Pending Studies</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <Row type="flex" align="middle" style={{ margin: "1em 0 2em 0" }}>
              <Col
                xs={{ span: 10 }}
                sm={{ span: 8 }}
                md={{ span: 6 }}
                lg={{ span: 3 }}
                style={{ margin: "0.5em 0" }}
              >
                <Text className="text_large">50 Studies</Text>
              </Col>
              <Col
                xs={{ span: 14 }}
                sm={{ span: 18 }}
                md={{ span: 18 }}
                lg={{ span: 8 }}
                style={{ margin: "0.5em 0" }}
              >
                <Search
                  placeholder="input search text"
                  onSearch={value => console.log(value)}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 13 }}
                style={{ margin: "0.5em 0" }}
              >
                <div style={{ float: "right" }}>
                  <Text
                    className="text_gray-3 text_small"
                    style={{ marginRight: "20px" }}
                  >
                    <i className="icon-sort-by " />
                    Sort by
                  </Text>
                  <Select defaultValue="latest">
                    <Option value="old">Oldest First</Option>
                    <Option value="latest">Latest First</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <StudyCard />
          </Col>
        </Row>

        <Footer />
      </div>
    );
  }
}

export default PandingStudies;
