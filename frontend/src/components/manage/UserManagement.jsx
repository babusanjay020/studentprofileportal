const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

const DEPARTMENTS = ["Computer Science", "Civil", "Mechanical", "Electrical", "Electronics"];
const DEPT_LABELS = {
  "Computer Science": "Computer Science",
  "Civil": "Civil Engineering",
  "Mechanical": "Mechanical Engineering",
  "Electrical": "Electrical Engineering",
  "Electronics": "Electronics Engineering",
};

export default function UserManagement() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("student");
  const [inviteDepartment, setInviteDepartment] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => db.entities.User.list(),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }) => db.entities.User.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await db.users.inviteUser(inviteEmail, inviteRole);
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setInviteRole("student");
      setInviteDepartment("");
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800 border-red-200",
      hod: "bg-purple-100 text-purple-800 border-purple-200",
      lecturer: "bg-blue-100 text-blue-800 border-blue-200",
      student: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getDeptBadgeColor = (dept) => {
    const colors = {
      CSE: "bg-indigo-100 text-indigo-800",
      CE: "bg-yellow-100 text-yellow-800",
      ME: "bg-orange-100 text-orange-800",
      ECE: "bg-cyan-100 text-cyan-800",
      EEE: "bg-pink-100 text-pink-800",
    };
    return colors[dept] || "bg-gray-100 text-gray-800";
  };

  const filteredUsers = users.filter((u) => {
    const matchesDept = deptFilter === "all" || u.department === deptFilter;
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesDept && matchesRole;
  });

  // Group by department
  const grouped = deptFilter === "all"
    ? DEPARTMENTS.reduce((acc, dept) => {
        const deptUsers = filteredUsers.filter(u => u.department === dept);
        if (deptUsers.length > 0) acc[dept] = deptUsers;
        return acc;
      }, {})
    : { [deptFilter]: filteredUsers };

  const unassigned = filteredUsers.filter(u => !u.department);

  return (
    <div className="space-y-6">
      {/* Invite Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <CardTitle>Invite New User</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="invite_email">Email Address *</Label>
                <Input
                  id="invite_email"
                  type="email"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="lecturer">Lecturer</SelectItem>
                    <SelectItem value="hod">HOD</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Department</Label>
                <Select value={inviteDepartment} onValueChange={setInviteDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(dept => (
                      <SelectItem key={dept} value={dept}>{DEPT_LABELS[dept]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Send Invitation
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="lecturer">Lecturer</SelectItem>
            <SelectItem value="hod">HOD</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users grouped by department */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-500">Loading users...</div>
      ) : (
        <>
          {Object.entries(grouped).map(([dept, deptUsers]) => (
            <Card key={dept}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge className={getDeptBadgeColor(dept)}>{dept}</Badge>
                  <CardTitle className="text-base">{DEPT_LABELS[dept]}</CardTitle>
                  <span className="ml-auto text-sm text-slate-500">{deptUsers.length} member{deptUsers.length !== 1 ? "s" : ""}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deptUsers.map((user) => (
                    <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Shield className="w-4 h-4 text-slate-400" />
                          <p className="font-medium text-slate-900">{user.full_name}</p>
                        </div>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        {user.semester && <p className="text-xs text-slate-500">Semester {user.semester}</p>}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role?.toUpperCase() || "STUDENT"}
                        </Badge>

                        <Select
                          value={user.role}
                          onValueChange={(value) => updateUserMutation.mutate({ userId: user.id, data: { role: value } })}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                            <SelectItem value="hod">HOD</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={user.department || ""}
                          onValueChange={(value) => updateUserMutation.mutate({ userId: user.id, data: { department: value } })}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue placeholder="Dept" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {unassigned.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-800">Unassigned</Badge>
                  <CardTitle className="text-base">No Department Assigned</CardTitle>
                  <span className="ml-auto text-sm text-slate-500">{unassigned.length} member{unassigned.length !== 1 ? "s" : ""}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unassigned.map((user) => (
                    <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Shield className="w-4 h-4 text-slate-400" />
                          <p className="font-medium text-slate-900">{user.full_name}</p>
                        </div>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role?.toUpperCase() || "STUDENT"}
                        </Badge>
                        <Select
                          value={user.role}
                          onValueChange={(value) => updateUserMutation.mutate({ userId: user.id, data: { role: value } })}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                            <SelectItem value="hod">HOD</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={user.department || ""}
                          onValueChange={(value) => updateUserMutation.mutate({ userId: user.id, data: { department: value } })}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue placeholder="Dept" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-slate-500">No users found</div>
          )}
        </>
      )}
    </div>
  );
}