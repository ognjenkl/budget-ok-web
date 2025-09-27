import {Table, Space, Button, Modal, message} from 'antd';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import type {Envelope} from '../../api/getEnvelopes';
import getEnvelopes from '../../api/getEnvelopes';
import deleteEnvelope from '../../api/deleteEnvelope';
import {ExclamationCircleOutlined} from '@ant-design/icons';

const {confirm} = Modal;

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
];

export default function EnvelopesTable() {
  const queryClient = useQueryClient();

  const {data: envelopes = [], isLoading, isError} = useQuery<Envelope[]>({
    queryKey: ['envelopes'],
    queryFn: getEnvelopes,
  });

  const {mutate: deleteEnvelopeMutation, isPending: isDeleting} = useMutation({
    mutationFn: deleteEnvelope,
    onSuccess: () => {
      message.success('Envelope deleted successfully');
      queryClient.invalidateQueries({queryKey: ['envelopes']});
    },
    onError: () => {
      message.error('Failed to delete envelope');
    },
  });

  const handleDelete = (id: string) => {
    confirm({
      title: 'Are you sure you want to delete this envelope?',
      icon: <ExclamationCircleOutlined/>,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteEnvelopeMutation(id);
      },
    });
  };

  if (isError) {
    return <div>Error loading envelopes</div>;
  }

  return (
      <Table
          columns={[
            ...columns,
            {
              title: 'Action',
              key: 'action',
              render: (_: any, record: Envelope) => (
                  <Space size="middle">
                    <Button type="link" onClick={() => console.log('Edit', record.id)}>Edit</Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(record.id)}
                        loading={isDeleting}
                        disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </Space>
              ),
            },
          ]}
          dataSource={envelopes}
          loading={isLoading}
          rowKey="id"
          pagination={{pageSize: 10}}
      />
  );
}
