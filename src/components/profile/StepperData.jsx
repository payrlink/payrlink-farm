/* eslint-disable array-callback-return */
import React from "react";
import { Col, Row } from "antd";

const SubQueData = (subProps) => {
  return subProps
    ? subProps.subQueData.map((subQuestionData, i) => {
        switch (subQuestionData.questions_type.type) {
          case "input":
            return (
              <Col className="gutter-row mb-2" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {subQuestionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    {subQuestionData.answers_list[0].answer !== null
                      ? subQuestionData.answers_list[0].answer
                      : "---"}
                  </p>
                </div>
              </Col>
            );
          case "textarea":
            return (
              <Col className="gutter-row mb-2" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {subQuestionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    {subQuestionData.answers_list[0].answer !== null
                      ? subQuestionData.answers_list[0].answer
                      : "---"}
                  </p>
                </div>
              </Col>
            );

          case "checkbox":
            return (
              <Col className="gutter-row mb-2" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {subQuestionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    {subQuestionData.options.map((option) => (
                      <span>
                        {option.selected === true && option.option_title}
                        ,&nbsp;
                      </span>
                    ))}
                  </p>
                </div>
              </Col>
            );

          case "radio":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {subQuestionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    <span>
                      {subQuestionData.answers_list[0].options.option_title}
                    </span>
                    <br />
                    {subQuestionData.answers_list[0].extra_note !== null && (
                      <span>
                        {`Note: ${subQuestionData.answers_list[0].extra_note}`}
                      </span>
                    )}
                  </p>
                </div>
              </Col>
            );

          case "select":
            return (
              <Col className="gutter-row mb-2" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {subQuestionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    {subQuestionData.options.map((option) => (
                      <span>
                        {option.selected === true && option.option_title}
                      </span>
                    ))}
                  </p>
                </div>
              </Col>
            );

          case "file":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {subQuestionData.question_title}
                  </p>
                  <p>
                    <a
                      href={subQuestionData.answers_list[0].file_path}
                      target={"_blank"}
                      rel="noopener noreferrer"
                    >
                      {subQuestionData.answers_list[0].file_name}
                    </a>
                  </p>
                </div>
              </Col>
            );
          default:
            break;
        }
      })
    : null;
};

const StepperData = (props) => {
  return props.QueData
    ? props.QueData.questions_list.map((questionData, i) => {
        switch (questionData.questions_type.type) {
          case "input":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {questionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    {questionData.answers_list[0].answer !== null
                      ? questionData.answers_list[0].answer
                      : "---"}
                  </p>
                </div>
              </Col>
            );
          case "textarea":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {questionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    {questionData.answers_list[0].answer !== null
                      ? questionData.answers_list[0].answer
                      : "---"}
                  </p>
                </div>
              </Col>
            );

          case "checkbox":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {questionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    {questionData.answers_list.map((answer) => (
                      <span>
                        {answer.options && answer.options.option_title}
                        ,&nbsp;
                      </span>
                    ))}
                  </p>
                </div>
              </Col>
            );

          case "radio":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {questionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    <span>
                      {questionData.answers_list[0].options &&
                        questionData.answers_list[0].options.option_title}
                    </span>
                    <br />
                    {questionData.answers_list[0].extra_note !== null && (
                      <span>{`Note: ${questionData.answers_list[0].extra_note}`}</span>
                    )}
                  </p>
                </div>
              </Col>
            );

          case "select":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {questionData.question_title}
                  </p>
                  <p className="text_gray-3">
                    <span>
                      {questionData.answers_list[0].options.option_title}
                    </span>
                  </p>
                </div>
              </Col>
            );

          case "percent":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {questionData.question_title}
                  </p>
                  <Row>
                    {questionData.options.map((option) => (
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 8 }}
                        lg={{ span: 6 }}
                      >
                        <p>{option.option_title}</p>
                        <p className="text_gray-3">
                          {option.selectedPercent !== undefined
                            ? option.selectedPercent
                            : 0}
                          %
                        </p>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
            );

          case "file":
            return (
              <Col className="gutter-row" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize">
                    {questionData.question_title}
                  </p>
                  <p>
                    <a
                      href={
                        questionData.answers_list &&
                        questionData.answers_list[0].file_path
                      }
                      target={"_blank"}
                      rel="noopener noreferrer"
                    >
                      {questionData.answers_list &&
                        questionData.answers_list[0].file_name}
                    </a>
                  </p>
                </div>
              </Col>
            );

          case "sub":
            return (
              <Col className="gutter-row mb-2" span={24}>
                <div className="gutter-box">
                  <p className="text_gray-4 text-capitalize mb-0">
                    {questionData.question_title}
                  </p>

                  <Row style={{ paddingLeft: "16px" }}>
                    <SubQueData subQueData={questionData.sub_questions} />
                  </Row>
                </div>
              </Col>
            );

          default:
            break;
        }
      })
    : null;
};

export default StepperData;
