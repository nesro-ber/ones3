import { useAuth } from "@/store/use-auth";
import { useUsers, useCreateUser } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCog, Mail, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { User, InsertUser } from "@shared/schema";

export function UsersPage() {
  const { role } = useAuth();
  const { data: users, isLoading } = useUsers();
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Accès Refusé</h2>
          <p className="text-slate-500">Seul l'administrateur peut accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const mockUsers: User[] = [
    { id: 1, username: 'a.benali', password: '***', role: 'agent', fullName: 'Ahmed Benali', department: 'Département IT' },
    { id: 2, username: 'k.safir', password: '***', role: 'manager', fullName: 'Karim Safir', department: 'Département IT' },
    { id: 3, username: 's.djeffal', password: '***', role: 'hr', fullName: 'Samira Djeffal', department: 'Ressources Humaines' },
  ];

  const displayUsers = users?.length ? users : mockUsers;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Gestion des Employés</h1>
          <p className="text-muted-foreground mt-1">
            Annuaire du personnel et gestion des accès au portail.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-primary text-white">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un Employé
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl max-w-2xl">
            <AddEmployeeForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="enterprise-shadow border-none rounded-2xl">
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>Employés enregistrés dans le système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50 p-4 border-b text-sm font-semibold text-slate-600">
              <div className="col-span-4">Employé</div>
              <div className="col-span-3">Département</div>
              <div className="col-span-3">Nom d'utilisateur</div>
              <div className="col-span-2">Rôle</div>
            </div>
            <div className="divide-y">
              {displayUsers.map(u => (
                <div key={u.id} className="grid grid-cols-12 p-4 items-center bg-white hover:bg-slate-50 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600">
                      {u.fullName.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-900">{u.fullName}</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2 text-sm text-slate-600">
                    <Briefcase className="h-4 w-4 text-slate-400" /> {u.department || 'N/A'}
                  </div>
                  <div className="col-span-3 flex items-center gap-2 text-sm text-slate-600">
                    <UserCog className="h-4 w-4 text-slate-400" /> {u.username}
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary" className="capitalize rounded-lg bg-slate-100 text-slate-700">
                      {u.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddEmployeeForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState<Partial<InsertUser>>({
    username: '',
    password: '',
    fullName: '',
    role: 'agent',
    email: '',
    department: '',
    firstName: '',
    lastName: '',
    matricule: '',
    hireDate: '',
    familialStatus: '',
    bloodType: '',
  });
  const { mutate, isPending } = useCreateUser();

  const handleChange = (field: keyof InsertUser, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.password && formData.fullName) {
      mutate(formData as InsertUser, { onSuccess });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Ajouter un Nouvel Employé</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom Complet *</label>
            <Input 
              required 
              value={formData.fullName || ''} 
              onChange={e => handleChange('fullName', e.target.value)} 
              className="rounded-xl" 
              placeholder="Ahmed Benali"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom d'utilisateur *</label>
            <Input 
              required 
              value={formData.username || ''} 
              onChange={e => handleChange('username', e.target.value)} 
              className="rounded-xl" 
              placeholder="a.benali"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe *</label>
            <Input 
              required 
              type="password"
              value={formData.password || ''} 
              onChange={e => handleChange('password', e.target.value)} 
              className="rounded-xl" 
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rôle</label>
            <Select value={formData.role || 'agent'} onValueChange={(val) => handleChange('role', val)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="hr">RH</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Prénom</label>
            <Input 
              value={formData.firstName || ''} 
              onChange={e => handleChange('firstName', e.target.value)} 
              className="rounded-xl" 
              placeholder="Ahmed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <Input 
              value={formData.lastName || ''} 
              onChange={e => handleChange('lastName', e.target.value)} 
              className="rounded-xl" 
              placeholder="Benali"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input 
              type="email"
              value={formData.email || ''} 
              onChange={e => handleChange('email', e.target.value)} 
              className="rounded-xl" 
              placeholder="ahmed@sonatrach.dz"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Département</label>
            <Input 
              value={formData.department || ''} 
              onChange={e => handleChange('department', e.target.value)} 
              className="rounded-xl" 
              placeholder="IT"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Matricule</label>
            <Input 
              value={formData.matricule || ''} 
              onChange={e => handleChange('matricule', e.target.value)} 
              className="rounded-xl" 
              placeholder="AG001"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date d'embauche</label>
            <Input 
              type="date"
              value={formData.hireDate || ''} 
              onChange={e => handleChange('hireDate', e.target.value)} 
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut Familial</label>
            <Select value={formData.familialStatus || ''} onValueChange={(val) => handleChange('familialStatus', val)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Célibataire</SelectItem>
                <SelectItem value="married">Marié(e)</SelectItem>
                <SelectItem value="divorced">Divorcé(e)</SelectItem>
                <SelectItem value="widowed">Veuf(ve)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Groupe Sanguin</label>
            <Select value={formData.bloodType || ''} onValueChange={(val) => handleChange('bloodType', val)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onSuccess}>Annuler</Button>
        <Button type="submit" disabled={isPending} className="bg-primary">Créer l'Employé</Button>
      </DialogFooter>
    </form>
  );
}
