import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, Shield, User, UserCheck } from "lucide-react";

export function StaffStatsCards({ totalStaff, activeCount, managerCount, cashierCount }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Staff
          </CardTitle>
          <Users className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStaff}</div>
          <p className="text-xs text-muted-foreground mt-1">All accounts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active
          </CardTitle>
          <UserCheck className="w-5 h-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Managers
          </CardTitle>
          <Shield className="w-5 h-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{managerCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Admin access</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cashiers
          </CardTitle>
          <User className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cashierCount}</div>
          <p className="text-xs text-muted-foreground mt-1">POS access</p>
        </CardContent>
      </Card>
    </div>
  );
}
