import { useState } from "react";
import { useStaff } from "../hooks/useStaff.js";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

// ── Common Components ────────────────────────────────────────────────────────
import { PageHeader } from "../components/common/PageHeader.jsx";
import { SearchBar } from "../components/common/SearchBar.jsx";
import { FilterBar } from "../components/common/FilterBar.jsx";

// ── Staff Components ─────────────────────────────────────────────────────────
import { StaffStatsCards } from "../components/staff/StaffStatsCards.jsx";
import { StaffTable } from "../components/staff/StaffTable.jsx";
import { StaffForm } from "../components/staff/StaffForm.jsx";
import { StaffViewDialog } from "../components/staff/StaffViewDialog.jsx";
import { DeleteConfirmDialog } from "../components/staff/DeleteConfirmDialog.jsx";

const ROLE_OPTIONS = ["Manager", "Cashier"];
const EMPTY_FORM = { name: "", email: "", role: "Cashier", status: "Active", image: null };

export function StaffManagementPage() {
  const { staff, loading, addStaff, updateStaff, deleteStaff, updateStaffStatus } = useStaff();

  // ── UI State ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [editDialog, setEditDialog] = useState({ open: false, staff: null, mode: "add" });
  const [viewDialog, setViewDialog] = useState({ open: false, staff: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, staff: null });
  const [formData, setFormData] = useState(EMPTY_FORM);

  // ── Derived Data ──────────────────────────────────────────────────────────
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All" || s.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const activeCount = staff.filter((s) => s.status === "Active").length;
  const managerCount = staff.filter((s) => s.role === "Manager").length;
  const cashierCount = staff.filter((s) => s.role === "Cashier").length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setFormData(EMPTY_FORM);
    setEditDialog({ open: true, staff: null, mode: "add" });
  };

  const handleOpenEdit = (member) => {
    setFormData({
      name: member.name, email: member.email, role: member.role,
      status: member.status, image: member.image || null,
    });
    setEditDialog({ open: true, staff: member, mode: "edit" });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields"); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address"); return;
    }
    if (editDialog.mode === "add" && !formData.image) {
      toast.error("Please upload a profile image"); return;
    }

    const data = { name: formData.name, email: formData.email, role: formData.role, status: formData.status, image: formData.image };

    try {
      if (editDialog.mode === "add") {
        await addStaff(data);
        toast.success("Staff member added successfully!");
      } else if (editDialog.staff) {
        await updateStaff(editDialog.staff.id, data);
        toast.success("Staff member updated successfully!");
      }
      setEditDialog({ open: false, staff: null, mode: "add" });
    } catch (err) {
      toast.error(err.message || "Failed to save staff member");
    }
  };

  const handleDelete = async () => {
    if (deleteDialog.staff) {
      try {
        await deleteStaff(deleteDialog.staff.id);
        toast.success("Staff member deleted successfully");
        setDeleteDialog({ open: false, staff: null });
      } catch (err) {
        toast.error(err.message || "Failed to delete staff member");
      }
    }
  };

  const handleToggleStatus = async (member) => {
    const newStatus = member.status === "Active" ? "Inactive" : "Active";
    try {
      await updateStaffStatus(member.id, newStatus);
      toast.success(`Staff member ${newStatus === "Active" ? "activated" : "deactivated"}`);
    } catch (err) {
      toast.error(err.message || "Failed to update staff status");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <PageHeader title="Staff Management" subtitle="Manage staff accounts, images, and permissions">
        <Button onClick={handleOpenAdd}>
          <UserPlus className="w-4 h-4 mr-2" /> Add Staff Member
        </Button>
      </PageHeader>

      {/* ── Stats Cards ───────────────────────────────────────────────────── */}
      <StaffStatsCards
        totalStaff={staff.length}
        activeCount={activeCount}
        managerCount={managerCount}
        cashierCount={cashierCount}
      />

      {/* ── Search & Filters ──────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search staff by name or email..."
              className="flex-1"
            />
            <FilterBar
              options={ROLE_OPTIONS}
              selected={selectedRole}
              onSelect={setSelectedRole}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Staff Table ───────────────────────────────────────────────────── */}
      {loading && staff.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading staff...</p>
      ) : (
        <StaffTable
          staff={filteredStaff}
          onView={(m) => setViewDialog({ open: true, staff: m })}
          onEdit={handleOpenEdit}
          onDelete={(m) => setDeleteDialog({ open: true, staff: m })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* ── Dialogs ──────────────────────────────────────────────────────── */}
      <StaffForm
        open={editDialog.open}
        mode={editDialog.mode}
        formData={formData}
        onChange={setFormData}
        onSave={handleSave}
        onClose={() => setEditDialog({ open: false, staff: null, mode: "add" })}
      />
      <StaffViewDialog
        open={viewDialog.open}
        member={viewDialog.staff}
        onClose={() => setViewDialog({ open: false, staff: null })}
      />
      <DeleteConfirmDialog
        open={deleteDialog.open}
        memberName={deleteDialog.staff?.name}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialog({ open: false, staff: null })}
      />
    </div>
  );
}
