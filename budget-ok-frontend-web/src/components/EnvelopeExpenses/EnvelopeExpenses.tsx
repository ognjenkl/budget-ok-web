import { Table, Modal, Button, Space, Typography, Form, Input, InputNumber, message, Radio, Tooltip } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { TransactionType } from '../../api/expense';
import type { Expense, CreateExpenseDto } from '../../api/expense';
import { getExpensesByEnvelopeId, createExpense } from '../../api/expense';

const { Title, Text } = Typography;

interface EnvelopeExpensesProps {
  envelopeId: string;
  envelopeName: string;
  onClose: () => void;
}

export default function EnvelopeExpenses({ envelopeId, envelopeName, onClose }: EnvelopeExpensesProps) {
  const [form] = Form.useForm<{ amount: number; memo: string; description?: string; transactionType: TransactionType }>();
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] = useState(false);
  
  // Set default form values
  useEffect(() => {
    form.setFieldsValue({
      transactionType: 'WITHDRAW' as TransactionType
    });
  }, [form]);
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
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
      render: (amount: number, record: Expense) => (
        <span style={{ color: record.transactionType === 'WITHDRAW' ? '#ff4d4f' : '#52c41a' }}>
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Modal
      title={`Expenses for ${envelopeName}`}
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={5} style={{ margin: 0 }}>Expense History</Title>
            <Tooltip title="Add Expense">
              <Button
                type="primary"
                icon={<PlusOutlined style={{ fontSize: '18px' }} />}
                onClick={() => setIsAddExpenseModalVisible(true)}
                style={{
                  width: '48px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
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
              style={{ width: '100%' }}
              min={0.01}
              step={0.01}
              precision={2}
              prefix="$"
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
