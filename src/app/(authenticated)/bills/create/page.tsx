'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import {
  generateId,
  calculateBillTotals,
  createEmptyBillItem,
  formatCurrency,
  getBillById,
  saveBill,
} from '@/lib/bills';
import { Bill, BillItem } from '@/types/bill';

export default function CreateBillPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');
  const [items, setItems] = useState<BillItem[]>([createEmptyBillItem()]);

  useEffect(() => {
    if (editId) {
      const bill = getBillById(editId);
      if (bill) {
        setCustomerName(bill.customerName);
        setCustomerAddress(bill.customerAddress || '');
        setCustomerPhone(bill.customerPhone || '');
        setNote(bill.note || '');
        setStatus(bill.status);
        setItems(bill.items);
      }
    }
  }, [editId]);

  const { subtotal, vat, total } = calculateBillTotals(items);

  const handleItemChange = (id: string, field: keyof BillItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyBillItem()]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!customerName.trim()) return;
    if (items.some((i) => !i.name.trim())) return;

    const now = new Date().toISOString();
    const bill: Bill = {
      id: editId || generateId(),
      customerName: customerName.trim(),
      customerAddress: customerAddress.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      items,
      subtotal,
      vat,
      total,
      status,
      note: note.trim() || undefined,
      createdAt: editId ? getBillById(editId)?.createdAt || now : now,
      updatedAt: now,
    };

    saveBill(bill);
    router.push(`/bills/${bill.id}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => router.back()}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {editId ? 'แก้ไขบิล' : 'สร้างบิลใหม่'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            กรอกข้อมูลลูกค้าและรายการสินค้า
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 360px' }, gap: 3 }}>
        {/* Left: Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Customer Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ข้อมูลลูกค้า
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="ชื่อลูกค้า *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="ที่อยู่"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="เบอร์โทร"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  <FormControl fullWidth>
                    <InputLabel>สถานะ</InputLabel>
                    <Select
                      value={status}
                      label="สถานะ"
                      onChange={(e) => setStatus(e.target.value as 'pending' | 'paid')}
                    >
                      <MenuItem value="pending">รอชำระ</MenuItem>
                      <MenuItem value="paid">ชำระแล้ว</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">รายการสินค้า</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={addItem}>
                  เพิ่มรายการ
                </Button>
              </Box>

              {items.map((item, idx) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 100px 120px 40px' },
                    gap: 2,
                    mb: 2,
                    pb: 2,
                    borderBottom: idx < items.length - 1 ? '1px solid rgba(148,163,184,0.1)' : 'none',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    label={`สินค้า #${idx + 1}`}
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="จำนวน"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    size="small"
                    inputProps={{ min: 1 }}
                  />
                  <TextField
                    label="ราคา (฿)"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, 'price', Math.max(0, parseFloat(e.target.value) || 0))}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Note */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                หมายเหตุ
              </Typography>
              <TextField
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)..."
              />
            </CardContent>
          </Card>
        </Box>

        {/* Right: Summary */}
        <Box>
          <Card
            sx={{
              position: 'sticky',
              top: 80,
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                สรุปยอด
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {items.filter(i => i.name).map((item) => (
                  <Box
                    key={item.id}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mr: 1 }} noWrap>
                      {item.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">ยอดรวม</Typography>
                <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">VAT 7%</Typography>
                <Typography variant="body2">{formatCurrency(vat)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">รวมทั้งสิ้น</Typography>
                <Typography
                  variant="h6"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {formatCurrency(total)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={!customerName.trim() || items.every((i) => !i.name.trim())}
                sx={{ mt: 3 }}
              >
                {editId ? 'บันทึกการแก้ไข' : 'บันทึกบิล'}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
