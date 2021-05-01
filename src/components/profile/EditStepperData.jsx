/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Col,
  Row,
  Form,
  Input,
  Radio,
  Checkbox,
  Select,
  Slider,
  Progress,
  Upload,
  Button,
  notification
} from "antd";

const { TextArea } = Input;
const { Option } = Select;
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
  marginLeft: 0
};

const checkStyle = {
  display: "block",
  // height: "30px",
  lineHeight: "30px",
  marginLeft: 0
};

// file format and type check
const beforeUpload = file => {
  const isFileFormate =
    file.type === "application/pdf" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel" ||
    file.type === "text/csv" ||
    file.type === "text" ||
    file.type === "text/plain";
  if (!isFileFormate) {
    notification.error({
      message: "Invalid file format!"
    });
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    notification.error({
      message: "File size must smaller than 5MB!"
    });
  }

  return isFileFormate && isLt5M;
};

// request for file upload start
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 10);
};

const SubQueData = props => {
  const { getFieldDecorator } = props.form;
  const que_list = props.subQueData;
  const step_id = props.stepId;

  let finalSliderValue = {};
  let sum = {};

  que_list
    .filter(item => item.questions_type.type === "percent")
    .map(filteredItem => {
      let prevSliderValue = {};
      let total = 0;
      
      filteredItem.options.map(queAns => {
        
        prevSliderValue[queAns.id] = parseInt(queAns.selectedPercent, 10)
          ? parseInt(queAns.selectedPercent, 10)
          : 0;
        total += queAns.selectedPercent
          ? parseInt(queAns.selectedPercent, 10)
          : 0;
      });
      sum[filteredItem.id] = total;
      finalSliderValue[filteredItem.id] = prevSliderValue;
    });

  let updatedValues = [];
  que_list
    .filter(item => item.questions_type.type === "radio")
    .map(filteredItem => {
      filteredItem.options.map(queAns => {
        if (queAns.selectedID) {
          updatedValues.push({
            id: filteredItem.id,
            value: queAns.selectedID
          });
        }
      });
    });

  const [values, setValue] = useState(updatedValues);
  const [slider, setSlider] = useState(finalSliderValue);
  const [progress_value, setProgress_value] = useState(sum);

  // slider value change start
  const onChangeslidervalue = async (
    id,
    value,
    props,
    parentQueId,
    mainqueid,
    stepId
  ) => {
    const { form, formFields } = props;
    let updatedProgressValue = {
      ...slider[mainqueid],
      ...{ [id]: value }
    };
    let sum = 0;
    Object.values(updatedProgressValue).map(item => {
      sum += item;
    });

    let updatedSum = { ...progress_value };
    let updatedSliderValue = { ...slider };
    updatedSliderValue[mainqueid] = updatedProgressValue;
    updatedSum[mainqueid] = sum;

    setProgress_value(updatedSum);
    setSlider({ ...updatedSliderValue });

    form.setFieldsValue({
      [`[${stepId}][${parentQueId}][sub_questions][${mainqueid}][percentage]${id}`]: value.toString()
    });

    form.setFieldsValue({
      [`[${stepId}][${parentQueId}][sub_questions][${mainqueid}][percentage]total`]: updatedSum[
        mainqueid
      ]
    });
  };
  // slider value change end

  //slider value validation
  const validateSliderValue = async (rule, value, callback) => {
    const { form } = props;
    if (value > 100) {
      await callback("Total Value should be less then 100!");
    } else {
      await callback();
    }
  };

  //radio change event
  const onChange = (e, q_id) => {
    let updatedValues = [...values];
    let temp = {
      value: e.target.value,
      id: q_id
    };
    let val = updatedValues.filter(item => item.id !== q_id);
    val.push(temp);
    setValue(val);
  };

  // file upload start

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileList, setSelectedFileList] = useState([]);

  const onChangeUploadSub = (info, subQueId) => {
    const { form } = props;
    switch (info.file.status) {
      case "uploading":
        let updatedFileList = { ...selectedFileList };
        updatedFileList[subQueId] = [info.fileList.pop()];
        setSelectedFileList(updatedFileList);
        break;
      case "done":
        console.log("done");

        break;

      default:
        // error or removed
        setSelectedFile(null);
        setSelectedFileList([]);
    }
  };

  return que_list
    ? que_list.map((subQuestionData, i) => {
        switch (subQuestionData.questions_type.type) {
          case "input":
            return (
              <Form.Item
                label={subQuestionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(
                  `[${step_id}][${subQuestionData.parent_question_id}][sub_questions][${subQuestionData.id}][answer]`,
                  {
                    initialValue:
                      subQuestionData.edit_answers_list.length > 0 &&
                      subQuestionData.edit_answers_list[0].answer,
                    rules: [
                      {
                        required: subQuestionData.is_required,
                        message: "This Field is Required!"
                      },
                      {
                        whitespace: true,
                        message: "This Field cannot be empty"
                      }
                    ]
                  }
                )(
                  <Input
                    className="field_custome_hight"
                    placeholder={subQuestionData.placeholder}
                  />
                )}
              </Form.Item>
            );

          case "textarea":
            return (
              <Form.Item
                label={subQuestionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(
                  `[${step_id}][${subQuestionData.parent_question_id}][sub_questions][${subQuestionData.id}][answer]`,
                  {
                    initialValue:
                      subQuestionData.edit_answers_list.length > 0 &&
                      subQuestionData.edit_answers_list[0].answer,
                    rules: [
                      {
                        required: subQuestionData.is_required,
                        message: "This Field is Required!"
                      },
                      {
                        whitespace: true,
                        message: "This Field cannot be empty"
                      }
                    ]
                  }
                )(
                  <TextArea
                    className="field_custome_hight"
                    rows={3}
                    placeholder={subQuestionData.placeholder}
                  />
                )}
              </Form.Item>
            );

          case "checkbox":
            return (
              <Form.Item
                label={subQuestionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(
                  `[${step_id}][${subQuestionData.parent_question_id}][sub_questions][${subQuestionData.id}][checkbox]`,
                  {
                    initialValue: subQuestionData.selectedOptions,

                    rules: [
                      {
                        required: subQuestionData.is_required,
                        message: "This Field is Required!"
                      }
                    ]
                  }
                )(
                  <Checkbox.Group>
                    {subQuestionData.options.map((option, option_key) => (
                      <Checkbox
                        style={checkStyle}
                        value={option.id}
                        key={option_key}
                      >
                        {option.option_title}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
              </Form.Item>
            );

          case "radio":
            return (
              <div>
                <Form.Item
                  label={subQuestionData.question_title}
                  labelCol={{ span: 24 }}
                  key={i}
                >
                  {getFieldDecorator(
                    `[${step_id}][${subQuestionData.parent_question_id}][sub_questions][${subQuestionData.id}]option`,
                    {
                      initialValue: subQuestionData.selectedOptions[0],
                      rules: [
                        {
                          required: subQuestionData.is_required,
                          message: "This Field is Required!"
                        }
                      ]
                    }
                  )(
                    <Radio.Group
                      onChange={e => onChange(e, subQuestionData.id)}
                      value={values}
                      style={{ width: "100%" }}
                    >
                      {subQuestionData.options.map((option, option_key) => (
                        <div>
                          <Radio
                            style={radioStyle}
                            value={option.id}
                            key={option_key}
                          >
                            {option.option_title}
                          </Radio>

                          {option.extra_note === 1 &&
                          values.filter(
                            item =>
                              item.id === subQuestionData.id &&
                              item.value === option.id
                          ).length === 1 ? (
                            <Form.Item>
                              {getFieldDecorator(
                                `[${step_id}][${subQuestionData.parent_question_id}][sub_questions][${subQuestionData.id}]extranote`,
                                {
                                  initialValue:
                                    subQuestionData.edit_answers_list.length >
                                      0 &&
                                    subQuestionData.edit_answers_list[0] !==
                                      undefined
                                      ? subQuestionData.edit_answers_list[0]
                                          .extra_note
                                      : null,
                                  rules: [
                                    {
                                      required: true,
                                      message: "This Field is Required!"
                                    },
                                    {
                                      whitespace: true,
                                      message: "This Field cannot be empty"
                                    }
                                  ]
                                }
                              )(
                                <Input
                                  className="field_custome_hight"
                                  placeholder={option.placeholder}
                                />
                              )}
                            </Form.Item>
                          ) : null}
                        </div>
                      ))}
                    </Radio.Group>
                  )}
                </Form.Item>
              </div>
            );

          case "select":
            return (
              <Form.Item
                label={subQuestionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(
                  `${subQuestionData.parent_question_id}[sub_questions][${subQuestionData.id}][option]`,
                  {
                    initialValue:
                      subQuestionData.edit_answers_list !== undefined
                        ? subQuestionData.edit_answers_list.length > 0 &&
                          subQuestionData.edit_answers_list[0].option_id
                        : [],
                    rules: [
                      {
                        required: subQuestionData.is_required,
                        message: "This Field is Required!"
                      }
                    ]
                  }
                )(
                  <Select
                    className="field_custome_hight"
                    showSearch
                    placeholder="Select From below Options"
                    optionFilterProp="children"
                  >
                    {subQuestionData.options.map((option, option_key) => (
                      <Option value={option.id} key={option_key}>
                        {option.option_title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            );

          case "percent":
            return (
              <Form.Item
                label={subQuestionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
                className="custom_slider"
              >
                <div>
                  {subQuestionData.options.map((option, option_key) => (
                    <Form.Item key={option_key}>
                      {getFieldDecorator(
                        `[${step_id}][${subQuestionData.parent_question_id}][sub_questions][${subQuestionData.id}][percentage]${option.id}`,
                        {
                          initialValue:
                            option.selectedPercent !== undefined
                              ? option.selectedPercent
                              : 0,
                          rules: [
                            {
                              required: false
                            }
                          ]
                        }
                      )(
                        <div>
                          <h4 style={{ lineHeight: "normal", marginBottom: 0 }}>
                            {option.option_title}
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <h4
                              style={{ paddingRight: "20px", marginBottom: 0 }}
                              className="text_gray-3"
                            >
                              {slider[subQuestionData.id][option.id]}%
                            </h4>
                            <Slider
                              style={{ width: "100%" }}
                              defaultValue={
                                slider[subQuestionData.id][option.id]
                              }
                              onChange={e =>
                                onChangeslidervalue(
                                  option.id,
                                  e,
                                  props,
                                  subQuestionData.parent_question_id,
                                  subQuestionData.id,
                                  step_id
                                )
                              }
                            />
                          </div>
                        </div>
                      )}
                    </Form.Item>
                  ))}
                </div>
                <div>
                  <h4 style={{ lineHeight: "normal", marginBottom: 0 }}>
                    Total
                  </h4>
                  <Form.Item>
                    {getFieldDecorator(
                      `[${step_id}][${subQuestionData.parent_question_id}][sub_questions][${subQuestionData.id}][percentage]total`,
                      {
                        initialValue:
                          progress_value[subQuestionData.id] !== undefined
                            ? progress_value[subQuestionData.id]
                            : 0,
                        rules: [
                          {
                            required: subQuestionData.is_required,
                            message: "This Field is Required!"
                          },
                          {
                            validator: validateSliderValue
                          }
                        ]
                      }
                    )(
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <h4
                          style={{ paddingRight: "20px", marginBottom: 0 }}
                          className="text_gray-3"
                        >
                          {progress_value[subQuestionData.id]}%
                        </h4>
                        <Progress
                          // percent={progress_value[subQuestionData.id]}
                          percent={progress_value[subQuestionData.id]}
                          showInfo={false}
                          strokeColor="#61AF46"
                        />
                      </div>
                    )}
                  </Form.Item>
                </div>
              </Form.Item>
            );

          case "file":
            const propsForUpload = {
              defaultFileList: subQuestionData.edit_answers_list.map(item => ({
                uid: item.id.toString(),
                name: item.file_name,
                status: "done",
                url: item.file_path
              })),
              accept:
                ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain,.xls,.xlsx, .pdf",
              customRequest: dummyRequest,
              beforeUpload: beforeUpload,
              onChange: e => onChangeUploadSub(e, subQuestionData.id)
            };

            if (selectedFileList && selectedFileList.length !== 0) {
              if (!Array.isArray(selectedFileList)) {
                if (
                  Object.keys(selectedFileList).includes(
                    subQuestionData.id.toString()
                  )
                ) {
                  delete propsForUpload.defaultFileList;
                  propsForUpload.fileList =
                    selectedFileList[subQuestionData.id];
                }
              }
            }
            return (
              <Form.Item
                label={subQuestionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(
                  `[${step_id}][${subQuestionData.parent_question_id}][sub_questions][${subQuestionData.id}][upload]`,
                  {
                    rules: [
                      {
                        required:
                          subQuestionData.is_required ||
                          !subQuestionData.edit_answers_list,
                        message: "This Field is Required!"
                      }
                    ]
                  }
                )(
                  // <Upload
                  //   // showUploadList={false}
                  //   accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain,.xls,.xlsx, .pdf"
                  //   fileList={selectedFileList}
                  //   customRequest={dummyRequest}
                  //   beforeUpload={beforeUpload}
                  //   onChange={(e, filelst) =>
                  //     onChangeUploadSub(e, filelst, subQuestionData.id)
                  //   }
                  // >

                  <Upload {...propsForUpload}>
                    <Button>Choose File</Button>
                    <small>
                      &nbsp;&nbsp;(Only accept .CSV, .txt, .doc, .docx, .xls,
                      .xlsx and .pdf file-format.)
                    </small>
                  </Upload>
                )}
              </Form.Item>
            );
          default:
            break;
        }
      })
    : null;
};

const EditStepperData = props => {
  const { getFieldDecorator } = props.form;
  const que_list = props.QueData;
  const step_id = props.step_id;

  let finalSliderValue = {};
  let sum = {};

  que_list.questions_list
    .filter(item => item.questions_type.type === "percent")
    .map(filteredItem => {
      let prevSliderValue = {};
      let total = 0;
      filteredItem.options.map(queAns => {
        prevSliderValue[queAns.id] = parseInt(queAns.selectedPercent, 10)
          ? parseInt(queAns.selectedPercent, 10)
          : 0;
        total += queAns.selectedPercent
          ? parseInt(queAns.selectedPercent, 10)
          : 0;
      });
      sum[filteredItem.id] = total;
      finalSliderValue[filteredItem.id] = prevSliderValue;
    });

  let updatedValues = [];
  que_list.questions_list
    .filter(item => item.questions_type.type === "radio")
    .map(filteredItem => {
      filteredItem.options.map(queAns => {
        if (queAns.selectedID) {
          updatedValues.push({
            id: filteredItem.id,
            value: queAns.selectedID
          });
        }
      });
    });

  const [values, setValue] = useState(updatedValues);
  const [slider, setSlider] = useState(finalSliderValue);
  const [progress_value, setProgress_value] = useState(sum);

  // slider value change start
  const onChangeslidervalue = async (id, value, props, mainqueid, stepId) => {
    const { form, formFields } = props;
    let updatedProgressValue = {
      ...slider[mainqueid],
      ...{ [id]: value }
    };
    let sum = 0;
    Object.values(updatedProgressValue).map(item => {
      sum += item;
    });

    let updatedSum = { ...progress_value };

    let updatedSliderValue = { ...slider };
    updatedSliderValue[mainqueid] = updatedProgressValue;
    updatedSum[mainqueid] = sum;

    setProgress_value(updatedSum);
    setSlider({ ...updatedSliderValue });

    form.setFieldsValue({
      [`[${stepId}][${mainqueid}][percentage]${id}`]: value.toString()
    });

    form.setFieldsValue({
      [`[${stepId}][${mainqueid}][percentage]total`]: updatedSum[mainqueid]
    });
  };
  // slider value change end

  //slider value validation
  const validateSliderValue = async (rule, value, callback) => {
    const { form } = props;
    if (value > 100) {
      await callback("Total Value should be less then 100!");
    } else {
      await callback();
    }
  };

  //radio change event
  const onChange = (e, q_id) => {
    let updatedValues = [...values];
    let temp = {
      value: e.target.value,
      id: q_id
    };
    let val = updatedValues.filter(item => item.id !== q_id);
    val.push(temp);
    setValue(val);
  };

  // file upload start

  // que_list.questions_list
  //   .filter(item => item.questions_type.type === "file")
  //   .map(filteredItem => {
  //     filteredItem.edit_answers_list.map(item=>{
  //       filedata[item.id]=item.file_path;
  //     })
  //   });

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileList, setSelectedFileList] = useState([]);

  const onChangeUploadMain = (info, mainQueId) => {
    const { form } = props;
    switch (info.file.status) {
      case "uploading":
        let updatedFileList = { ...selectedFileList };
        updatedFileList[mainQueId] = [info.fileList.pop()];
        setSelectedFileList(updatedFileList);
        break;
      case "done":
        console.log("done");
        // setSelectedFile(info.file.originFileObj);
        // setSelectedFileList([info.file]);
        break;

      default:
        // error or removed
        setSelectedFile(null);
        setSelectedFileList([]);
    }
  };

  return que_list
    ? que_list.questions_list.map((questionData, i) => {
        switch (questionData.questions_type.type) {
          case "input":
            return (
              <Form.Item
                label={questionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(`[${step_id}][${questionData.id}][answer]`, {
                  initialValue:
                    questionData.edit_answers_list.length > 0
                      ? questionData.edit_answers_list[0].answer
                      : null,
                  rules: [
                    {
                      required: true,
                      message: "This Field is Required!"
                    },
                    { whitespace: true, message: "This Field cannot be empty" }
                  ]
                })(
                  <Input
                    className="field_custome_hight"
                    placeholder={questionData.placeholder}
                  />
                )}
              </Form.Item>
            );

          case "textarea":
            return (
              <Form.Item
                label={questionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(`[${step_id}][${questionData.id}][answer]`, {
                  initialValue:
                    questionData.edit_answers_list.length > 0 &&
                    questionData.edit_answers_list[0].answer,
                  rules: [
                    {
                      required: true,
                      message: "This Field is Required!"
                    },
                    { whitespace: true, message: "This Field cannot be empty" }
                  ]
                })(
                  <TextArea
                    className="field_custome_hight"
                    rows={3}
                    placeholder={questionData.placeholder}
                  />
                )}
              </Form.Item>
            );

          case "checkbox":
            return (
              <Form.Item
                label={questionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(
                  `[${step_id}][${questionData.id}][checkbox]`,
                  {
                    initialValue: questionData.selectedOptions,
                    rules: [
                      {
                        required: false,
                        message: "This Field is Required!"
                      }
                    ]
                  }
                )(
                  <Checkbox.Group>
                    {questionData.options.map((option, option_key) => (
                      <Checkbox
                        style={checkStyle}
                        value={option.id}
                        key={option_key}
                      >
                        {option.option_title}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
              </Form.Item>
            );

          case "radio":
            return (
              <div>
                <Form.Item
                  label={questionData.question_title}
                  labelCol={{ span: 24 }}
                  key={i}
                >
                  {getFieldDecorator(`[${step_id}][${questionData.id}]option`, {
                    initialValue: questionData.selectedOptions[0],
                    rules: [
                      {
                        required: questionData.is_required,
                        message: "This Field is Required!"
                      }
                    ]
                  })(
                    <Radio.Group
                      onChange={e => onChange(e, questionData.id)}
                      value={values}
                      style={{ width: "100%" }}
                    >
                      {questionData.options.map((option, option_key) => (
                        <div>
                          <Radio
                            style={radioStyle}
                            value={option.id}
                            key={option_key}
                          >
                            {option.option_title}
                          </Radio>

                          {option.extra_note === 1 &&
                          values.filter(
                            item =>
                              item.id === questionData.id &&
                              item.value === option.id
                          ).length === 1 ? (
                            <Form.Item>
                              {getFieldDecorator(
                                `[${step_id}][${questionData.id}]extranote`,
                                {
                                  initialValue:
                                    questionData.edit_answers_list.length > 0 &&
                                    questionData.edit_answers_list[0] !==
                                      undefined
                                      ? questionData.edit_answers_list[0]
                                          .extra_note
                                      : null,
                                  rules: [
                                    {
                                      required: true,
                                      message: "This Field is Required!"
                                    },
                                    {
                                      whitespace: true,
                                      message: "This Field cannot be empty"
                                    }
                                  ]
                                }
                              )(
                                <Input
                                  className="field_custome_hight"
                                  placeholder={option.placeholder}
                                />
                              )}
                            </Form.Item>
                          ) : null}
                          {/* ) : null} */}
                        </div>
                      ))}
                    </Radio.Group>
                  )}
                </Form.Item>
              </div>
            );

          case "select":
            return (
              <Form.Item
                label={questionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(`[${step_id}][${questionData.id}][option]`, {
                  initialValue:
                    questionData.edit_answers_list !== undefined &&
                    questionData.edit_answers_list.length > 0
                      ? questionData.edit_answers_list[0].option_id
                      : [],
                  rules: [
                    {
                      required: questionData.is_required,
                      message: "This Field is Required!"
                    }
                  ]
                })(
                  <Select
                    className="field_custome_hight"
                    showSearch
                    placeholder="Select From below Options"
                    optionFilterProp="children"
                  >
                    {questionData.options.map((option, option_key) => (
                      <Option value={option.id} key={option_key}>
                        {option.option_title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            );

          case "percent":
            return (
              <Form.Item
                label={questionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
                className="custom_slider"
              >
                <div>
                  {questionData.options.map((option, option_key) => (
                    <Form.Item key={option_key}>
                      {getFieldDecorator(
                        `[${step_id}][${questionData.id}][percentage]${option.id}`,
                        {
                          initialValue:
                            option.selectedPercent !== undefined
                              ? option.selectedPercent
                              : 0,
                          rules: [
                            {
                              required: false
                            }
                          ]
                        }
                      )(
                        <div>
                          <h4 style={{ lineHeight: "normal", marginBottom: 0 }}>
                            {option.option_title}
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <h4
                              style={{ paddingRight: "20px", marginBottom: 0 }}
                              className="text_gray-3"
                            >
                              {slider[questionData.id][option.id]}%
                            </h4>
                            <Slider
                              style={{ width: "100%" }}
                              defaultValue={slider[questionData.id][option.id]}
                              onChange={e =>
                                onChangeslidervalue(
                                  option.id,
                                  e,
                                  props,
                                  questionData.id,
                                  step_id
                                )
                              }
                            />
                          </div>
                        </div>
                      )}
                    </Form.Item>
                  ))}
                </div>
                <div>
                  <h4 style={{ lineHeight: "normal", marginBottom: 0 }}>
                    Total
                  </h4>
                  <Form.Item>
                    {getFieldDecorator(
                      `[${step_id}][${questionData.id}][percentage]total`,
                      {
                        initialValue:
                          progress_value[questionData.id] !== undefined
                            ? progress_value[questionData.id]
                            : 0,
                        rules: [
                          {
                            required: questionData.is_required,
                            message: "This Field is Required!"
                          },
                          {
                            validator: validateSliderValue
                          }
                        ]
                      }
                    )(
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <h4
                          style={{ paddingRight: "20px", marginBottom: 0 }}
                          className="text_gray-3"
                        >
                          {progress_value[questionData.id]}%
                        </h4>
                        <Progress
                          percent={progress_value[questionData.id]}
                          showInfo={false}
                          strokeColor="#61AF46"
                        />
                      </div>
                    )}
                  </Form.Item>
                </div>
              </Form.Item>
            );

          case "file":
            const propsForUpload = {
              defaultFileList: questionData.edit_answers_list.map(item => ({
                uid: item.id.toString(),
                name: item.file_name,
                status: "done",
                url: item.file_path
              })),
              accept:
                ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain,.xls,.xlsx, .pdf",
              customRequest: dummyRequest,
              beforeUpload: beforeUpload,
              onChange: e => onChangeUploadMain(e, questionData.id)
            };

            if (selectedFileList && selectedFileList.length !== 0) {
              if (!Array.isArray(selectedFileList)) {
                if (
                  Object.keys(selectedFileList).includes(
                    questionData.id.toString()
                  )
                ) {
                  delete propsForUpload.defaultFileList;
                  propsForUpload.fileList = selectedFileList[questionData.id];
                }
              }
            }

            return (
              <Form.Item
                label={questionData.question_title}
                labelCol={{ span: 24 }}
                key={i}
              >
                {getFieldDecorator(`[${step_id}][${questionData.id}][upload]`, {
                  rules: [
                    {
                      required:
                        !questionData.edit_answers_list ||
                        questionData.is_required,
                      message: "This Field is Required!"
                    }
                  ]
                })(
                  <Upload {...propsForUpload}>
                    <Button>Choose File</Button>
                    <small>
                      &nbsp;&nbsp;(Only accept .CSV, .txt, .doc, .docx, .xls,
                      .xlsx and .pdf file-format.)
                    </small>
                  </Upload>
                )}
              </Form.Item>
            );

          case "sub":
            return (
              <div className="gutter-box">
                <p className="text_gray-4 text-capitalize mb-0">
                  {questionData.question_title}
                </p>
                <Row gutter={16} style={{ paddingLeft: "16px" }}>
                  <Col span={24}>
                    <SubQueData
                      subQueData={questionData.sub_questions}
                      form={props.form}
                      stepId={step_id}
                    />
                  </Col>
                </Row>
              </div>
            );

          default:
            break;
        }
      })
    : null;
};

export default EditStepperData;
