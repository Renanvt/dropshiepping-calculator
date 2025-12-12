import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Package, DollarSign, AlertCircle } from 'lucide-react';

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

    if (marketplace === 'shopee') {
      const tax = shippingOption === 'with' 
        ? shopeeTaxes.withFreeShipping 
        : shopeeTaxes.withoutFreeShipping;
      
      marketplaceFee = tax.base;
      fixedFee = cost < 79 ? tax.fixed : 0;
      taxDescription = tax.description;
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
    const suggestedPrice = cost / (1 - (marketplaceFee + recommendedMargin) / 100) + fixedFee;
    
    // Cálculo reverso para verificar
    const marketplaceCost = (suggestedPrice - fixedFee) * (marketplaceFee / 100);
    const netRevenue = suggestedPrice - marketplaceCost - fixedFee - cost;
    const actualMargin = (netRevenue / suggestedPrice) * 100;

    return {
      cost,
      suggestedPrice: suggestedPrice.toFixed(2),
      marketplaceFee: marketplaceFee.toFixed(0),
      marketplaceCost: marketplaceCost.toFixed(2),
      fixedFee: fixedFee.toFixed(2),
      totalFees: (marketplaceCost + fixedFee).toFixed(2),
      netRevenue: netRevenue.toFixed(2),
      actualMargin: actualMargin.toFixed(1),
      recommendedMargin,
      taxDescription
    };
  }, [costPrice, marketplace, category, shippingOption, adType]);

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
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Dados do Produto</h2>
            </div>

            <div className="space-y-5">
              {/* Preço de Custo */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Preço de Custo do Fornecedor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-semibold">
                    R$
                  </span>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#fe2c55] focus:ring-2 focus:ring-pink-200 transition-all text-lg text-gray-800"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Marketplace */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Marketplace
                </label>
                <select
                  value={marketplace}
                  onChange={(e) => setMarketplace(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#fe2c55] focus:ring-2 focus:ring-pink-200 transition-all text-lg text-gray-800"
                >
                  <option value="shopee">Shopee</option>
                  <option value="mercadolivre">Mercado Livre</option>
                </select>
              </div>

              {/* Opções específicas por marketplace */}
              {marketplace === 'shopee' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Programa de Frete
                  </label>
                  <select
                    value={shippingOption}
                    onChange={(e) => setShippingOption(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#fe2c55] focus:ring-2 focus:ring-pink-200 transition-all text-gray-800"
                  >
                    <option value="with">Com Frete Grátis (20% + R$4)</option>
                    <option value="without">Sem Frete Grátis (14% + R$4)</option>
                  </select>
                </div>
              )}

              {marketplace === 'mercadolivre' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Tipo de Anúncio
                    </label>
                    <select
                      value={adType}
                      onChange={(e) => setAdType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#fe2c55] focus:ring-2 focus:ring-pink-200 transition-all text-gray-800"
                    >
                      <option value="gratis">Grátis (0% - Sem visibilidade)</option>
                      <option value="classico">Clássico (10-14% - Visibilidade média)</option>
                      <option value="premium">Premium (15-19% - Máxima visibilidade + 12x sem juros)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Categoria do Produto
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#fe2c55] focus:ring-2 focus:ring-pink-200 transition-all text-gray-800"
                    >
                      {Object.entries(mercadoLivreTaxes[adType]).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name} ({value.rate}%)
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Painel de Resultados */}
          <div className="bg-gradient-to-br from-[#fe2c55] to-pink-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Resultado da Precificação</h2>
            </div>

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

                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">Total de Taxas</span>
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
          </div>
        </div>

        {/* Tabela de Referência */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#fe2c55]" />
            Tabela de Margem Recomendada por Faixa de Preço
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-800 font-semibold">Preço Médio do Produto</th>
                  <th className="text-center py-3 px-4 text-gray-800 font-semibold">Taxa Real {marketplace === 'shopee' ? 'Shopee' : 'Mercado Livre'}</th>
                  <th className="text-center py-3 px-4 text-gray-800 font-semibold">Margem Recomendada</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">até R$ 30</td>
                  <td className="text-center py-3 px-4 font-semibold text-[#fe2c55]">
                    {marketplace === 'shopee' ? '20% a 35%' : adType === 'gratis' ? '0%' : adType === 'classico' ? '10% a 14%' : '15% a 19%'}
                  </td>
                  <td className="text-center py-3 px-4 font-bold text-green-600">30%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">R$ 30 a 50</td>
                  <td className="text-center py-3 px-4 font-semibold text-[#fe2c55]">
                    {marketplace === 'shopee' ? '18% a 28%' : adType === 'gratis' ? '0%' : adType === 'classico' ? '10% a 14%' : '15% a 19%'}
                  </td>
                  <td className="text-center py-3 px-4 font-bold text-green-600">25%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">R$ 50 a 80</td>
                  <td className="text-center py-3 px-4 font-semibold text-[#fe2c55]">
                    {marketplace === 'shopee' ? '15% a 23%' : adType === 'gratis' ? '0%' : adType === 'classico' ? '10% a 14%' : '15% a 19%'}
                  </td>
                  <td className="text-center py-3 px-4 font-bold text-green-600">22%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">R$ 80 a 150</td>
                  <td className="text-center py-3 px-4 font-semibold text-[#fe2c55]">
                    {marketplace === 'shopee' ? '14% a 20%' : adType === 'gratis' ? '0%' : adType === 'classico' ? '10% a 14%' : '15% a 19%'}
                  </td>
                  <td className="text-center py-3 px-4 font-bold text-green-600">19%</td>
                </tr>
                <tr className="hover:bg-pink-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">acima de R$ 150</td>
                  <td className="text-center py-3 px-4 font-semibold text-[#fe2c55]">
                    {marketplace === 'shopee' ? '14% a 18%' : adType === 'gratis' ? '0%' : adType === 'classico' ? '10% a 14%' : '15% a 19%'}
                  </td>
                  <td className="text-center py-3 px-4 font-bold text-green-600">16%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
