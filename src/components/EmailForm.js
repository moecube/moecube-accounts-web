import React, { PropTypes } from 'react';
import styles from './EmailForm.css';
import {connect} from 'react-redux'
import { Form, Input, Icon, Button } from 'antd'
const FormItem = Form.Item;
import SubmitButton from './SubmitButton'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 15 },
}


class EmailForm extends React.Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }
  onSubmit = (e) => {
    const { form, dispatch, user: {id} } = this.props

    e && e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        const { email, password } = values

        dispatch({type: "user/updateEmail", payload: { email, password, user_id: id }})
      }
    });
  }

  render(){

    const {form, dispatch, user, checkEmail, isEmailExists} = this.props
    const {getFieldDecorator} = form
    const {id, email} = user;
    const { intl: {messages} } = this.context;


    const emailProps = {
      fromItem: {
        label: messages.email,
        hasFeedback: true,
        validateStatus: checkEmail,
        help: isEmailExists ? 'email exists' : '',
        ...formItemLayout
      },
      decorator: {
        initialValue: email
      },
      input: {
        placeholder: messages.email
      }
    }

    const passwordProps = {
      fromItem: {
        label: messages.password,
        ...formItemLayout
      },
      decorator: {
        rules: [
          { required: true, message: messages['Password-length-must-be-between-8-and-24-characters.'], pattern: /^.{8,24}$/ }
        ]
      },
      input: {
        placeholder: messages.password,
        type: 'password'
      }
    }

    return (
      <Form onSubmit={this.onSubmit}>
        <FormItem {...emailProps.fromItem}>
          {getFieldDecorator(`email`, {...emailProps.decorator})(
            <Input
              {...emailProps.input}
              onBlur = {() => dispatch({type: 'auth/checkEmail', payload: { ...form.getFieldsValue(), id} })}/>
          )}
        </FormItem>

        <FormItem {...passwordProps.fromItem}>
          {getFieldDecorator('password')(
            <Input {...passwordProps.input} />
          )}
        </FormItem>

        <FormItem>
          <SubmitButton />
        </FormItem>
      </Form>
    );
  }
}



function mapStateToProps(state, props) {
  const {
    user: {user},
    auth: {isEmailExists, checkEmail}
  } = state
  return {
    user,
    checkEmail,
    isEmailExists
  };
}

const WrapperEmailForm = Form.create()(EmailForm)

export default connect(mapStateToProps)(WrapperEmailForm);

