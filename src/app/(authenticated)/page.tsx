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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getAllBills, getTodayBills, formatCurrency, formatDate } from '@/lib/bills';
import { Bill } from '@/types/bill';

export default function DashboardPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [todayBills, setTodayBills] = useState<Bill[]>([]);

  useEffect(() => {
    setBills(getAllBills());
    setTodayBills(getTodayBills());
  }, []);

  const todayTotal = todayBills.reduce((sum, b) => sum + b.total, 0);
  const allTotal = bills.reduce((sum, b) => sum + b.total, 0);
  const avgBill = bills.length > 0 ? allTotal / bills.length : 0;

  const statsCards = [
    {
      title: 'ยอดรวมวันนี้',
      value: formatCurrency(todayTotal),
      icon: <MoneyIcon />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      shadowColor: 'rgba(99, 102, 241, 0.3)',
    },
    {
      title: 'จำนวนบิลทั้งหมด',
      value: `${bills.length} บิล`,
      icon: <ReceiptIcon />,
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
      shadowColor: 'rgba(20, 184, 166, 0.3)',
    },
    {
      title: 'ยอดเฉลี่ยต่อบิล',
      value: formatCurrency(avgBill),
      icon: <TrendingUpIcon />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      shadowColor: 'rgba(245, 158, 11, 0.3)',
    },
  ];

  const recentBills = bills.slice(0, 5);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            แดชบอร์ด
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            ภาพรวมการคิดบิลของคุณ
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/bills/create')}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          สร้างบิลใหม่
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        {statsCards.map((card) => (
          <Card
            key={card.title}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${card.shadowColor}`,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: card.gradient,
                    boxShadow: `0 4px 12px ${card.shadowColor}`,
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
            {/* Decorative gradient line at bottom */}
            <Box
              sx={{
                height: 3,
                background: card.gradient,
              }}
            />
          </Card>
        ))}
      </Box>

      {/* Recent Bills */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">บิลล่าสุด</Typography>
            <Button size="small" onClick={() => router.push('/bills')}>
              ดูทั้งหมด
            </Button>
          </Box>
          {recentBills.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
              <Typography color="text.secondary">
                ยังไม่มีบิล เริ่มสร้างบิลแรกของคุณ!
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/bills/create')}
                sx={{ mt: 2 }}
              >
                สร้างบิลใหม่
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ลูกค้า</TableCell>
                    <TableCell>วันที่</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell align="right">ยอดรวม</TableCell>
                    <TableCell align="center">ดู</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBills.map((bill) => (
                    <TableRow
                      key={bill.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.05)' },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>{bill.customerName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(bill.createdAt)}
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
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/bills/${bill.id}`)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Mobile FAB */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => router.push('/bills/create')}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          bottom: 24,
          right: 24,
          borderRadius: 8,
          py: 1.5,
          px: 3,
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)',
        }}
      >
        สร้างบิล
      </Button>
    </Box>
  );
}
