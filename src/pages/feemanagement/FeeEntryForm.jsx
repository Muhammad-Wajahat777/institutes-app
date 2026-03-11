import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from "antd";
import { useCreateFee, useUpdateFee } from "../../hooks/useFees";
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function FeeEntryForm({ open, onCancel, onSubmit, editingFee, students = [] }) {
  const [form] = Form.useForm();
  
  const createMutation = useCreateFee();
  const updateMutation = useUpdateFee();

  const isEditing = !!editingFee;

  // Reset form when modal opens/closes or editing fee changes
  const handleOpenChange = (isOpen) => {
    if (isOpen && editingFee) {
      form.setFieldsValue({
        ...editingFee,
        paymentDate: editingFee.paymentDate ? dayjs(editingFee.paymentDate) : null,
      });
    } else if (!isOpen) {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    const feeData = {
      ...values,
      paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD') : null,
      amountPaid: values.amountPaid || 0,
      amountDue: values.amountDue || 0,
      receiptNo: values.receiptNo || `REC${Date.now()}`,
      academicYear: values.academicYear || '2025-26',
      installment: values.installment || '1st Year - 1st Semester',
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: editingFee.id, data: feeData },
        {
          onSuccess: () => {
            message.success('Fee record updated successfully');
            form.resetFields();
            onSubmit();
          },
          onError: () => {
            message.error('Failed to update fee record');
          },
        }
      );
    } else {
      createMutation.mutate(feeData, {
        onSuccess: () => {
          message.success('Fee record added successfully');
          form.resetFields();
          onSubmit();
        },
        onError: () => {
          message.error('Failed to add fee record');
        },
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Transform students for dropdown
  const studentOptions = students.map((student) => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName} (${student.rollNo})`,
  }));

  const paymentMethods = [
    { value: "Cash", label: "Cash" },
    { value: "Online", label: "Online" },
    { value: "Bank Transfer", label: "Bank Transfer" },
  ];

  const statusOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Partial", label: "Partial" },
  ];

  return (
    <Modal
      title={isEditing ? 'Edit Fee Payment' : 'Add Fee Payment'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEditing ? 'Update' : 'Add Payment'}
      confirmLoading={isPending}
      destroyOnClose
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onOpenChange={handleOpenChange}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="studentId"
          label="Student"
          rules={[{ required: true, message: "Please select a student" }]}
        >
          <Select
            placeholder="Select a student"
            showSearch
            options={studentOptions}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="amountPaid"
            label="Amount Paid"
            rules={[
              { required: true, message: "Please enter the amount paid" },
            ]}
          >
            <InputNumber
              placeholder="e.g. 62500"
              prefix="₹"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/,/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="amountDue"
            label="Amount Due"
          >
            <InputNumber
              placeholder="e.g. 0"
              prefix="₹"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/,/g, "")}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="paymentDate"
            label="Payment Date"
          >
            <DatePicker style={{ width: "100%" }} format="DD MMM YYYY" />
          </Form.Item>

          <Form.Item
            name="paymentType"
            label="Payment Method"
          >
            <Select
              placeholder="Select payment method"
              options={paymentMethods}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder="Select status"
              options={statusOptions}
            />
          </Form.Item>

          <Form.Item
            name="academicYear"
            label="Academic Year"
          >
            <Select placeholder="Select academic year">
              <Select.Option value="2025-26">2025-26</Select.Option>
              <Select.Option value="2024-25">2024-25</Select.Option>
              <Select.Option value="2026-27">2026-27</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="receiptNo"
          label="Receipt Number"
        >
          <Input placeholder="e.g. REC001" />
        </Form.Item>

        <Form.Item name="installment" label="Installment">
          <Input placeholder="e.g. 1st Year - 1st Semester" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
