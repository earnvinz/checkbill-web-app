'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  ReceiptLong as LogoIcon,
} from '@mui/icons-material';
import { getBillById, formatCurrency, formatDate, saveBill } from '@/lib/bills';
import { Bill } from '@/types/bill';

export default function BillPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const [bill, setBill] = useState<Bill | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const found = getBillById(id);
    if (found) {
      setBill(found);
    }
  }, [params.id]);

  const handleToggleStatus = () => {
    if (!bill) return;
    const updated = {
      ...bill,
      status: bill.status === 'paid' ? 'pending' as const : 'paid' as const,
      updatedAt: new Date().toISOString(),
    };
    saveBill(updated);
    setBill(updated);
  };

  if (!bill) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="text.secondary">ไม่พบบิล</Typography>
        <Button onClick={() => router.push('/bills')} sx={{ mt: 2 }}>
          กลับไปรายการบิล
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Actions */}
      <Box
        className="no-print"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.back()}>
            <BackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>
            พรีวิวบิล
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleToggleStatus}
            color={bill.status === 'paid' ? 'warning' : 'success'}
          >
            {bill.status === 'paid' ? 'เปลี่ยนเป็นรอชำระ' : 'ชำระแล้ว'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/bills/create?edit=${bill.id}`)}
          >
            แก้ไข
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            พิมพ์
          </Button>
        </Box>
      </Box>

      {/* Bill Receipt */}
      <Card
        sx={{
          maxWidth: 800,
          mx: 'auto',
          '@media print': {
            boxShadow: 'none',
            border: 'none',
            bgcolor: 'white',
            color: 'black',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LogoIcon sx={{ fontSize: 36, color: 'primary.main' }} />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    '@media print': { color: '#333 !important', background: 'none !important', backgroundClip: 'unset !important', WebkitBackgroundClip: 'unset !important' },
                  }}
                >
                  CheckBill
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ใบเสร็จรับเงิน / Receipt
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={bill.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                color={bill.status === 'paid' ? 'success' : 'warning'}
                size="small"
                className="no-print"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                เลขที่: #{bill.id.slice(0, 8).toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                วันที่: {formatDate(bill.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Customer Info */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" color="text.secondary">
              ลูกค้า
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {bill.customerName}
            </Typography>
            {bill.customerAddress && (
              <Typography variant="body2" color="text.secondary">
                {bill.customerAddress}
              </Typography>
            )}
            {bill.customerPhone && (
              <Typography variant="body2" color="text.secondary">
                โทร: {bill.customerPhone}
              </Typography>
            )}
          </Box>

          {/* Items Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>รายการ</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>จำนวน</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>ราคา/หน่วย</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>รวม</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bill.items.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ width: 280 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                <Typography variant="body2" color="text.secondary">ยอดรวม</Typography>
                <Typography variant="body2">{formatCurrency(bill.subtotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                <Typography variant="body2" color="text.secondary">VAT 7%</Typography>
                <Typography variant="body2">{formatCurrency(bill.vat)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                <Typography variant="h6" fontWeight={700}>รวมทั้งสิ้น</Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: 'primary.main',
                    '@media print': { color: '#333 !important' },
                  }}
                >
                  {formatCurrency(bill.total)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Note */}
          {bill.note && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(148,163,184,0.05)', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                หมายเหตุ:
              </Typography>
              <Typography variant="body2">{bill.note}</Typography>
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="caption" color="text.secondary">
              ขอบคุณที่ใช้บริการ • สร้างด้วย CheckBill
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
