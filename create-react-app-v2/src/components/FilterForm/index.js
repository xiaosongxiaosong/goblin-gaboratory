import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select, Form } from 'antd';
import styles from './index.less';


const FilterForm = ({
  filterKey,
  filterValue,
  options,
  form,
  onSubmit,
}) => {
  const { getFieldDecorator, getFieldsValue } = form;
  return (<Form
    layout="inline"
    onSubmit={(e) => {
      e.preventDefault();
      const values = getFieldsValue();
      onSubmit(values);
    }}
  >
    <Form.Item>
      {getFieldDecorator('filterKey', { initialValue: filterKey })(
        <Select className={styles.filterKey}>
          {options.map(item => <Select.Option key={item.value} value={item.value}>{item.text}</Select.Option>)}
        </Select>
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator('filterValue', { initialValue: filterValue })(
        <Input className={styles.filterValue} />
      )}
    </Form.Item>
    <Form.Item>
      <Button icon="search" htmlType="submit" />
    </Form.Item>
  </Form>);
};

FilterForm.propTypes = {
  filterKey: PropTypes.string.isRequired,
  filterValue: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form.create()(FilterForm);
