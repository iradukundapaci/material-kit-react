import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { supabase } from '@/lib/supabase-client';
import { Budget } from '@/components/dashboard/overview/budget';
import { Bookings, LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

async function fetchTodayBookings() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date();

  const { data, error } = await supabase
    .from('booking')
    .select(
      `
      id,
      service_type,
      car_type,
      day,
      time,
      status,
      expected_payment,
      paid,
      customer (first_name, last_name)
    `
    )
    .limit(50);

  if (error) {
    console.log('Error fetching bookings:', error);
    return [];
  }

  // Filter bookings that are from the current hour onward
  const filteredBookings = data.filter((booking) => {
    const bookingTime = new Date(`${booking.day}T${booking.time}`);
    return bookingTime >= now;
  });

  return filteredBookings.map((booking) => {
    const customer = booking.customer;

    return {
      id: booking.id,
      customer: `${customer.first_name} ${customer.last_name}`,
      service: booking.service_type,
      carType: booking.car_type,
      date: new Date(booking.day),
      time: booking.time,
      amount: booking.expected_payment,
      status: booking.status,
    };
  });
}

export default async function Page(): Promise<React.JSX.Element> {
  fetchTodayBookings().then((bookings) => {
    console.log(bookings);
  });

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders bookings={[]} sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
}
