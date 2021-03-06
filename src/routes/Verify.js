import { Alert, Form, Icon, Input, Spin, Steps, Tag } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import React from 'react';
// import { FormattedMessage as Format } from 'react-intl';
import SubmitButton from '../components/SubmitButton';
import Format from '../components/Format'


const FormItem = Form.Item;

const Step = Steps.Step;

class Verify extends React.Component {

  // static contextTypes = {
  //   intl: PropTypes.object.isRequired,
  // };
  state = {
    isChangeEmail: false,
  };

  onSubmit = (e) => {
    const { form, dispatch, input: { password }, user: { id } } = this.props;

    if (e) {
      e.preventDefault();
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        const { email } = values;

        dispatch({ type: 'user/updateEmail', payload: { email, password, user_id: id } });
      }
    });
  };

  onReSend = (e) => {
    const { dispatch, input: { password }, user: { id, email } } = this.props;

    if (e) {
      e.preventDefault();
    }

    dispatch({ type: 'user/updateEmail', payload: { email, password, user_id: id } });
  };

  render() {
    const { form, dispatch, user, checkEmail,
      isEmailExists, loading, input, messages,
     } = this.props;
    const { getFieldDecorator } = form;
    const { id, email } = user;
    // const { intl: { messages } } = this.context;

    const emailProps = {
      fromItem: {
        label: messages['Reset-Email'],
        hasFeedback: true,
        validateStatus: checkEmail,
        help: isEmailExists ? messages.email_exists : '',
      },
      decorator: {
        initialValue: email,
      },
      input: {
        placeholder: messages.email,
      },
    };


    return (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>

        <Spin spinning={loading} delay={100}>
          <Steps size="large" current={1}>
            <Step title={messages['sign-up']} icon={<Icon type="solution"/>}/>
            <Step title={messages['verify-email']} icon={<Icon type="mail"/>}/>
          </Steps>

          {id && input.password ?
            <Alert
              style={{ marginTop: '24px' }}
              message={
                <div>
                  <span style={{ marginRight: '10px' }}><Format id={'Your-account-has-been-created.'}/></span>
                  <Tag color="blue" onClick={this.onReSend}><Format id={'send-email2'}/></Tag>
                  <Tag color="orange" onClick={() => this.setState({ isChangeEmail: true })}>
                    <Format id={'reset-email'}/>
                  </Tag>
                </div>
              }
              type="warning"
              showIcon
            />
            :
            <Alert
              style={{ marginTop: '24px' }}
              message={
                <div>
                  <span style={{ marginRight: '10px' }}><Format id={'Please-sign-in'}/></span>
                  <Tag color="blue" onClick={() => dispatch(routerRedux.replace('/signin'))}><Format
                    id={'sign-in'}
                  /></Tag>
                </div>
              }
              type="warning"
              showIcon
            />
          }

          {
            this.state.isChangeEmail &&
            <Form onSubmit={this.onSubmit} className="login-form" style={{ marginTop: '24px' }}>
              <FormItem {...emailProps.fromItem}>
                {getFieldDecorator('email', { ...emailProps.decorator })(
                  <Input
                    {...emailProps.input}
                    onBlur={() => dispatch({ type: 'auth/checkEmail', payload: { ...form.getFieldsValue(), id } })}
                  />,
                )}
              </FormItem>

              <FormItem>
                <SubmitButton disabled={isEmailExists}/>
              </FormItem>
            </Form>
          }

        </Spin>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    user: { user },
    auth: { input, isEmailExists, checkEmail },
    common: { messages },
  } = state;

  const loading = state.loading.global || false;

  return {
    input,
    user,
    loading,
    messages,
    checkEmail,
    isEmailExists,
  };
}

const WrapperVerify = Form.create()(Verify);

export default connect(mapStateToProps)(WrapperVerify);
