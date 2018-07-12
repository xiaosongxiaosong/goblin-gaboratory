import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select } from 'antd';


class FilterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...props.list[0], value: props.list[0].defaultValue };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onSearch({
      key: this.state.key,
      value: this.state.value,
    });
  }
  handleKeyChange(key) {
    const item = this.props.list.find((it) => {
      return key === it.key;
    });
    this.setState({ ...item, value: item.defaultValue });
  }
  handleValueChange(e) {
    this.setState({ value: e.target.value });
  }
  render() {
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>筛选：</Form.Item>
        <Form.Item>
          <Select value={this.state.key} onChange={this.handleKeyChange} style={{ width: '8em' }}>
            {this.props.list.map((it) => {
              return (<Select.Option value={it.key}>{it.name}</Select.Option>);
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          {'text' === this.state.type && <Input value={this.state.value} onChange={this.handleValueChange} />}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon="search">搜索</Button>
        </Form.Item>
      </Form>
    );
  }
}

FilterForm.propTypes = {
  list: PropTypes.array,
  onSearch: PropTypes.func,
};

export default FilterForm;

