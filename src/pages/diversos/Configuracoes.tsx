// src/pages/diversos/Configuracoes.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Settings,
    Printer,
    Tag,
    Barcode,
    Mail,
    Save,
    RefreshCw,
    Eye,
    FileText,
    Package,
    Grid,
    Calendar,
    DollarSign,
    Percent,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

export default function Configuracoes() {
    const [config, setConfig] = useState({
        // Configurações de cabeçalho (baseado no manual)
        cabecalhoEtiquetas: 0,
        tabulacaoCodBarras: 0,
        tabulacaoSegundaColuna: 5,

        // Configurações de impressão
        modeloEtiquetaProduto: 'PIMACO 6180',
        modeloEtiquetaMalaDireta: 'PIMACO 6182',
        impressoraPadrao: 'impressora-fiscal',

        // Configurações gerais
        usarCodigoBarras: true,
        controleEstoqueAutomatico: true,
        gerarComissaoAutomatica: true,
        alertaEstoqueMinimo: true,

        // Configurações fiscais
        aliquotaPadrao: 18,
        substituicaoTributaria: 0,
        ncmPadrao: '00000000',

        // Configurações de sistema
        diasBackupAutomatico: 7,
        manterLogsPor: 30,
        limiteUsuariosConectados: 10,
    });

    const [testLabel, setTestLabel] = useState({
        codigo: '001.001',
        descricao: 'CONSULTA EM HORÁRIO NORMAL',
        preco: '120.00',
        codigoBarras: '7891000315507'
    });

    const handleSave = () => {
        toast.success('Configurações salvas com sucesso!');
        // Aqui normalmente salvaria no backend
    };

    const handleReset = () => {
        setConfig({
            cabecalhoEtiquetas: 0,
            tabulacaoCodBarras: 0,
            tabulacaoSegundaColuna: 5,
            modeloEtiquetaProduto: 'PIMACO 6180',
            modeloEtiquetaMalaDireta: 'PIMACO 6182',
            impressoraPadrao: 'impressora-fiscal',
            usarCodigoBarras: true,
            controleEstoqueAutomatico: true,
            gerarComissaoAutomatica: true,
            alertaEstoqueMinimo: true,
            aliquotaPadrao: 18,
            substituicaoTributaria: 0,
            ncmPadrao: '00000000',
            diasBackupAutomatico: 7,
            manterLogsPor: 30,
            limiteUsuariosConectados: 10,
        });
        toast.info('Configurações restauradas para padrão');
    };

    const imprimirEtiquetaTeste = () => {
        toast.success('Etiqueta de teste enviada para impressão!', {
            description: `Modelo: ${config.modeloEtiquetaProduto}`
        });
    };

    const visualizarAjuste = (campo: string, valor: number) => {
        toast.info(`Ajuste de ${campo}: ${valor}`, {
            description: valor > 0 ? `"Andar" ${valor} caracteres` : `"Voltar" ${Math.abs(valor)} caracteres`
        });
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Settings className="h-8 w-8" />
                            Configurações do Sistema
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Configure as opções de impressão, etiquetas e comportamento do SofVet
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleReset} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Restaurar Padrão
                        </Button>
                        <Button onClick={handleSave} className="gap-2">
                            <Save className="h-4 w-4" />
                            Salvar Configurações
                        </Button>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                        <Printer className="h-3 w-3" />
                        Impressão
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" />
                        Etiquetas
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Barcode className="h-3 w-3" />
                        Código de Barras
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <DollarSign className="h-3 w-3" />
                        Fiscal
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Package className="h-3 w-3" />
                        Estoque
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="impressao" className="w-full">
                <TabsList className="grid grid-cols-5 mb-8">
                    <TabsTrigger value="impressao" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Impressão
                    </TabsTrigger>
                    <TabsTrigger value="etiquetas" className="gap-2">
                        <Tag className="h-4 w-4" />
                        Etiquetas
                    </TabsTrigger>
                    <TabsTrigger value="estoque" className="gap-2">
                        <Package className="h-4 w-4" />
                        Estoque
                    </TabsTrigger>
                    <TabsTrigger value="fiscal" className="gap-2">
                        <DollarSign className="h-4 w-4" />
                        Fiscal
                    </TabsTrigger>
                    <TabsTrigger value="sistema" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Sistema
                    </TabsTrigger>
                </TabsList>

                {/* ABA 1: IMPRESSÃO (Baseado no manual - cabeçalho e tabulação) */}
                <TabsContent value="impressao">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Printer className="h-5 w-5" />
                                    Configurações de Impressão
                                </CardTitle>
                                <CardDescription>
                                    Ajuste cabeçalho e tabulação para impressão de etiquetas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start">
                                            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                            <div>
                                                <p className="font-medium text-blue-800">Importante do manual</p>
                                                <p className="text-blue-700 text-sm mt-1">
                                                    Aconselhamos que você, antes de incluir valores nestes itens, faça uma impressão das etiquetas para mala-direta e preços para que verifiquem qual o ajuste necessário.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="cabecalho" className="flex items-center gap-2 mb-2">
                                                Cabeçalho das Etiquetas
                                                <Badge variant="outline">Unidades: {config.cabecalhoEtiquetas}</Badge>
                                            </Label>
                                            <div className="space-y-3">
                                                <Slider
                                                    id="cabecalho"
                                                    min={-20}
                                                    max={20}
                                                    step={1}
                                                    value={[config.cabecalhoEtiquetas]}
                                                    onValueChange={(value) => {
                                                        setConfig({ ...config, cabecalhoEtiquetas: value[0] });
                                                        visualizarAjuste('cabeçalho', value[0]);
                                                    }}
                                                />
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>Voltar 20 chars</span>
                                                    <span>0</span>
                                                    <span>Andar 20 chars</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Cada unidade representa acréscimo ou decréscimo de posições por caracteres.
                                                </p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <Label htmlFor="tabulacao" className="flex items-center gap-2 mb-2">
                                                Tabulação Código de Barras
                                                <Badge variant="outline">Unidades: {config.tabulacaoCodBarras}</Badge>
                                            </Label>
                                            <div className="space-y-3">
                                                <Slider
                                                    id="tabulacao"
                                                    min={-20}
                                                    max={20}
                                                    step={1}
                                                    value={[config.tabulacaoCodBarras]}
                                                    onValueChange={(value) => {
                                                        setConfig({ ...config, tabulacaoCodBarras: value[0] });
                                                        visualizarAjuste('tabulação código de barras', value[0]);
                                                    }}
                                                />
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>Voltar 20 chars</span>
                                                    <span>0</span>
                                                    <span>Andar 20 chars</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <Label htmlFor="segunda-coluna" className="flex items-center gap-2 mb-2">
                                                Tabulação 2ª Coluna (Manual: Exemplo com 5 e -13)
                                                <Badge variant="outline">Unidades: {config.tabulacaoSegundaColuna}</Badge>
                                            </Label>
                                            <div className="space-y-3">
                                                <Slider
                                                    id="segunda-coluna"
                                                    min={-20}
                                                    max={20}
                                                    step={1}
                                                    value={[config.tabulacaoSegundaColuna]}
                                                    onValueChange={(value) => {
                                                        setConfig({ ...config, tabulacaoSegundaColuna: value[0] });
                                                        visualizarAjuste('tabulação 2ª coluna', value[0]);
                                                    }}
                                                />
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>Voltar 20 chars</span>
                                                    <span>0</span>
                                                    <span>Andar 20 chars</span>
                                                </div>
                                                <div className="p-3 bg-gray-50 border rounded text-sm">
                                                    <p className="font-medium">Exemplo do manual:</p>
                                                    <p className="text-muted-foreground">
                                                        Se em TABULAÇÃO COD.BARRAS 2a COLUNA você digitar o número <strong>5</strong>, ele representa o espaço necessário para "andar" mais 5 caracteres.
                                                        <br />
                                                        Se digitar <strong>-13</strong> vai representar que deve "voltar" 13 caracteres.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Impressora Padrão</h3>
                                    <div className="space-y-3">
                                        <Select
                                            value={config.impressoraPadrao}
                                            onValueChange={(value) => setConfig({ ...config, impressoraPadrao: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a impressora" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="impressora-fiscal">Impressora Fiscal</SelectItem>
                                                <SelectItem value="impressora-normal">Impressora Normal</SelectItem>
                                                <SelectItem value="cupom-nao-fiscal">Cupom Não Fiscal</SelectItem>
                                                <SelectItem value="etiquetas">Impressora de Etiquetas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">
                                            O SOFVET trabalha com impressora do tipo fiscal. Existem duas impressoras: normal e cupom não fiscal.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Pré-visualização de Ajustes
                                </CardTitle>
                                <CardDescription>
                                    Visualize como os ajustes afetam a impressão
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Etiqueta de Produto</h3>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                        <div className="text-center space-y-2">
                                            <div className="font-mono text-sm" style={{
                                                marginLeft: `${config.cabecalhoEtiquetas * 8}px`
                                            }}>
                                                {testLabel.descricao}
                                            </div>
                                            <div className="font-bold text-lg" style={{
                                                marginLeft: `${config.cabecalhoEtiquetas * 8}px`
                                            }}>
                                                R$ {testLabel.preco}
                                            </div>
                                            <div className="text-xs text-muted-foreground" style={{
                                                marginLeft: `${config.cabecalhoEtiquetas * 8}px`
                                            }}>
                                                Cód: {testLabel.codigo}
                                            </div>
                                            <div className="mt-4" style={{
                                                marginLeft: `${config.tabulacaoCodBarras * 8}px`
                                            }}>
                                                <div className="bg-black h-8 w-48 mx-auto"></div>
                                                <div className="text-xs mt-1">{testLabel.codigoBarras}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Cabeçalho: {config.cabecalhoEtiquetas} unidades •
                                        Cód.Barras: {config.tabulacaoCodBarras} unidades
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Teste de Impressão</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Descrição</Label>
                                            <Input
                                                value={testLabel.descricao}
                                                onChange={(e) => setTestLabel({ ...testLabel, descricao: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Preço</Label>
                                            <Input
                                                value={testLabel.preco}
                                                onChange={(e) => setTestLabel({ ...testLabel, preco: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={imprimirEtiquetaTeste} className="w-full gap-2">
                                        <Printer className="h-4 w-4" />
                                        Imprimir Etiqueta de Teste
                                    </Button>

                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                        <p className="text-yellow-800">
                                            <strong>Dica:</strong> Imprima uma etiqueta de teste após cada ajuste para verificar o posicionamento.
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Resumo dos Ajustes</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Cabeçalho:</span>
                                            <Badge variant={config.cabecalhoEtiquetas === 0 ? "outline" : "secondary"}>
                                                {config.cabecalhoEtiquetas} unidades
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Tabulação Cód.Barras:</span>
                                            <Badge variant={config.tabulacaoCodBarras === 0 ? "outline" : "secondary"}>
                                                {config.tabulacaoCodBarras} unidades
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Tabulação 2ª Coluna:</span>
                                            <Badge variant={config.tabulacaoSegundaColuna === 5 ? "outline" : "secondary"}>
                                                {config.tabulacaoSegundaColuna} unidades
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ABA 2: ETIQUETAS (Modelos PIMACO do manual) */}
                <TabsContent value="etiquetas">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Configurações de Etiquetas
                            </CardTitle>
                            <CardDescription>
                                Configure os modelos de etiquetas para produtos e mala direta
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start">
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                    <div>
                                        <p className="font-medium text-blue-800">Informação do manual</p>
                                        <p className="text-blue-700 text-sm mt-1">
                                            O SOFVET se utiliza dos seguintes modelos de etiquetas: <strong>PIMACO 6180</strong> para produtos e <strong>PIMACO 6182</strong> para mala-direta e prateleiras.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Etiquetas de Produtos</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <Label>Modelo de Etiqueta</Label>
                                            <Select
                                                value={config.modeloEtiquetaProduto}
                                                onValueChange={(value) => setConfig({ ...config, modeloEtiquetaProduto: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o modelo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PIMACO 6180">PIMACO 6180 (Padrão)</SelectItem>
                                                    <SelectItem value="PIMACO 6181">PIMACO 6181</SelectItem>
                                                    <SelectItem value="PIMACO 6183">PIMACO 6183</SelectItem>
                                                    <SelectItem value="PIMACO 6184">PIMACO 6184</SelectItem>
                                                    <SelectItem value="OUTRO">Outro modelo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="p-4 border rounded-lg">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-blue-100 p-2 rounded">
                                                    <Package className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">PIMACO 6180</p>
                                                    <p className="text-sm text-muted-foreground">Etiqueta para produtos</p>
                                                </div>
                                            </div>
                                            <div className="text-sm space-y-1">
                                                <p>• Dimensões: 70mm x 25mm</p>
                                                <p>• Código de barras padrão</p>
                                                <p>• Preço e descrição</p>
                                                <p>• Para prateleiras</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Etiquetas de Mala Direta</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <Label>Modelo de Etiqueta</Label>
                                            <Select
                                                value={config.modeloEtiquetaMalaDireta}
                                                onValueChange={(value) => setConfig({ ...config, modeloEtiquetaMalaDireta: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o modelo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PIMACO 6182">PIMACO 6182 (Padrão)</SelectItem>
                                                    <SelectItem value="PIMACO 6185">PIMACO 6185</SelectItem>
                                                    <SelectItem value="PIMACO 6186">PIMACO 6186</SelectItem>
                                                    <SelectItem value="PIMACO 6187">PIMACO 6187</SelectItem>
                                                    <SelectItem value="OUTRO">Outro modelo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="p-4 border rounded-lg">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-green-100 p-2 rounded">
                                                    <Mail className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">PIMACO 6182</p>
                                                    <p className="text-sm text-muted-foreground">Etiqueta para mala direta</p>
                                                </div>
                                            </div>
                                            <div className="text-sm space-y-1">
                                                <p>• Dimensões: 99mm x 38mm</p>
                                                <p>• Para envio de correspondência</p>
                                                <p>• Endereçamento</p>
                                                <p>• Carta de cobrança</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Configurações de Etiquetas</h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Imprimir código de barras</Label>
                                                <p className="text-sm text-muted-foreground">Incluir código nas etiquetas</p>
                                            </div>
                                            <Switch
                                                checked={config.usarCodigoBarras}
                                                onCheckedChange={(checked) => setConfig({ ...config, usarCodigoBarras: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Gerar etiquetas na compra</Label>
                                                <p className="text-sm text-muted-foreground">Perguntar ao incluir produto</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Label>Quantidade padrão por página</Label>
                                            <div className="flex items-center gap-2">
                                                <Input type="number" defaultValue="24" className="w-20" />
                                                <span className="text-sm text-muted-foreground">etiquetas</span>
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Margem de segurança</Label>
                                            <div className="flex items-center gap-2">
                                                <Input type="number" defaultValue="2" className="w-20" />
                                                <span className="text-sm text-muted-foreground">mm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" className="gap-2">
                                    <Eye className="h-4 w-4" />
                                    Visualizar Etiqueta
                                </Button>
                                <Button className="gap-2">
                                    <Printer className="h-4 w-4" />
                                    Testar Impressão
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA 3: ESTOQUE */}
                <TabsContent value="estoque">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Configurações de Estoque
                            </CardTitle>
                            <CardDescription>
                                Controle automático de estoque e comissões
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Controle de Estoque</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Controle automático de estoque</Label>
                                                <p className="text-sm text-muted-foreground">Baixar estoque nas vendas</p>
                                            </div>
                                            <Switch
                                                checked={config.controleEstoqueAutomatico}
                                                onCheckedChange={(checked) => setConfig({ ...config, controleEstoqueAutomatico: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Alerta de estoque mínimo</Label>
                                                <p className="text-sm text-muted-foreground">Notificar quando atingir limite</p>
                                            </div>
                                            <Switch
                                                checked={config.alertaEstoqueMinimo}
                                                onCheckedChange={(checked) => setConfig({ ...config, alertaEstoqueMinimo: checked })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Estoque mínimo padrão</Label>
                                            <div className="flex items-center gap-2">
                                                <Input type="number" defaultValue="5" className="w-24" />
                                                <span className="text-sm text-muted-foreground">unidades</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Estoque máximo padrão</Label>
                                            <div className="flex items-center gap-2">
                                                <Input type="number" defaultValue="50" className="w-24" />
                                                <span className="text-sm text-muted-foreground">unidades</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Comissões</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Gerar comissão automaticamente</Label>
                                                <p className="text-sm text-muted-foreground">Baseado no manual</p>
                                            </div>
                                            <Switch
                                                checked={config.gerarComissaoAutomatica}
                                                onCheckedChange={(checked) => setConfig({ ...config, gerarComissaoAutomatica: checked })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Comissão padrão para serviços</Label>
                                            <div className="flex items-center gap-2">
                                                <Input type="number" defaultValue="10" className="w-24" />
                                                <span className="text-sm text-muted-foreground">%</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Comissão padrão para produtos</Label>
                                            <div className="flex items-center gap-2">
                                                <Input type="number" defaultValue="5" className="w-24" />
                                                <span className="text-sm text-muted-foreground">%</span>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                            <p className="text-yellow-800">
                                                <strong>Atenção do manual:</strong> A baixa das comissões só ocorrerá depois de utilizar a opção de visualização!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Validade de Produtos</h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Alerta de vencimento</Label>
                                        <div className="flex items-center gap-2">
                                            <Input type="number" defaultValue="30" className="w-24" />
                                            <span className="text-sm text-muted-foreground">dias antes</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Bloquear venda de vencidos</Label>
                                        <div className="flex items-center gap-2">
                                            <Input type="number" defaultValue="7" className="w-24" />
                                            <span className="text-sm text-muted-foreground">dias antes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA 4: FISCAL (Baseado no manual - alíquota e substituição tributária) */}
                <TabsContent value="fiscal">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Configurações Fiscais
                            </CardTitle>
                            <CardDescription>
                                Alíquotas e configurações tributárias
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start">
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                    <div>
                                        <p className="font-medium text-blue-800">Informação do manual</p>
                                        <p className="text-blue-700 text-sm mt-1">
                                            Alíquota e Substituição Tributária: Campos obrigatórios para trabalhar com o Sistema Fiscal.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Configurações Tributárias</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="aliquota" className="flex items-center gap-2 mb-2">
                                                <Percent className="h-4 w-4" />
                                                Alíquota Padrão (%)
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="aliquota"
                                                    type="number"
                                                    value={config.aliquotaPadrao}
                                                    onChange={(e) => setConfig({ ...config, aliquotaPadrao: Number(e.target.value) })}
                                                    className="w-32"
                                                />
                                                <span className="text-sm text-muted-foreground">%</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Alíquota padrão para produtos e serviços
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="substituicao" className="flex items-center gap-2 mb-2">
                                                <Percent className="h-4 w-4" />
                                                Substituição Tributária (%)
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="substituicao"
                                                    type="number"
                                                    value={config.substituicaoTributaria}
                                                    onChange={(e) => setConfig({ ...config, substituicaoTributaria: Number(e.target.value) })}
                                                    className="w-32"
                                                />
                                                <span className="text-sm text-muted-foreground">%</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Percentual de substituição tributária
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="ncm" className="flex items-center gap-2 mb-2">
                                                <Grid className="h-4 w-4" />
                                                NCM Padrão
                                            </Label>
                                            <Input
                                                id="ncm"
                                                value={config.ncmPadrao}
                                                onChange={(e) => setConfig({ ...config, ncmPadrao: e.target.value })}
                                                placeholder="00000000"
                                                maxLength={8}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Nomenclatura Comum do Mercosul – 8 dígitos
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Regimes Tributários</h3>

                                    <div className="space-y-3">
                                        <Select defaultValue="simples-nacional">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o regime" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="simples-nacional">Simples Nacional</SelectItem>
                                                <SelectItem value="lucro-presumido">Lucro Presumido</SelectItem>
                                                <SelectItem value="lucro-real">Lucro Real</SelectItem>
                                                <SelectItem value="mei">MEI</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="p-4 border rounded-lg">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="bg-green-100 p-2 rounded">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Configurações ativas</p>
                                                    <p className="text-sm text-muted-foreground">Fiscal pronto para uso</p>
                                                </div>
                                            </div>
                                            <div className="text-sm space-y-1">
                                                <p>• Alíquota: {config.aliquotaPadrao}%</p>
                                                <p>• Subst. Tributária: {config.substituicaoTributaria}%</p>
                                                <p>• NCM: {config.ncmPadrao}</p>
                                                <p>• Impressora fiscal ativa</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Certificado Digital</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="font-medium">Usar certificado digital</Label>
                                            <p className="text-sm text-muted-foreground">Para NF-e e NFC-e</p>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Vencimento do certificado</Label>
                                            <Input type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Senha do certificado</Label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABA 5: SISTEMA */}
                <TabsContent value="sistema">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Configurações do Sistema
                            </CardTitle>
                            <CardDescription>
                                Configurações gerais do SofVet
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Backup e Segurança</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <Label>Backup automático a cada</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={config.diasBackupAutomatico}
                                                    onChange={(e) => setConfig({ ...config, diasBackupAutomatico: Number(e.target.value) })}
                                                    className="w-24"
                                                />
                                                <span className="text-sm text-muted-foreground">dias</span>
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Manter logs por</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={config.manterLogsPor}
                                                    onChange={(e) => setConfig({ ...config, manterLogsPor: Number(e.target.value) })}
                                                    className="w-24"
                                                />
                                                <span className="text-sm text-muted-foreground">dias</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Backup na nuvem</Label>
                                                <p className="text-sm text-muted-foreground">Cópia automática online</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg">Usuários e Acessos</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <Label>Limite de usuários conectados</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={config.limiteUsuariosConectados}
                                                    onChange={(e) => setConfig({ ...config, limiteUsuariosConectados: Number(e.target.value) })}
                                                    className="w-24"
                                                />
                                                <span className="text-sm text-muted-foreground">usuários</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                O SOFVET permite até 10 terminais simultâneos
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Log automático de atividades</Label>
                                                <p className="text-sm text-muted-foreground">Registrar ações dos usuários</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="font-medium">Tempo de sessão</Label>
                                                <p className="text-sm text-muted-foreground">Logout automático</p>
                                            </div>
                                            <Select defaultValue="60">
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="30">30 minutos</SelectItem>
                                                    <SelectItem value="60">60 minutos</SelectItem>
                                                    <SelectItem value="120">2 horas</SelectItem>
                                                    <SelectItem value="240">4 horas</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Personalização</h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Nome da clínica</Label>
                                        <Input defaultValue="Clínica Veterinária Jardins" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>CNPJ/CPF</Label>
                                        <Input placeholder="00.000.000/0000-00" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Telefone</Label>
                                        <Input placeholder="(11) 99999-9999" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" placeholder="contato@clinicavet.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Logotipo da clínica</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <div className="mx-auto w-32 h-16 bg-gray-100 rounded flex items-center justify-center mb-2">
                                            <span className="text-gray-400">LOGO</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Dimensões recomendadas: 18,39cm x 2,21cm
                                        </p>
                                        <Button variant="outline" size="sm">
                                            Alterar Logotipo
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        O arquivo deve ser salvo como LOGO.BMP na pasta SOFVETW
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Rodapé com ações */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                    <p>Configurações baseadas no manual do SofVet</p>
                    <p className="text-xs">Cabeçalho e tabulação: cada unidade = 1 caractere</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReset}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Salvar Todas as Configurações
                    </Button>
                </div>
            </div>
        </div>
    );
}