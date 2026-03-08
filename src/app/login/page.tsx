'use client';

import { signIn } from 'next-auth/react';
import {
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material';
import { Google as GoogleIcon, ReceiptLong as LogoIcon } from '@mui/icons-material';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <Card
        sx={{
          p: { xs: 4, sm: 5 },
          maxWidth: 420,
          width: '100%',
          mx: 2,
          textAlign: 'center',
          bgcolor: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: 72,
            height: 72,
            mx: 'auto',
            mb: 3,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
          }}
        >
          <LogoIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>

        <Typography
          variant="h4"
          sx={{
            mb: 1,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          CheckBill
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          ระบบคิดบิลและใบเสร็จ
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => signIn('google', { callbackUrl: '/' })}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            },
          }}
        >
          เข้าสู่ระบบด้วย Google
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
          เข้าสู่ระบบเพื่อเริ่มสร้างบิลและจัดการใบเสร็จ
        </Typography>
      </Card>
    </Box>
  );
}
