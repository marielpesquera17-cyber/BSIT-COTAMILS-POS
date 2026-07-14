import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function PeakHoursBarChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak Hours — Today</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" orientation="left" stroke="var(--chart-2)" />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--chart-1)"
            />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="sales"
              fill="var(--chart-2)"
              name="Sales (₱)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="orders"
              fill="var(--chart-1)"
              name="Orders"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
