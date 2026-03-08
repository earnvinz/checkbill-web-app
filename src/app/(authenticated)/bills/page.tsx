'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { getAllBills, deleteBill, formatCurrency, formatDate } from '@/lib/bills';
import { Bill } from '@/types/bill';

export default function BillsListPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setBills(getAllBills());
  }, []);

  const filtered = bills.filter((b) =>
    b.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteBill(deleteId);
      setBills(getAllBills());
      setDeleteId(null);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            รายการบิล
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            จัดการบิลทั้งหมดของคุณ
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/bills/create')}
        >
          สร้างบิลใหม่
        </Button>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <TextField
            fullWidth
            placeholder="ค้นหาชื่อลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardContent>
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
              <Typography color="text.secondary">
                {search ? 'ไม่พบบิลที่ค้นหา' : 'ยังไม่มีบิล เริ่มสร้างบิลแรกของคุณ!'}
              </Typography>
              {!search && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/bills/create')}
                  sx={{ mt: 2 }}
                >
                  สร้างบิลใหม่
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ลูกค้า</TableCell>
                    <TableCell>วันที่</TableCell>
                    <TableCell>รายการ</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell align="right">ยอดรวม</TableCell>
                    <TableCell align="center">จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((bill) => (
                    <TableRow
                      key={bill.id}
                      hover
                      sx={{ '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.05)' } }}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{bill.customerName}</Typography>
                        {bill.customerPhone && (
                          <Typography variant="caption" color="text.secondary">
                            {bill.customerPhone}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(bill.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {bill.items.length} รายการ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={bill.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                          size="small"
                          color={bill.status === 'paid' ? 'success' : 'warning'}
                          sx={{ borderRadius: 1.5 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>{formatCurrency(bill.total)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/bills/${bill.id}`)}
                            title="ดูบิล"
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/bills/create?edit=${bill.id}`)}
                            title="แก้ไข"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setDeleteId(bill.id)}
                            title="ลบ"
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <Typography>คุณต้องการลบบิลนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>ยกเลิก</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
