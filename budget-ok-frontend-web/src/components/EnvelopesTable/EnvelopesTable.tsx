import { Table, Space, Button, Modal, message, Typography } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Envelope } from '../../api/getEnvelopes';
import getEnvelopes from '../../api/getEnvelopes';
import deleteEnvelope from '../../api/deleteEnvelope';
import { DeleteOutlined, EditOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import EditEnvelopeForm from '../EditEnvelopeForm/EditEnvelopeForm';
import CreateEnvelopeForm from '../CreateEnvelopeForm/CreateEnvelopeForm';
import './EnvelopesTable.css';

const { confirm } = Modal;

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
  const [editingEnvelope, setEditingEnvelope] = useState<Envelope | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

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
  const handleCancelEdit = () => {
    setEditingEnvelope(null);
  };

  const handleUpdateSuccess = () => {
    message.success('Envelope updated successfully');
  };

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
    <div className="envelopes-container">
      <div className="envelopes-header">
        <Typography.Title level={4} style={{ margin: 0 }}>Envelopes</Typography.Title>
        <div className="envelopes-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            aria-label="New Envelope"
          >
            New Envelope
          </Button>
        </div>
      </div>
      
      <div className="envelopes-table-wrapper">
        <Table
          columns={[
            ...columns,
            {
              title: 'Actions',
              key: 'actions',
              width: 120,
              render: (_, record) => (
                <Space size="middle">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => setEditingEnvelope(record)}
                    aria-label="Edit"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.id)}
                    aria-label="Delete"
                    loading={isDeleting}
                    disabled={isDeleting}
                  />
                </Space>
              ),
            },
          ]}
          dataSource={envelopes}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="envelopes-table"
        />
      </div>

      <Modal
        title="Create New Envelope"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <CreateEnvelopeForm 
          onSuccess={() => {
            setIsCreateModalVisible(false);
            queryClient.invalidateQueries({ queryKey: ['envelopes'] });
          }}
        />
      </Modal>
      
      <Modal
        title="Edit Envelope"
        open={!!editingEnvelope}
        onCancel={handleCancelEdit}
        footer={null}
        destroyOnHidden
      >
        {editingEnvelope && (
          <EditEnvelopeForm
            envelope={editingEnvelope}
            onSuccess={handleUpdateSuccess}
            onCancel={handleCancelEdit}
          />
        )}
      </Modal>
    </div>
  );
}
