import { Modal, Button, Divider } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

const printStyles = `
  @media print {
    body * { visibility: hidden !important; }
    #fee-receipt-printable, #fee-receipt-printable * { visibility: visible !important; }
    #fee-receipt-printable {
      position: fixed !important;
      top: 0; left: 0;
      width: 100%;
      padding: 40px;
      background: #fff;
    }
  }
`;

export default function FeeReceipt({ open, onClose, fee }) {
  if (!fee) return null;

  const handlePrint = () => {
    window.print();
  };

  const row = (label, value) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
      <span style={{ color: '#555', minWidth: 140 }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right' }}>{value ?? '—'}</span>
    </div>
  );

  const statusColor = { Paid: '#52c41a', Partial: '#1677ff', Pending: '#faad14' };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose}>Close</Button>
          <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            Print Receipt
          </Button>
        </div>
      }
      width={520}
      title="Fee Receipt"
      destroyOnClose
    >
      <style>{printStyles}</style>

      <div id="fee-receipt-printable">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>🎓 Institute</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Fee Payment Receipt</div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Receipt Meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#888' }}>Receipt No</span>
          <span style={{ fontWeight: 600, color: '#1677ff' }}>{fee.receiptNo || '—'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: '#888' }}>Payment Date</span>
          <span style={{ fontWeight: 500 }}>{fee.paymentDate || '—'}</span>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Student & Course */}
        {row('Student Name', fee.studentName)}
        {row('Course', fee.courseName)}
        {row('Installment', fee.installment)}

        <Divider style={{ margin: '12px 0' }} />

        {/* Finance Details */}
        {row('Total Fee', `₹${Number(fee.totalFee || 0).toLocaleString()}`)}
        {row('Amount Paid', `₹${Number(fee.amountPaid || 0).toLocaleString()}`)}
        {row('Amount Due', `₹${Number(fee.amountDue || 0).toLocaleString()}`)}
        {row('Payment Method', fee.paymentType)}

        <Divider style={{ margin: '12px 0' }} />

        {/* Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
          <span style={{ color: '#555' }}>Status</span>
          <span
            style={{
              fontWeight: 700,
              color: statusColor[fee.status] || '#555',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {fee.status}
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            textAlign: 'center',
            fontSize: 11,
            color: '#aaa',
            borderTop: '1px dashed #eee',
            paddingTop: 12,
          }}
        >
          This is a computer-generated receipt and does not require a signature.
        </div>
      </div>
    </Modal>
  );
}
