import { Table, Space, Button } from 'antd';
import { useQuery } from '@tanstack/react-query';
import type { Envelope } from '../../api/getEnvelopes';
import getEnvelopes from '../../api/getEnvelopes';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Budget',
    dataIndex: 'budget',
    key: 'budget',
    render: (budget: number) => `$${budget.toFixed(2)}`,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_: any, record: Envelope) => (
      <Space size="middle">
        <Button type="link" onClick={() => console.log('Edit', record.id)}>Edit</Button>
        <Button type="link" danger>Delete</Button>
      </Space>
    ),
  },
];

export default function EnvelopesTable() {
  const { data: envelopes = [], isLoading } = useQuery({
    queryKey: ['envelopes'],
    queryFn: getEnvelopes,
  });

  return (
    <Table 
      columns={columns} 
      dataSource={envelopes} 
      loading={isLoading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
