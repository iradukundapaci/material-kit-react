import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  completed: { label: 'Completed', color: 'success' },
  canceled: { label: 'Canceled', color: 'error' },
} as const;

export interface Bookings {
  id: number;
  customer: string;
  service: string;
  carType: string;
  date?: Date;
  time: string;
  amount: number;
  status: 'pending' | 'completed' | 'canceled';
}

export interface LatestBookingsProps {
  bookings?: Bookings[];
  sx?: SxProps;
}

export function LatestOrders({ bookings = [], sx }: LatestBookingsProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Today's Bookings" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Customer Names</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Car type</TableCell>
              <TableCell>Time</TableCell>
              <TableCell sortDirection="desc">Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => {
              const { label, color } = statusMap[booking.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={booking.id}>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.carType}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
