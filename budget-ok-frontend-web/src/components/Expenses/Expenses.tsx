import { Table, Modal, Button, Space, Typography, Form, Input, InputNumber, message, Radio, Tooltip } from 'antd';
import './Expenses.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { TransactionType } from '../../api/expense';
import type { Expense as ExpenseType, CreateExpenseDto } from '../../api/expense';
import { getExpensesByEnvelopeId, createExpense } from '../../api/expense';

const { Title, Text } = Typography;

interface ExpensesProps {
  envelopeId: string;
  envelopeName: string;
  onClose: () => void;
}

export default function Expenses({ envelopeId, envelopeName, onClose }: ExpensesProps) {
  const [form] = Form.useForm<{ amount: number; memo: string; description?: string; transactionType: TransactionType }>();
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);
  const amountInputRef = useRef<any>(null);
  
  // Set default form values
  useEffect(() => {
    form.setFieldsValue({
      transactionType: 'WITHDRAW' as TransactionType
    });
  }, [form]);
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery<ExpenseType[]>({
    queryKey: ['expenses', envelopeId],
    queryFn: () => getExpensesByEnvelopeId(envelopeId),
  });

  const { mutate: createExpenseMutation, isPending: isCreating } = useMutation({
    mutationFn: (expense: CreateExpenseDto) => createExpense(envelopeId, expense),
    onSuccess: () => {
      message.success('Expense added successfully');
      form.resetFields();
      setIsAddExpenseModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['expenses', envelopeId] });
    },
    onError: () => {
      message.error('Failed to add expense');
    },
  });

  const columns = [
    {
      title: 'Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (type: TransactionType) => type === 'WITHDRAW' ? 'Withdraw' : 'Deposit',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: ExpenseType) => (
        <span className={record.transactionType === 'WITHDRAW' ? 'amount-withdraw' : 'amount-deposit'}>
          {record.transactionType === 'WITHDRAW' ? '-' : '+'}${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo',
      render: (memo: string) => memo || '-',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => description || '-',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const handleAddExpense = () => {
    form.validateFields().then((values: CreateExpenseDto) => {
      createExpenseMutation(values);
    });
  };

  // Focus amount input when modal opens
  useEffect(() => {
    if (isAddExpenseModalVisible && amountInputRef.current) {
      // Small timeout to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAddExpenseModalVisible]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Modal
      title={`Expenses for ${envelopeName}`}
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="expenses-container">
        <Space direction="vertical" className="expenses-space-container">
          <div className="expenses-header">
            <Title level={5} className="expenses-title">Expense History</Title>
            <Tooltip title="Add Expense">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddExpenseModalVisible(true)}
                aria-label="Add Expense"
                className="add-expense-button"
              />
            </Tooltip>
          </div>
          <Text strong>Total Spent: ${totalExpenses.toFixed(2)}</Text>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={expenses}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Add New Expense"
        open={isAddExpenseModalVisible}
        onCancel={() => {
          setIsAddExpenseModalVisible(false);
          form.resetFields();
        }}
        onOk={handleAddExpense}
        confirmLoading={isCreating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter the amount' }]}
          >
            <InputNumber
              className="amount-input"
              min={0.01}
              step={0.01}
              precision={2}
              prefix="$"
              ref={amountInputRef}
              autoFocus
            />
          </Form.Item>
          <Form.Item
            name="memo"
            label="Memo"
            rules={[{ required: true, message: 'Please enter a memo' }]}
          >
            <Input placeholder="Enter a short note" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description (Optional)"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="transactionType"
            label="Transaction Type"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio.Button value="WITHDRAW">Withdraw</Radio.Button>
              <Radio.Button value="DEPOSIT">Deposit</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
}
