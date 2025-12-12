import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Package, DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TaxRate {
  rate: number;
  name: string;
}

interface TaxCategory {
  [key: string]: TaxRate;
}

interface MercadoLivreTaxes {
  [key: string]: TaxCategory;
}

const DropshippingCalculator = () => {
  const [costPrice, setCostPrice] = useState('');
  const [marketplace, setMarketplace] = useState('shopee');
  const [category, setCategory] = useState('eletronicos');
  const [shippingOption, setShippingOption] = useState('with'); // Para Shopee
  const [adType, setAdType] = useState('premium'); // Para Mercado Livre
  const [useShopeeAds, setUseShopeeAds] = useState(false);
  const [adsCPC, setAdsCPC] = useState('');
  const [adsConversionRate, setAdsConversionRate] = useState('1.5');

  // Categorias Shopee com CPC estimado (baseado em médias de mercado Brasil 2024/25)
  const shopeeCategories: Record<string, { name: string; avgCPC: number; avgCR: number }> = {
    eletronicos: { name: 'Eletrônicos', avgCPC: 0.45, avgCR: 1.2 },
    moda: { name: 'Moda e Acessórios', avgCPC: 0.35, avgCR: 2.5 },
    casa: { name: 'Casa e Decoração', avgCPC: 0.40, avgCR: 1.8 },
    beleza: { name: 'Beleza e Cuidados', avgCPC: 0.38, avgCR: 2.2 },
    celulares: { name: 'Celulares e Acessórios', avgCPC: 0.55, avgCR: 1.0 },
    informatica: { name: 'Informática', avgCPC: 0.50, avgCR: 1.1 },
    esportes: { name: 'Esportes e Lazer', avgCPC: 0.42, avgCR: 1.5 },
    brinquedos: { name: 'Brinquedos', avgCPC: 0.30, avgCR: 2.0 },
    papelaria: { name: 'Papelaria', avgCPC: 0.25, avgCR: 2.8 },
    automotivo: { name: 'Automotivo', avgCPC: 0.48, avgCR: 1.3 }
  };

  // Handler para mudança de categoria Shopee
  const handleShopeeCategoryChange = (cat: string) => {
    setCategory(cat);
    // Sugere CPC e CR baseados na categoria se os campos estiverem vazios ou com valores padrão
    // @ts-ignore
    const catData = shopeeCategories[cat];
    if (catData) {
       // Sempre atualiza os inputs quando a categoria muda, para refletir a nova estimativa
       setAdsCPC(catData.avgCPC.toString());
       setAdsConversionRate(catData.avgCR.toString());
    }
  };

  // Taxas reais do Shopee (atualizadas 2024)
  const shopeeTaxes = {
    withFreeShipping: { base: 20, fixed: 4, description: '14% comissão + 6% frete grátis + R$4' },
    withoutFreeShipping: { base: 14, fixed: 4, description: '14% comissão + R$4' }
  };

  // Taxas reais do Mercado Livre por categoria (atualizadas 2024)
  const mercadoLivreTaxes: MercadoLivreTaxes = {
    gratis: {
      eletronicos: { rate: 0, name: 'Eletrônicos' },
      celulares: { rate: 0, name: 'Celulares e Acessórios' },
      informatica: { rate: 0, name: 'Informática' },
      moda: { rate: 0, name: 'Moda e Acessórios' },
      calcados: { rate: 0, name: 'Calçados' },
      relogios: { rate: 0, name: 'Relógios' },
      casa: { rate: 0, name: 'Casa e Decoração' },
      moveis: { rate: 0, name: 'Móveis' },
      beleza: { rate: 0, name: 'Beleza e Cuidado Pessoal' },
      esportes: { rate: 0, name: 'Esportes e Fitness' },
      brinquedos: { rate: 0, name: 'Brinquedos' },
      ferramentas: { rate: 0, name: 'Ferramentas' },
      pet: { rate: 0, name: 'Pet Shop' },
      livros: { rate: 0, name: 'Livros' },
      automotivo: { rate: 0, name: 'Automotivo' }
    },
    classico: {
      eletronicos: { rate: 12, name: 'Eletrônicos' },
      celulares: { rate: 12, name: 'Celulares e Acessórios' },
      informatica: { rate: 12, name: 'Informática' },
      moda: { rate: 16, name: 'Moda e Acessórios' },
      calcados: { rate: 16, name: 'Calçados' },
      relogios: { rate: 16, name: 'Relógios' },
      casa: { rate: 13, name: 'Casa e Decoração' },
      moveis: { rate: 13, name: 'Móveis' },
      beleza: { rate: 14, name: 'Beleza e Cuidado Pessoal' },
      esportes: { rate: 14, name: 'Esportes e Fitness' },
      brinquedos: { rate: 14, name: 'Brinquedos' },
      ferramentas: { rate: 13, name: 'Ferramentas' },
      pet: { rate: 14, name: 'Pet Shop' },
      livros: { rate: 12, name: 'Livros' },
      automotivo: { rate: 13, name: 'Automotivo' }
    },
    premium: {
      eletronicos: { rate: 17, name: 'Eletrônicos' },
      celulares: { rate: 17, name: 'Celulares e Acessórios' },
      informatica: { rate: 17, name: 'Informática' },
      moda: { rate: 19, name: 'Moda e Acessórios' },
      calcados: { rate: 19, name: 'Calçados' },
      relogios: { rate: 19, name: 'Relógios' },
      casa: { rate: 18, name: 'Casa e Decoração' },
      moveis: { rate: 18, name: 'Móveis' },
      beleza: { rate: 19, name: 'Beleza e Cuidado Pessoal' },
      esportes: { rate: 19, name: 'Esportes e Fitness' },
      brinquedos: { rate: 19, name: 'Brinquedos' },
      ferramentas: { rate: 18, name: 'Ferramentas' },
      pet: { rate: 19, name: 'Pet Shop' },
      livros: { rate: 17, name: 'Livros' },
      automotivo: { rate: 18, name: 'Automotivo' }
    }
  };

  // Margem recomendada baseada no preço médio
  const getRecommendedMargin = (price: number) => {
    if (price <= 30) return 30;
    if (price <= 50) return 25;
    if (price <= 80) return 22;
    if (price <= 150) return 19;
    return 16;
  };

  const calculations = useMemo(() => {
    const cost = parseFloat(costPrice) || 0;
    if (cost === 0) return null;

    let marketplaceFee = 0;
    let fixedFee = 0;
    let taxDescription = '';
    let adsCostPerSale = 0;

    if (marketplace === 'shopee') {
      const standardCommission = 14; // Base 14% (12% comissão + 2% transação)
      const freeShippingFee = 6;
      const transactionFee = 2; // For display/calculation logic split if needed, but standard is 14% total base
      
      // User requested breakdown: Transaction (2%), Fixed (R$4), Free Shipping (+6%)
      // If we treat 14% as the base "Comissão + Transação", and Free Shipping adds 6%.
      // Let's assume the user considers "Transaction Fee" (2%) as part of the 14%.
      // So Commission = 12%, Transaction = 2%. Total = 14%.
      // If Free Shipping is ON, add 6%. Total = 20%.
      
      const hasFreeShipping = shippingOption === 'with';
      const totalRate = standardCommission + (hasFreeShipping ? freeShippingFee : 0);
      
      marketplaceFee = totalRate;
      fixedFee = cost < 79 ? 4 : 0; // Taxa fixa R$4
      
      taxDescription = hasFreeShipping 
        ? '14% (Comissão) + 6% (Frete Grátis) + R$4' 
        : '12% (Comissão) + 2% (Transação) + R$4';

      // Cálculo de Ads
      if (useShopeeAds) {
        const cpc = parseFloat(adsCPC) || 0;
        const cr = parseFloat(adsConversionRate) || 1.5;
        // Custo por Venda = CPC / (Taxa de Conversão / 100)
        // Ex: R$ 0.50 CPC / 1% CR = R$ 50.00 CPA
        if (cr > 0) {
          adsCostPerSale = cpc / (cr / 100);
        }
      }
    } else {
      const categoryTaxes = mercadoLivreTaxes[adType];
      const tax = categoryTaxes[category];
      marketplaceFee = tax.rate;
      
      // Custo fixo baseado na faixa de preço
      if (cost < 79) {
        if (cost <= 40) {
          fixedFee = 6.00;
        } else if (cost <= 60) {
          fixedFee = 6.50;
        } else {
          fixedFee = 6.75;
        }
      }
      
      taxDescription = adType === 'gratis' 
        ? `0% comissão${fixedFee > 0 ? ' + R$ ' + fixedFee.toFixed(2) : ''}`
        : `${tax.rate}% comissão${fixedFee > 0 ? ' + R$ ' + fixedFee.toFixed(2) : ''}`;
    }

    const recommendedMargin = getRecommendedMargin(cost);
    
    // Cálculo do preço de venda sugerido
    const suggestedPrice = (cost + fixedFee + adsCostPerSale) / (1 - (marketplaceFee + recommendedMargin) / 100);
    
    // Cálculo reverso para verificar
    // Limite de comissão da Shopee é R$ 100 (apenas a parte percentual)
    let calculatedCommission = suggestedPrice * (marketplaceFee / 100);
    if (marketplace === 'shopee' && calculatedCommission > 100) {
       calculatedCommission = 100;
    }

    const marketplaceCost = calculatedCommission;
    const netRevenue = suggestedPrice - marketplaceCost - fixedFee - adsCostPerSale - cost;
    const actualMargin = (netRevenue / suggestedPrice) * 100;

    return {
      cost,
      suggestedPrice: suggestedPrice.toFixed(2),
      marketplaceFee: marketplaceFee.toFixed(0),
      marketplaceCost: marketplaceCost.toFixed(2),
      fixedFee: fixedFee.toFixed(2),
      adsCostPerSale: adsCostPerSale.toFixed(2),
      totalFees: (marketplaceCost + fixedFee + adsCostPerSale).toFixed(2),
      netRevenue: netRevenue.toFixed(2),
      actualMargin: actualMargin.toFixed(1),
      recommendedMargin,
      taxDescription
    };
  }, [costPrice, marketplace, category, shippingOption, adType, useShopeeAds, adsCPC, adsConversionRate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-10 h-10 text-[#fe2c55]" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#fe2c55] to-pink-600 bg-clip-text text-transparent">
              Alob Express
            </h1>
          </div>
          <p className="text-gray-700 text-lg font-medium">Calculadora de Precificação Dropshipping Nacional</p>
          <p className="text-sm text-gray-600 mt-2">Taxas reais atualizadas de Shopee e Mercado Livre 2024</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Painel de Entrada */}
          <Card className="shadow-xl border-gray-100">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold text-gray-800">Dados do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              {/* Preço de Custo */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="costPrice" className="text-sm font-semibold text-gray-800">
                  Preço de Custo do Fornecedor
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    R$
                  </span>
                  <Input
                    id="costPrice"
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="pl-10 text-lg"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Marketplace */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-sm font-semibold text-gray-800">
                  Marketplace
                </Label>
                <Select value={marketplace} onValueChange={setMarketplace}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o marketplace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopee">Shopee</SelectItem>
                    <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Opções específicas por marketplace */}
              {marketplace === 'shopee' && (
                <>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className="text-sm font-semibold text-gray-800">
                      Categoria (Estimativa de CPC)
                    </Label>
                    <Select value={category} onValueChange={handleShopeeCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(shopeeCategories).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      Taxas Shopee
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-600">Taxa de Transação</Label>
                        <div className="relative">
                          <Input 
                            value="2%" 
                            disabled 
                            className="bg-gray-100 text-gray-600 h-9 font-medium" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-gray-600">Taxa Fixa (por item)</Label>
                        <div className="relative">
                          <Input 
                            value="R$ 4,00" 
                            disabled 
                            className="bg-gray-100 text-gray-600 h-9 font-medium" 
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 -mt-2">*com exceções para alguns vendedores</p>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="space-y-0.5">
                        <Label htmlFor="free-shipping" className="text-sm font-medium text-gray-800">
                          Programa de Frete Grátis
                        </Label>
                        <p className="text-xs text-gray-500">Adicional de 6%</p>
                      </div>
                      <Checkbox 
                        id="free-shipping"
                        checked={shippingOption === 'with'}
                        onCheckedChange={(checked) => setShippingOption(checked ? 'with' : 'without')}
                      />
                    </div>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 mt-2">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox 
                        id="useShopeeAds" 
                        checked={useShopeeAds}
                        onCheckedChange={(checked) => setUseShopeeAds(checked as boolean)}
                      />
                      <Label htmlFor="useShopeeAds" className="font-bold text-gray-800 cursor-pointer">
                        Calcular Shopee Ads
                      </Label>
                    </div>

                    {useShopeeAds && (
                      <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                        <div>
                          <Label className="text-xs font-semibold text-gray-700 mb-1">
                            CPC Médio (R$)
                          </Label>
                          <Input
                            type="number"
                            value={adsCPC}
                            onChange={(e) => setAdsCPC(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="0.40"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-700 mb-1">
                            Taxa de Conversão (%)
                          </Label>
                          <Input
                            type="number"
                            value={adsConversionRate}
                            onChange={(e) => setAdsConversionRate(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="1.5"
                            step="0.1"
                          />
                        </div>
                        <div className="col-span-2 text-xs text-gray-500 italic">
                          * Estimativa baseada na categoria selecionada. Ajuste conforme sua campanha.
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {marketplace === 'mercadolivre' && (
                <>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className="text-sm font-semibold text-gray-800">
                      Tipo de Anúncio
                    </Label>
                    <Select value={adType} onValueChange={setAdType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gratis">Grátis (0% - Sem visibilidade)</SelectItem>
                        <SelectItem value="classico">Clássico (10-14% - Visibilidade média)</SelectItem>
                        <SelectItem value="premium">Premium (15-19% - Máxima visibilidade + 12x sem juros)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label className="text-sm font-semibold text-gray-800">
                      Categoria do Produto
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(mercadoLivreTaxes[adType]).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.name} ({value.rate}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Painel de Resultados */}
          <Card className={`${calculations ? 'bg-gradient-to-br from-green-600 to-emerald-600 border-none' : 'bg-gray-500 border-none'} shadow-xl text-white transition-all duration-500`}>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <TrendingUp className="w-6 h-6 text-white" />
              <CardTitle className="text-2xl font-bold text-white">Resultado da Precificação</CardTitle>
            </CardHeader>
            <CardContent>
            {calculations ? (
              <div className="space-y-4">
                {/* Preço de Venda Sugerido */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                  <p className="text-sm text-white/80 mb-1">Preço de Venda Sugerido</p>
                  <p className="text-4xl font-bold">R$ {calculations.suggestedPrice}</p>
                  <p className="text-xs text-white/70 mt-2">{calculations.taxDescription}</p>
                </div>

                {/* Detalhamento */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">Custo do Produto</span>
                    <span className="font-semibold">R$ {calculations.cost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">Taxa Marketplace ({calculations.marketplaceFee}%)</span>
                    <span className="font-semibold text-red-200">- R$ {calculations.marketplaceCost}</span>
                  </div>

                  {parseFloat(calculations.fixedFee) > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-white/80">Taxa Fixa</span>
                      <span className="font-semibold text-red-200">- R$ {calculations.fixedFee}</span>
                    </div>
                  )}

                  {parseFloat(calculations.adsCostPerSale) > 0 && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-white/80">Custo Shopee Ads (Est.)</span>
                        <span className="font-semibold text-red-200">- R$ {calculations.adsCostPerSale}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20 bg-white/5 px-2 rounded">
                        <span className="text-white/80 text-sm">CPA (Custo por Aquisição)</span>
                        <span className="font-semibold text-white">R$ {calculations.adsCostPerSale}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">Total de Taxas e Custos</span>
                    <span className="font-semibold text-red-200">- R$ {calculations.totalFees}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-white/10 rounded-lg px-3 mt-2">
                    <span className="font-semibold">Lucro Líquido</span>
                    <span className="text-2xl font-bold text-green-300">R$ {calculations.netRevenue}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-white/10 rounded-lg px-3">
                    <span className="font-semibold">Margem de Lucro</span>
                    <span className="text-2xl font-bold text-green-300">{calculations.actualMargin}%</span>
                  </div>
                </div>

                {/* Recomendação */}
                <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 mt-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-100 mb-1">Margem Recomendada</p>
                      <p className="text-sm text-yellow-200">
                        Para produtos nesta faixa de preço (R$ {calculations.cost.toFixed(2)}), 
                        recomendamos uma margem de <strong>{calculations.recommendedMargin}%</strong> para 
                        cobrir custos operacionais e garantir lucratividade.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <DollarSign className="w-16 h-16 text-white/30 mb-4" />
                <p className="text-white/70 text-lg">
                  Digite o preço de custo do seu produto para calcular a precificação ideal
                </p>
              </div>
            )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Referência */}
        <Card className="mt-8 shadow-xl border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Package className="w-5 h-5 text-[#fe2c55]" />
              Tabela de Margem Recomendada por Faixa de Preço (Shopee)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-gray-200">
                  <TableHead className="text-gray-800 font-semibold">Preço Médio do Produto</TableHead>
                  <TableHead className="text-center text-gray-800 font-semibold">Taxa Real Shopee</TableHead>
                  <TableHead className="text-center text-gray-800 font-semibold">Margem Recomendada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <TableCell className="text-gray-700">até R$ 30</TableCell>
                  <TableCell className="text-center font-semibold text-[#fe2c55]">20% a 35%</TableCell>
                  <TableCell className="text-center font-bold text-green-600">30%</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <TableCell className="text-gray-700">R$ 30 a 50</TableCell>
                  <TableCell className="text-center font-semibold text-[#fe2c55]">18% a 28%</TableCell>
                  <TableCell className="text-center font-bold text-green-600">25%</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <TableCell className="text-gray-700">R$ 50 a 80</TableCell>
                  <TableCell className="text-center font-semibold text-[#fe2c55]">15% a 23%</TableCell>
                  <TableCell className="text-center font-bold text-green-600">22%</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <TableCell className="text-gray-700">R$ 80 a 150</TableCell>
                  <TableCell className="text-center font-semibold text-[#fe2c55]">14% a 20%</TableCell>
                  <TableCell className="text-center font-bold text-green-600">19%</TableCell>
                </TableRow>
                <TableRow className="hover:bg-pink-50 transition-colors">
                  <TableCell className="text-gray-700">acima de R$ 150</TableCell>
                  <TableCell className="text-center font-semibold text-[#fe2c55]">14% a 18%</TableCell>
                  <TableCell className="text-center font-bold text-green-600">16%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabela de Referência Mercado Livre */}
        <Card className="mt-8 shadow-xl border-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Package className="w-5 h-5 text-yellow-500" />
              Tabela de Margem Recomendada (Mercado Livre)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-gray-200">
                  <TableHead className="text-gray-800 font-semibold">Tipo de Anúncio</TableHead>
                  <TableHead className="text-center text-gray-800 font-semibold">Comissão Média</TableHead>
                  <TableHead className="text-center text-gray-800 font-semibold">Visibilidade</TableHead>
                  <TableHead className="text-center text-gray-800 font-semibold">Margem Sugerida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                  <TableCell className="text-gray-700 font-medium">Clássico</TableCell>
                  <TableCell className="text-center font-semibold text-yellow-600">10% a 14%</TableCell>
                  <TableCell className="text-center text-gray-600">Alta</TableCell>
                  <TableCell className="text-center font-bold text-green-600">20% a 25%</TableCell>
                </TableRow>
                <TableRow className="hover:bg-yellow-50 transition-colors">
                  <TableCell className="text-gray-700 font-medium">Premium</TableCell>
                  <TableCell className="text-center font-semibold text-yellow-600">15% a 19%</TableCell>
                  <TableCell className="text-center text-gray-600">Máxima (+12x sem juros)</TableCell>
                  <TableCell className="text-center font-bold text-green-600">25% a 30%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-6 bg-pink-50 rounded-xl p-5 border border-pink-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#fe2c55]" />
            Informações Importantes sobre os Tipos de Anúncio
          </h4>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-white rounded-lg p-4 border border-pink-100">
              <h5 className="font-bold text-[#fe2c55] mb-2">📦 Anúncio Grátis (Mercado Livre)</h5>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Comissão:</strong> 0% sobre o valor da venda</li>
                <li>• <strong>Custo Fixo:</strong> R$ 6,00 a R$ 6,75 (produtos abaixo de R$ 79)</li>
                <li>• <strong>Visibilidade:</strong> Baixa - produto fica "escondido" nas buscas</li>
                <li>• <strong>Parcelamento:</strong> Não disponível</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-pink-100">
              <h5 className="font-bold text-[#fe2c55] mb-2">🏪 Anúncio Clássico (Mercado Livre)</h5>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Comissão:</strong> 10% a 14% sobre o valor da venda (varia por categoria)</li>
                <li>• <strong>Custo Fixo:</strong> R$ 6,00 a R$ 6,75 (produtos abaixo de R$ 79)</li>
                <li>• <strong>Visibilidade:</strong> Média - aparece nas buscas normalmente</li>
                <li>• <strong>Parcelamento:</strong> Não inclui parcelamento sem juros</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-pink-100">
              <h5 className="font-bold text-[#fe2c55] mb-2">⭐ Anúncio Premium (Mercado Livre)</h5>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Comissão:</strong> 15% a 19% sobre o valor da venda (varia por categoria)</li>
                <li>• <strong>Custo Fixo:</strong> R$ 6,00 a R$ 6,75 (produtos abaixo de R$ 79)</li>
                <li>• <strong>Visibilidade:</strong> Máxima - destaque e prioridade nas buscas</li>
                <li>• <strong>Parcelamento:</strong> Até 12x sem juros para o comprador</li>
                <li>• <strong>Benefício:</strong> Maior conversão de vendas pela visibilidade</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-pink-100">
              <h5 className="font-bold text-[#fe2c55] mb-2">🛍️ Shopee</h5>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Com Frete Grátis:</strong> 20% (14% comissão + 6% frete) + R$ 4 fixo</li>
                <li>• <strong>Sem Frete Grátis:</strong> 14% comissão + R$ 4 fixo</li>
                <li>• <strong>Taxa fixa:</strong> Cobrada por item vendido (produtos abaixo de R$ 79)</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-gray-800 font-semibold mb-2">💡 Dicas Importantes:</p>
              <ul className="space-y-1 ml-4 text-gray-700">
                <li>• O custo fixo varia conforme o preço: R$ 6,00 (até R$ 40), R$ 6,50 (R$ 40-60), R$ 6,75 (R$ 60-79)</li>
                <li>• A margem recomendada já considera custos operacionais e embalagem</li>
                <li>• No Mercado Livre, o Premium tem maior custo mas gera mais vendas pela visibilidade</li>
                <li>• Valores atualizados conforme políticas de 2024 dos marketplaces</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropshippingCalculator;
