"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { Key } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Month", days: 90 },
  "6M": { label: "Last 6 Month", days: 180 },
  ALL: { label: "All Time", days: null },
};
const AccountChart = ({ transactions }) => {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    //filter transaction within date range
    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");

      if (!acc[date]) {
        acc[date] = { date, income: 0, expence: 0 };
      }

      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expence += transaction.amount;
      }

      return acc;
    }, {});

    //conver to array and sort by date
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [dateRange, transactions]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expence: acc.expence + day.expence,
      }),
      { income: 0, expence: 0 }
    );
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">
          Transaction Overview
        </CardTitle>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              {DATE_RANGES[dateRange]?.label || "Select Range"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">
              ${totals.income.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-500">
              ${totals.expence.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`text-lg font-bold ${
                totals.income - totals.expence > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ${(totals.income - totals.expence).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip formatter={(value)=>[`$${value}`,undefined]} />
              <Legend />
              <Bar
                dataKey="income"
                name={"Income"}
                fill="#22c55e"
                // activeBar={<Rectangle fill="pink" stroke="blue" />}
                radius={[4, 4, 0, 4]}
              />
              <Bar
                dataKey="expence"
                name={"Expence"}
                fill="#ef4444"
                // activeBar={<Rectangle fill="gold" stroke="purple" />}
                radius={[4, 4, 0, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;
