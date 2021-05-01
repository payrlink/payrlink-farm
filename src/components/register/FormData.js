/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Select,
  Slider,
  Progress,
  Upload,
  Button,
  notification,
  message
} from "antd";

const { TextArea } = Input;
const { Option } = Select;
const radioStyle = {
  display: "block",
  minHeight: "30px",
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

// request for file upload end

const SwitchSubQue = props => {
  const sub = props.sub_data;
  const { getFieldDecorator } = props.form;
  const sub_form_field = props.form_field;
  // const [values, setValue] = useState(1);

  const [values, setValue] = useState(
    sub
      .filter(item => item.questions_type.type === "radio")
      .map(filteredItem => ({
        id: filteredItem.id,
        value:
          sub_form_field && sub_form_field.sub_questions[filteredItem.id]
            ? sub_form_field.sub_questions[filteredItem.id].option
            : 0
      }))
  );

  let prevProgressValue = {};
  let prevSliderValue = {};
  sub
    .filter(item => item.questions_type.type === "percent")
    .map(filteredItem => {
      prevProgressValue[filteredItem.id] =
        sub_form_field && sub_form_field.sub_questions[filteredItem.id]
          ? sub_form_field.sub_questions[filteredItem.id].percentage.total
          : 0;
      prevSliderValue[filteredItem.id] = {};
      filteredItem.options.map(item => {
        prevSliderValue[filteredItem.id][item.id] =
          sub_form_field &&
          sub_form_field.sub_questions[filteredItem.id] &&
          sub_form_field.sub_questions[filteredItem.id].percentage
            ? sub_form_field.sub_questions[filteredItem.id].percentage[item.id]
            : 0;
      });
    });

  let fileListFromRedux = {};
  sub
    .filter(item => item.questions_type.type === "file")
    .map(questionItem => {
      if (sub_form_field && sub_form_field.sub_questions[questionItem.id]) {
        fileListFromRedux[questionItem.id] =
          sub_form_field &&
          sub_form_field.sub_questions[questionItem.id].upload.fileList;
      }
    });

  const [slider, setSlider] = useState(prevSliderValue);
  const [progress_value, setProgress_value] = useState(prevProgressValue);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileList, setSelectedFileList] = useState(fileListFromRedux);

  // sub slider value change start

  const onChangeslidervalue = (id, value, props, subqueid, mainqueid) => {
    const { form } = props;

    form.setFieldsValue({
      [`${mainqueid}[sub_questions][${subqueid}][percentage][${id}]`]: value
    });

    let sliderNew = { ...slider };
    sliderNew[subqueid] = { ...slider[subqueid], ...{ [id]: value } };

    setSlider(sliderNew);

    let p_value = 0;
    Object.values(sliderNew[subqueid]).map(item => {
      p_value += item;
    });

    let updatedProgressValue = {
      ...progress_value,
      ...{ [subqueid]: p_value }
    };

    setProgress_value(updatedProgressValue);
    form.setFieldsValue({
      [`${mainqueid}[sub_questions][${subqueid}][percentage]total`]: p_value
    });
  };

  // sub slider value change end

  const onChange = (e, sq_id) => {
    let updatedValues = [...values];
    let temp = {
      value: e.target.value,
      id: sq_id
    };
    let val = updatedValues.filter(item => item.id !== sq_id);
    val.push(temp);
    setValue(val);
  };

  //slider value validation
  const validateSliderValue = async (rule, value, callback) => {
    const { form } = props;
    if (value > 100) {
      await callback("Total Value should be less then 100!");
    } else {
      await callback();
    }
  };

  // sub file upload start

  const onChangeUploadSub = (info, subQueId) => {
    switch (info.file.status) {
      case "uploading":
        let updatedFileList = { ...selectedFileList };
        updatedFileList[subQueId] = [info.fileList.pop()];
        setSelectedFileList(updatedFileList);
        break;
      case "done":
        console.log("Done.........");
        break;

      default:
        // error or removed
        setSelectedFile(null);
        setSelectedFileList([]);
    }
  };
  // sub file upload end

  // dynamic sub question start
  return sub.map((s_question, i) => {
    switch (s_question.questions_type.type) {
      case "input":
        return (
          <Form.Item
            label={s_question.question_title}
            labelCol={{ span: 24 }}
            key={i}
            className="sub_question"
          >
            {getFieldDecorator(
              `${s_question.parent_question_id}[sub_questions][${s_question.id}][answer]`,
              {
                initialValue:
                  sub_form_field && sub_form_field.sub_questions !== undefined
                    ? sub_form_field.sub_questions[s_question.id].answer
                    : [],
                rules: [
                  {
                    required: s_question.is_required,
                    message: "This Field is Required!"
                  }
                ]
              }
            )(
              <Input
                className="field_custome_hight"
                placeholder={s_question.placeholder}
              />
            )}
          </Form.Item>
        );

      case "textarea":
        return (
          <Form.Item
            label={s_question.question_title}
            labelCol={{ span: 24 }}
            key={i}
            className="sub_question"
          >
            {getFieldDecorator(
              `${s_question.parent_question_id}[sub_questions][${s_question.id}][answer]`,
              {
                initialValue:
                  sub_form_field && sub_form_field.sub_questions !== undefined
                    ? sub_form_field.sub_questions[s_question.id].answer
                    : [],
                rules: [
                  {
                    required: s_question.is_required,
                    message: "This Field is Required!"
                  }
                ]
              }
            )(<TextArea rows={3} placeholder={s_question.placeholder} />)}
          </Form.Item>
        );

      case "radio":
        return (
          <Form.Item
            label={s_question.question_title}
            labelCol={{ span: 24 }}
            key={i}
            className="sub_question"
          >
            {getFieldDecorator(
              `${s_question.parent_question_id}[sub_questions][${s_question.id}][option]`,
              {
                initialValue:
                  sub_form_field && sub_form_field.sub_questions !== undefined
                    ? sub_form_field.sub_questions[s_question.id].option
                    : [],
                rules: [
                  {
                    required: s_question.is_required,
                    message: "This Field is Required!"
                  }
                ]
              }
            )(
              <Radio.Group
                onChange={e => onChange(e, s_question.id)}
                value={values}
                style={{ width: "100%" }}
              >
                {s_question.options.map((option, option_key) => (
                  <div>
                    <Radio
                      style={radioStyle}
                      value={option.id}
                      key={option_key}
                    >
                      {option.option_title}
                    </Radio>

                    {/* {option.extra_note &&
                    values.find(item => item.id === question.id) &&
                    values.find(item => item.id === question.id).value ===
                      option.id ? ( */}

                    {option.extra_note &&
                    values.find(item => item.id === s_question.id) &&
                    values.find(item => item.id === s_question.id).value ===
                      option.id ? (
                      <Form.Item>
                        {getFieldDecorator(
                          `${s_question.parent_question_id}[sub_questions][${s_question.id}][extranote]`,
                          {
                            initialValue:
                              sub_form_field &&
                              sub_form_field.sub_questions !== undefined
                                ? sub_form_field.sub_questions[s_question.id]
                                    .extranote
                                : [],
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
        );

      case "checkbox":
        return (
          <Form.Item
            label={s_question.question_title}
            labelCol={{ span: 24 }}
            key={i}
            className="sub_question"
          >
            {getFieldDecorator(
              `${s_question.parent_question_id}[sub_questions][${s_question.id}]checkbox`,
              {
                initialValue:
                  sub_form_field && sub_form_field.sub_questions !== undefined
                    ? sub_form_field.sub_questions[s_question.id].checkbox
                    : [],
                rules: [
                  {
                    required: s_question.is_required,
                    message: "This Field is Required!"
                  }
                ]
              }
            )(
              <Checkbox.Group>
                {s_question.options.map((option, option_key) => (
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

      case "select":
        return (
          <Form.Item
            label={s_question.question_title}
            labelCol={{ span: 24 }}
            key={i}
            className="sub_question"
          >
            {getFieldDecorator(
              `${s_question.parent_question_id}[sub_questions][${s_question.id}]option`,
              {
                initialValue:
                  sub_form_field && sub_form_field.sub_questions !== undefined
                    ? sub_form_field.sub_questions[s_question.id].option
                    : [],
                rules: [
                  {
                    required: s_question.is_required,
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
                {s_question.options.map((option, option_key) => (
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
          <div>
            <Form.Item
              label={s_question.question_title}
              labelCol={{ span: 24 }}
              key={i}
              className="custom_slider sub_question"
            >
              <div>
                {s_question.options.map((option, option_key) => (
                  <Form.Item key={option_key}>
                    {getFieldDecorator(
                      `${s_question.parent_question_id}[sub_questions][${s_question.id}][percentage][${option.id}]`,
                      {
                        initialValue:
                          sub_form_field &&
                          sub_form_field.sub_questions !== undefined
                            ? sub_form_field.sub_questions[s_question.id]
                                .percentage[option.id]
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
                            {slider[s_question.id] &&
                            slider[s_question.id][option.id] !== undefined
                              ? slider[s_question.id][option.id]
                              : sub_form_field &&
                                sub_form_field.sub_questions[s_question.id] !==
                                  undefined
                              ? sub_form_field.sub_questions[s_question.id]
                                  .percentage[option.id]
                              : 0}
                            %
                          </h4>

                          <Slider
                            style={{ width: "100%" }}
                            defaultValue={
                              sub_form_field &&
                              sub_form_field.sub_questions !== undefined
                                ? sub_form_field.sub_questions[s_question.id]
                                    .percentage[option.id]
                                : 0
                            }
                            onAfterChange={e =>
                              onChangeslidervalue(
                                option.id,
                                e,
                                props,
                                s_question.id,
                                s_question.parent_question_id
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
                <h4 style={{ lineHeight: "normal", marginBottom: 0 }}>Total</h4>
                <Form.Item>
                  {getFieldDecorator(
                    `${s_question.parent_question_id}[sub_questions][${s_question.id}][percentage]total`,
                    {
                      initialValue:
                        sub_form_field !== undefined
                          ? sub_form_field.sub_questions[s_question.id]
                              .percentage.total
                          : 0,
                      rules: [
                        {
                          required: s_question.is_required,

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
                        {progress_value[s_question.id]}%
                      </h4>

                      <Progress
                        percent={progress_value[s_question.id]}
                        showInfo={false}
                        strokeColor="#61AF46"
                      />
                    </div>
                  )}
                </Form.Item>
              </div>
            </Form.Item>
          </div>
        );

      case "file":
        return (
          <Form.Item
            label={s_question.question_title}
            labelCol={{ span: 24 }}
            key={i}
            className="sub_question"
          >
            {getFieldDecorator(
              `${s_question.parent_question_id}[sub_questions][${s_question.id}]upload`,
              {
                initialValue:
                  sub_form_field && sub_form_field.sub_questions !== undefined
                    ? sub_form_field.sub_questions[s_question.id].upload
                    : [],
                rules: [
                  {
                    required: true,
                    message: "This Field is Required!"
                  }
                ]
              }
            )(
              <Upload
                showUploadList={{ showDownloadIcon: false }}
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain,.xls,.xlsx, .pdf"
                fileList={selectedFileList[s_question.id]}
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                onChange={e => onChangeUploadSub(e, s_question.id)}
              >
                <Button>Choose File</Button>
                <small>
                  &nbsp;&nbsp;(Only accept .CSV, .txt, .doc, .docx, .xls, .xlsx
                  and .pdf file-format.)
                </small>
              </Upload>
            )}
          </Form.Item>
        );
      default:
        break;
    }
  });
};
// dynamic sub question end

const FormData = props => {
  const que_list = props.data.questions_list;

  const form_field = props.formFields;
  const { getFieldDecorator } = props.form;

  const [values, setValue] = useState(
    que_list
      .filter(item => item.questions_type.type === "radio")
      .map(filteredItem => ({
        id: filteredItem.id,
        value: form_field[filteredItem.id]
          ? form_field[filteredItem.id].option
          : 0
      }))
  );

  let prevProgressValue = {};
  let prevSliderValue = {};
  que_list
    .filter(item => item.questions_type.type === "percent")
    .map(filteredItem => {
      prevProgressValue[filteredItem.id] = form_field[filteredItem.id]
        ? form_field[filteredItem.id].percentage.total
        : 0;
      prevSliderValue[filteredItem.id] = {};
      filteredItem.options.map(item => {
        prevSliderValue[filteredItem.id][item.id] =
          form_field &&
          form_field[filteredItem.id] &&
          form_field[filteredItem.id].percentage
            ? form_field[filteredItem.id].percentage[item.id]
            : 0;
      });
    });

  let fileListFromRedux = {};
  que_list
    .filter(item => item.questions_type.type === "file")
    .map(questionItem => {
      if (form_field[questionItem.id]) {
        fileListFromRedux[questionItem.id] =
          form_field[questionItem.id].upload.fileList;
      }
    });
  const [slider, setSlider] = useState(prevSliderValue);
  const [progress_value, setProgress_value] = useState(prevProgressValue);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileList, setSelectedFileList] = useState(fileListFromRedux);

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

  // slider value change start
  const onChangeslidervalue = async (id, value, props, mainqueid) => {
    const { form, formFields } = props;
    form.setFieldsValue({ [`${mainqueid}[percentage]${id}`]: value });

    let sliderNew = { ...slider };
    sliderNew[mainqueid] = { ...slider[mainqueid], ...{ [id]: value } };
    setSlider(sliderNew);

    let p_value = 0;
    Object.values(sliderNew[mainqueid]).map(item => {
      p_value += item;
    });

    let updatedProgressValue = {
      ...progress_value,
      ...{ [mainqueid]: p_value }
    };
    setProgress_value(updatedProgressValue);

    form.setFieldsValue({ [`${mainqueid}[percentage]total`]: p_value });
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

  // file upload start

  const onChangeUploadMain = (info, mainQueId) => {
    const { form } = props;
    switch (info.file.status) {
      case "uploading":
        let updatedFileList = { ...selectedFileList };
        updatedFileList[mainQueId] = [info.fileList.pop()];
        setSelectedFileList(updatedFileList);
        break;
      case "done":
        console.log("Done.........");
        break;

      default:
        // error or removed
        setSelectedFile(null);
        setSelectedFileList([]);
    }
  };
  // file upload end

  // dynamic question start
  return que_list.map((question, i) => {
    switch (question.questions_type.type) {
      case "input":
        return (
          <Form.Item
            label={question.question_title}
            labelCol={{ span: 24 }}
            key={i}
          >
            {getFieldDecorator(`${question.id}[answer]`, {
              initialValue:
                form_field[question.id] !== undefined
                  ? form_field[question.id].answer
                  : [],
              rules: [
                {
                  required: question.is_required,
                  message: "This Field is Required!"
                }
              ]
            })(
              <Input
                className="field_custome_hight"
                placeholder={question.placeholder}
              />
            )}
          </Form.Item>
        );

      case "textarea":
        return (
          <Form.Item
            label={question.question_title}
            labelCol={{ span: 24 }}
            key={i}
          >
            {getFieldDecorator(`${question.id}[answer]`, {
              initialValue:
                form_field[question.id] !== undefined
                  ? form_field[question.id].answer
                  : [],
              rules: [
                {
                  required: question.is_required,
                  message: "This Field is Required!"
                }
              ]
            })(<TextArea rows={3} placeholder={question.placeholder} />)}
          </Form.Item>
        );

      case "radio":
        return (
          <Form.Item
            label={question.question_title}
            labelCol={{ span: 24 }}
            key={i}
          >
            {getFieldDecorator(`[${question.id}]option`, {
              initialValue:
                form_field[question.id] !== undefined
                  ? form_field[question.id].option
                  : [],

              rules: [
                {
                  required: question.is_required,
                  message: "This Field is Required!"
                }
              ]
            })(
              <Radio.Group
                onChange={e => onChange(e, question.id)}
                value={values}
                style={{ width: "100%" }}
              >
                {question.options.map((option, option_key) => (
                  <div>
                    <Radio
                      style={radioStyle}
                      value={option.id}
                      key={option_key}
                    >
                      {option.option_title}
                    </Radio>
                    {option.extra_note &&
                    values.find(item => item.id === question.id) &&
                    values.find(item => item.id === question.id).value ===
                      option.id ? (
                      <Form.Item>
                        {getFieldDecorator(`[${question.id}]extranote`, {
                          initialValue:
                            form_field[question.id] !== undefined
                              ? form_field[question.id].extranote
                              : [],
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
                        })(
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
        );

      case "checkbox":
        return (
          <Form.Item
            label={question.question_title}
            labelCol={{ span: 24 }}
            key={i}
          >
            {getFieldDecorator(`[${question.id}][checkbox]`, {
              initialValue:
                form_field[question.id] !== undefined
                  ? form_field[question.id].checkbox
                  : [],
              rules: [
                {
                  required: question.is_required,
                  message: "This Field is Required!"
                }
              ]
            })(
              <Checkbox.Group>
                {question.options.map((option, option_key) => (
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

      case "select":
        return (
          <Form.Item
            label={question.question_title}
            labelCol={{ span: 24 }}
            key={i}
          >
            {getFieldDecorator(`${question.id}[option]`, {
              initialValue:
                form_field[question.id] !== undefined
                  ? form_field[question.id].option
                  : [],
              rules: [
                {
                  required: question.is_required,
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
                {question.options.map((option, option_key) => (
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
          <div>
            <Form.Item
              label={question.question_title}
              labelCol={{ span: 24 }}
              key={i}
              className="custom_slider"
            >
              <div>
                {question.options.map((option, option_key) => (
                  <Form.Item key={option_key}>
                    {getFieldDecorator(
                      `${question.id}[percentage]${option.id}`,
                      {
                        initialValue:
                          form_field[question.id] !== undefined
                            ? form_field[question.id].percentage[option.id]
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
                            {slider[question.id] &&
                            slider[question.id][option.id] !== undefined
                              ? slider[question.id][option.id]
                              : form_field[question.id] !== undefined
                              ? form_field[question.id].percentage[option.id]
                              : 0}
                            %
                          </h4>

                          <Slider
                            style={{ width: "100%" }}
                            defaultValue={
                              form_field[question.id] !== undefined
                                ? form_field[question.id].percentage[option.id]
                                : []
                            }
                            onChange={e =>
                              onChangeslidervalue(
                                option.id,
                                e,
                                props,
                                question.id
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
                <h4 style={{ lineHeight: "normal", marginBottom: 0 }}>Total</h4>
                <Form.Item>
                  {getFieldDecorator(`${question.id}[percentage]total`, {
                    initialValue:
                      form_field[question.id] !== undefined
                        ? form_field[question.id].percentage.total
                        : 0,
                    rules: [
                      {
                        required: question.is_required,
                        message: "This Field is Required!"
                      },
                      {
                        validator: validateSliderValue
                      }
                    ]
                  })(
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
                        {progress_value[question.id]}%
                      </h4>
                      <Progress
                        percent={progress_value[question.id]}
                        showInfo={false}
                        strokeColor="#61AF46"
                      />
                    </div>
                  )}
                </Form.Item>
              </div>
            </Form.Item>
          </div>
        );

      case "file":
        return (
          <Form.Item
            label={question.question_title}
            labelCol={{ span: 24 }}
            key={i}
          >
            {getFieldDecorator(`${question.id}[upload]`, {
              initialValue:
                form_field[question.id] !== undefined
                  ? form_field[question.id].upload
                  : [],
              rules: [
                {
                  required: true,
                  message: "This Field is Required!"
                }
              ]
            })(
              <Upload
                showUploadList={{ showDownloadIcon: false }}
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/plain,.xls,.xlsx, .pdf"
                fileList={selectedFileList[question.id]}
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                onChange={e => onChangeUploadMain(e, question.id)}
              >
                <Button>Choose File</Button>
                <small>
                  &nbsp;&nbsp;(Only accept .CSV, .txt, .doc, .docx, .xls, .xlsx
                  and .pdf file-format.)
                </small>
              </Upload>
            )}
          </Form.Item>
        );

      case "sub":
        return (
          <Form.Item
            label={question.question_title}
            labelCol={{ span: 24 }}
            key={i}
            className="parent_question"
          >
            {getFieldDecorator(`[${question.id}]`, {
              rules: [
                {
                  required: false
                }
              ]
            })(
              <SwitchSubQue
                sub_data={question.sub_questions}
                form={props.form}
                form_field={form_field[question.id]}
              />
            )}
          </Form.Item>
        );

      default:
        break;
    }
  });
};
// dynamic question end
export default FormData;
