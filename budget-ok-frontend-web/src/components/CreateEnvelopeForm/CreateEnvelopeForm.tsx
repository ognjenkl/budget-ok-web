import {Button, Form, Input, InputNumber} from "antd";
import useCreateEnvelope from "../../hooks/useCreateEnvelope.ts";

type CreateEnvelopeFormData = {
  name: string;
  budget: number;
}

export default function CreateEnvelopeForm() {
  const {mutate, isPending} = useCreateEnvelope()

  const onFinish = (values: CreateEnvelopeFormData) => {
    mutate(values)
  }

return <Form<CreateEnvelopeFormData> data-testid="create-envelope-form" layout="vertical" onFinish={onFinish}>
  <Form.Item name="name" label="Envelope Name" rules={[{required: true}]}>
    <Input placeholder="Envelope Name" />
  </Form.Item>
  <Form.Item name="budget" label="Budget" rules={[{required: true, message: "Please input the budget amount"}]}>
    <InputNumber placeholder="Budget" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit" loading={isPending}>
      Submit
    </Button>
  </Form.Item>
</Form>
}