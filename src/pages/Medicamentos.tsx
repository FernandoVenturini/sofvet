import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Pill,
  Package,
  FlaskConical,
  Building,
  AlertCircle
} from 'lucide-react';

const MedicamentosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados de exemplo
  const medicamentos = [
    { 
      id: 1, 
      nome: 'Dipirona', 
      principioAtivo: 'Dipirona Sódica', 
      concentracao: '500mg', 
      formaFarmaceutica: 'Comprimido', 
      fabricante: 'EMS',
      categoria: 'Analgésico',
      estoque: 150,
      status: 'ativo'
    },
    { 
      id: 2, 
      nome: 'Amoxicilina', 
      principioAtivo: 'Amoxicilina Tri-Hidratada', 
      concentracao: '500mg', 
      formaFarmaceutica: 'Cápsula', 
      fabricante: 'Eurofarma',
      categoria: 'Antibiótico',
      estoque: 85,
      status: 'ativo'
    },
    { 
      id: 3, 
      nome: 'Losartana', 
      principioAtivo: 'Losartana Potássica', 
      concentracao: '50mg', 
      formaFarmaceutica: 'Comprimido', 
      fabricante: 'Medley',
      categoria: 'Anti-hipertensivo',
      estoque: 42,
      status: 'ativo'
    },
    { 
      id: 4, 
      nome: 'Omeprazol', 
      principioAtivo: 'Omeprazol', 
      concentracao: '20mg', 
      formaFarmaceutica: 'Cápsula', 
      fabricante: 'Aché',
      categoria: 'Gastrointestinal',
      estoque: 0,
      status: 'inativo'
    },
  ];

  // Filtrar medicamentos
  const filteredMedicamentos = medicamentos.filter(med =>
    med.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Pill className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Medicamentos (DEF)</h1>
            </div>
            <p className="text-gray-600">Gerencie o cadastro de medicamentos da clínica veterinária</p>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Medicamento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Medicamentos</p>
                  <p className="text-2xl font-bold">{medicamentos.length}</p>
                </div>
                <Package className="h-10 w-10 text-blue-100 bg-blue-600 p-2 rounded-lg" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Em Estoque</p>
                  <p className="text-2xl font-bold">{medicamentos.filter(m => m.estoque > 0).length}</p>
                </div>
                <FlaskConical className="h-10 w-10 text-green-100 bg-green-600 p-2 rounded-lg" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Fabricantes</p>
                  <p className="text-2xl font-bold">{[...new Set(medicamentos.map(m => m.fabricante))].length}</p>
                </div>
                <Building className="h-10 w-10 text-purple-100 bg-purple-600 p-2 rounded-lg" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sem Estoque</p>
                  <p className="text-2xl font-bold text-red-600">{medicamentos.filter(m => m.estoque === 0).length}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-red-100 bg-red-600 p-2 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar por nome, princípio ativo ou fabricante..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros Avançados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Medicamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 font-medium">Princípio Ativo</th>
                    <th className="text-left py-3 px-4 font-medium">Concentração</th>
                    <th className="text-left py-3 px-4 font-medium">Forma</th>
                    <th className="text-left py-3 px-4 font-medium">Fabricante</th>
                    <th className="text-left py-3 px-4 font-medium">Categoria</th>
                    <th className="text-left py-3 px-4 font-medium">Estoque</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicamentos.map((med) => (
                    <tr key={med.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{med.id}</td>
                      <td className="py-3 px-4 font-medium">{med.nome}</td>
                      <td className="py-3 px-4">{med.principioAtivo}</td>
                      <td className="py-3 px-4">{med.concentracao}</td>
                      <td className="py-3 px-4">{med.formaFarmaceutica}</td>
                      <td className="py-3 px-4">{med.fabricante}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{med.categoria}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className={med.estoque === 0 ? "text-red-600 font-semibold" : ""}>
                          {med.estoque} unidades
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={med.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {med.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicamentosPage;