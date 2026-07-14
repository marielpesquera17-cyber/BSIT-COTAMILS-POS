import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function StatsCard({ title, value, icon: Icon, iconColor = "text-primary", valueColor = "", subtitle }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
