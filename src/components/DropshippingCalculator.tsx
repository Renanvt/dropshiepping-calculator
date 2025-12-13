import { useState, useMemo, useRef } from 'react';
import { Calculator, TrendingUp, Package, DollarSign, AlertCircle, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

import logo from '../imgs/Logonome-alobexpress.png';
import contactBg from '../imgs/contactbg.jpg';
import dollarAnimateReal from '../video/dollar animate real.mp4';

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleSection = ({ title, icon, children, defaultOpen = false, className = "" }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  const toggle = () => {
    const content = contentRef.current;
    const arrow = arrowRef.current;
    
    if (isOpen) {
      gsap.to(content, { height: 0, opacity: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(arrow, { rotation: 0, duration: 0.3, ease: "power2.out" });
    } else {
      gsap.to(content, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(arrow, { rotation: 180, duration: 0.3, ease: "power2.out" });
    }
    setIsOpen(!isOpen);
  };

  return (
    <Card className={`mt-8 shadow-xl border-gray-100 overflow-hidden ${className}`}>
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={toggle}
      >
        <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-800 font-iceland">
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          <ChevronDown 
            ref={arrowRef} 
            className="w-5 h-5 text-gray-500"
            style={{ transform: defaultOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
          />
        </CardTitle>
      </CardHeader>
      <div 
                  ref={contentRef} 
                  className="collapsible-content"
                  style={{ height: defaultOpen ? 'auto' : 0, opacity: defaultOpen ? 1 : 0, overflow: 'hidden' }}
                >
        <CardContent>
          {children}
        </CardContent>
      </div>
    </Card>
  );
};

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

interface Variation {
  id: string;
  name: string;
  cost: string;
  markup: string;
}

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

// Reusable calculation logic
const calculateMetrics = (
    baseCost: number, 
    pkgCost: number,
    markup: number, 
    currentMarketplace: string,
    currentCategory: string,
    currentAdType: string,
    currentShipping: string,
    currentExtraCommission: number,
    currentAds: boolean,
    currentCpc: number,
    currentDailyBudget: number,
    currentSales: number,
    gatewayFeeVal: number,
    manualPriceVal: number,
    competitorPriceVal: number,
    competitorMarkupVal: number,
    tiktokCommVal: number,
    wpShippingVal: number,
    emergencyReserveVal: number,
    returnRateVal: number,
    paidTrafficVal: number
) => {
  // Total Base Cost for Calculation (Product + Packaging + Emergency Reserve)
  // For Wordpress, include shipping cost in the base if defined? Or treat as a fee?
  // User said "adicione Frete com o valor padrão 0" for Wordpress.
  // Usually shipping is a cost. Let's add it to totalCost if marketplace is wordpress.
  // UPDATE: emergencyReserveVal should NOT affect totalCost for pricing.
  const totalCost = baseCost + pkgCost + (currentMarketplace === 'wordpress' ? wpShippingVal : 0);

  let marketplaceFee = 0;
  let fixedFee = 0;
  let taxDescription = '';
  
  // Helper to calculate fees for a given price
  const calculateFees = (currentPrice: number) => {
      let currentFixedFee = 0;
      let currentMarketplaceFee = 0;

      if (currentMarketplace === 'shopee') {
          const standardCommission = 14; 
          const freeShippingFee = 6;
          const hasFreeShipping = currentShipping === 'with';
          const extra = currentExtraCommission;
          currentMarketplaceFee = standardCommission + (hasFreeShipping ? freeShippingFee : 0) + extra;
          currentFixedFee = currentPrice < 8 ? (currentPrice * 0.5) : 4;
      } else if (currentMarketplace === 'tiktok') {
          currentMarketplaceFee = tiktokCommVal;
          currentFixedFee = 0; // Assume 0 fixed fee for Tiktok for now as per instructions
      } else if (currentMarketplace === 'wordpress') {
          currentMarketplaceFee = 0; // No marketplace fee for own site usually, only gateway
          currentFixedFee = 0;
      } else {
          const categoryTaxes = mercadoLivreTaxes[currentAdType];
          const tax = categoryTaxes[currentCategory];
          currentMarketplaceFee = tax.rate;

          if (currentAdType === 'gratis') {
              currentFixedFee = 0;
          } else {
              if (currentPrice < 12.50) {
                  currentFixedFee = currentPrice / 2; // Metade do preço
              } else if (currentPrice < 29) {
                  currentFixedFee = 6.25;
              } else if (currentPrice < 50) {
                  currentFixedFee = 6.50;
              } else if (currentPrice < 79) {
                  currentFixedFee = 6.75;
              } else {
                  currentFixedFee = 0;
              }
          }
      }
      return { fixed: currentFixedFee, rate: currentMarketplaceFee };
  };

  if (currentMarketplace === 'shopee') {
    const standardCommission = 14;
    const freeShippingFee = 6;
    const hasFreeShipping = currentShipping === 'with';
    const extra = currentExtraCommission;
    const totalRate = standardCommission + (hasFreeShipping ? freeShippingFee : 0) + extra;
    marketplaceFee = totalRate;
    
    taxDescription = hasFreeShipping 
      ? `14% (Comissão) + 6% (Frete Grátis)${extra > 0 ? ' + ' + extra + '% (Extra)' : ''} + R$4,00 (Tarifa Fixa Shopee)` 
      : `12% (Comissão) + 2% (Transação)${extra > 0 ? ' + ' + extra + '% (Extra)' : ''} + R$4,00 (Tarifa Fixa Shopee)`;
  } else if (currentMarketplace === 'tiktok') {
      marketplaceFee = tiktokCommVal;
      taxDescription = `${tiktokCommVal}% (Comissão Tiktok Shop)`;
  } else if (currentMarketplace === 'wordpress') {
      marketplaceFee = 0;
      taxDescription = `Venda Direta (Site Próprio)`;
  } else {
    const categoryTaxes = mercadoLivreTaxes[currentAdType];
    const tax = categoryTaxes[currentCategory];
    marketplaceFee = tax.rate;
  }

  const recommendedMargin = getRecommendedMargin(totalCost);
  
  // Calculate Suggested Price
  let suggestedPrice = 0;
  
  // Function to calculate price given parameters
  const calcPrice = (c: number, m: number, feeRate: number, fixed: number, gateway: number) => {
      // Price = (Cost + Fixed) / (1 - (Fee + Margin + Gateway)/100)
      return (c + fixed) / (1 - (feeRate + m + gateway) / 100);
  };

  if (currentMarketplace === 'mercadolivre') {
      // Iterative calculation for ML
      let tempFixed = 0;
      
      // For Gratis, Fixed Fee is always 0
      if (currentAdType === 'gratis') {
          suggestedPrice = calcPrice(totalCost, recommendedMargin, marketplaceFee, 0, gatewayFeeVal);
          fixedFee = 0;
      } else {
          let tempPrice = calcPrice(totalCost, recommendedMargin, marketplaceFee, tempFixed, gatewayFeeVal);
          
          if (tempPrice >= 79) {
              fixedFee = 0;
              suggestedPrice = tempPrice;
          } else {
              tempFixed = 6.75;
              tempPrice = calcPrice(totalCost, recommendedMargin, marketplaceFee, tempFixed, gatewayFeeVal);
              if (tempPrice >= 50 && tempPrice < 79) {
                  fixedFee = 6.75;
                  suggestedPrice = tempPrice;
              } else {
                  tempFixed = 6.50;
                  tempPrice = calcPrice(totalCost, recommendedMargin, marketplaceFee, tempFixed, gatewayFeeVal);
                  if (tempPrice >= 29 && tempPrice < 50) {
                      fixedFee = 6.50;
                      suggestedPrice = tempPrice;
                  } else {
                      tempFixed = 6.25;
                      tempPrice = calcPrice(totalCost, recommendedMargin, marketplaceFee, tempFixed, gatewayFeeVal);
                      if (tempPrice >= 12.50 && tempPrice < 29) {
                          fixedFee = 6.25;
                          suggestedPrice = tempPrice;
                      } else {
                          // Try < 12.50 (Fixed = Price / 2)
                          const denominator = 0.5 - (marketplaceFee + recommendedMargin + gatewayFeeVal) / 100;
                          if (denominator > 0) {
                              suggestedPrice = totalCost / denominator;
                              fixedFee = suggestedPrice / 2;
                          } else {
                              suggestedPrice = totalCost * 2;
                              fixedFee = suggestedPrice / 2;
                          }
                      }
                  }
              }
          }
      }
      
      taxDescription = currentAdType === 'gratis' 
      ? `0% comissão`
      : `${marketplaceFee}% comissão${fixedFee > 0 ? ' + R$ ' + fixedFee.toFixed(2) + ' (Tarifa Fixa Mercado Livre)' : ''}`;
  } else if (currentMarketplace === 'shopee') {
      // Shopee logic with dynamic fixed fee
      const tempPrice = calcPrice(totalCost, recommendedMargin, marketplaceFee, 4, gatewayFeeVal);
      
      if (tempPrice < 8) {
           const denominator = 0.5 - (marketplaceFee + recommendedMargin + gatewayFeeVal) / 100;
           if (denominator > 0) {
               suggestedPrice = totalCost / denominator;
               fixedFee = suggestedPrice * 0.5;
           } else {
               suggestedPrice = tempPrice;
               fixedFee = 4;
           }
      } else {
           suggestedPrice = tempPrice;
           fixedFee = 4;
      }
  } else {
      // Generic logic for Tiktok/Wordpress (Fixed Fee is usually 0 unless specified, here assumed 0 for now)
      suggestedPrice = calcPrice(totalCost, recommendedMargin, marketplaceFee, 0, gatewayFeeVal);
      fixedFee = 0;
  }

  // Override if Markup Multiplier is set
  if (markup > 0) {
      suggestedPrice = totalCost * markup;
      // Recalculate Fixed Fee based on this new price
      const fees = calculateFees(suggestedPrice);
      fixedFee = fees.fixed;

      if (currentMarketplace === 'mercadolivre') {
           taxDescription = currentAdType === 'gratis' 
          ? `0% comissão${fixedFee > 0 ? ' + R$ ' + fixedFee.toFixed(2) + ' (Tarifa Fixa Mercado Livre)' : ''}`
          : `${marketplaceFee}% comissão${fixedFee > 0 ? ' + R$ ' + fixedFee.toFixed(2) + ' (Tarifa Fixa Mercado Livre)' : ''}`;
      }
  } else {
       // Re-verify Fixed Fee for Automatic Markup in ML
       if (currentMarketplace === 'mercadolivre') {
           const fees = calculateFees(suggestedPrice);
           fixedFee = fees.fixed;
           taxDescription = currentAdType === 'gratis' 
          ? `0% comissão${fixedFee > 0 ? ' + R$ ' + fixedFee.toFixed(2) + ' (Tarifa Fixa Mercado Livre)' : ''}`
          : `${marketplaceFee}% comissão${fixedFee > 0 ? ' + R$ ' + fixedFee.toFixed(2) + ' (Tarifa Fixa Mercado Livre)' : ''}`;
       }
  }

  // Calculations based on Final Effective Price (Manual Price takes precedence for Profit Calculation)
  const effectiveSellingPrice = manualPriceVal > 0 ? manualPriceVal : suggestedPrice;

  // Recalculate costs based on Effective Selling Price
  // Note: If manual price is used, fees like Commission and Gateway might change because they are % of price.
  // Fixed fee might also change (e.g. Shopee < R$8 or ML < R$79).
  
  // We need to re-run fee calculation for the effective price
  const finalFees = calculateFees(effectiveSellingPrice);
  const finalFixedFee = finalFees.fixed;
  // Marketplace fee rate is usually constant unless it depends on price (ML < R$79 free shipping? No, that's fixed fee).
  // Actually ML free shipping (which affects cost) depends on price >= 79.
  // But here we simplify: we assume the user selected parameters (like Ad Type) determine the rate.
  // Only Fixed Fee varies significantly by price in our current logic.
  // Wait, for Shopee, if price < 8, fixed fee changes.
  // For ML, fixed fee changes by price range.
  // So using finalFixedFee is correct.

  let calculatedCommission = effectiveSellingPrice * (marketplaceFee / 100);
  if (currentMarketplace === 'shopee' && calculatedCommission > 100) {
     calculatedCommission = 100;
  }

  const gatewayCost = effectiveSellingPrice * (gatewayFeeVal / 100);
  const paidTrafficCost = effectiveSellingPrice * (paidTrafficVal / 100);
  
  // Ads Cost Calculation
  let adsCostPerSale = 0;
  if (currentAds && currentSales > 0 && currentDailyBudget > 0) {
      adsCostPerSale = currentDailyBudget / currentSales;
  }

  const marketplaceCost = calculatedCommission;
  // Net Revenue = Effective Price - Commission - Fixed Fee - Gateway - Total Cost - Ads - Paid Traffic
  const netRevenue = effectiveSellingPrice - marketplaceCost - finalFixedFee - gatewayCost - totalCost - adsCostPerSale - paidTrafficCost;
  const actualMargin = (netRevenue / effectiveSellingPrice) * 100;
  
  // Breakeven Analysis for Ads
  const breakevenCPA = netRevenue + adsCostPerSale; // Maximum we can spend on ads to break even (profit before ads)
  
  // Conversion Rate Reverse Calculation
  // Clicks = Daily Budget / CPC
  // CR = (Sales / Clicks) * 100
  let reverseCR = 0;
  if (currentCpc > 0 && currentDailyBudget > 0 && currentSales > 0) {
      const clicks = currentDailyBudget / currentCpc;
      reverseCR = (currentSales / clicks) * 100;
  }

  // Manual Selling Price Logic (Discount display)
  const discountApplied = manualPriceVal > 0 ? suggestedPrice - manualPriceVal : 0;
  
  // Recommended Value
  const effectiveMarkup = competitorMarkupVal > 0 ? competitorMarkupVal : 1.1;
  const recommendedValue = competitorPriceVal * effectiveMarkup;

  // Helper to determine status based on margin
  // Returns: 'negative', 'low', 'good', 'excellent'
  let marginStatus = 'good';
  if (netRevenue < 0) {
      marginStatus = 'negative';
  } else if (actualMargin < (recommendedMargin - 0.5)) { // Add tolerance for floating point/rounding
      marginStatus = 'low';
  } else if (actualMargin > (recommendedMargin + 0.5)) { // Add tolerance
      marginStatus = 'excellent';
  }
  // 'good' matches recommended approximately (+/- 0.5%)

  return {
    cost: baseCost,
    packagingCost: pkgCost.toFixed(2),
    emergencyReserve: emergencyReserveVal.toFixed(2),
    totalCost,
    suggestedPrice: suggestedPrice.toFixed(2),
    marketplaceFee: marketplaceFee.toFixed(0),
    marketplaceCost: marketplaceCost.toFixed(2),
    fixedFee: finalFixedFee.toFixed(2), // Use finalFixedFee based on effective price
    gatewayCost: gatewayCost.toFixed(2),
    gatewayFee: gatewayFeeVal,
    paidTrafficCost: paidTrafficCost.toFixed(2),
    paidTrafficFee: paidTrafficVal,
    adsCostPerSale: adsCostPerSale.toFixed(2),
    // totalFees does NOT include emergencyReserveVal anymore for calculation, but maybe for display?
    // User said "Reserva de emergência não deve alterar e nem calcular nada em resultados de precificação".
    // So I remove it from totalFees too.
    totalFees: (marketplaceCost + finalFixedFee + gatewayCost + paidTrafficCost + adsCostPerSale + pkgCost + (currentMarketplace === 'wordpress' ? wpShippingVal : 0)).toFixed(2),
    netRevenue: netRevenue.toFixed(2),
    actualMargin: actualMargin.toFixed(1),
    recommendedMargin,
    taxDescription,
    manualPrice: manualPriceVal,
    discountApplied: discountApplied, // Keep as number for logic
    recommendedValue: recommendedValue.toFixed(2),
    competitor: competitorPriceVal,
    breakevenCPA: breakevenCPA.toFixed(2),
    reverseCR: reverseCR.toFixed(2),
    marginStatus, // Include status for UI coloring
    returnRate: returnRateVal,
    lossPerReturn: (totalCost + adsCostPerSale).toFixed(2) // Estimated Loss = Cost + Pkg + Ads? Or just Total Cost. Using Total Cost + Ads is safer.
  };
};

const DropshippingCalculator = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".animate-on-scroll", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, { scope: container });

  const [productName, setProductName] = useState('');
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [variationName, setVariationName] = useState('');
  const [variationCost, setVariationCost] = useState('');
  const [variationMarkup, setVariationMarkup] = useState('');

  const [costPrice, setCostPrice] = useState('');
  const [manualSellingPrice, setManualSellingPrice] = useState('');
  const [packagingCost, setPackagingCost] = useState('2'); // Default 2
  const [gatewayFee, setGatewayFee] = useState('5'); // Default 5
  
  const [markupMultiplier, setMarkupMultiplier] = useState('1.5');
  const [extraCommission, setExtraCommission] = useState('');
  
  const [marketplace, setMarketplace] = useState('mercadolivre');
  const [tiktokCommission, setTiktokCommission] = useState('6');
  const [wordpressShipping, setWordpressShipping] = useState('0');
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [competitorMarkup, setCompetitorMarkup] = useState('1.10');
  
  const [category, setCategory] = useState('eletronicos');
  const [shippingOption, setShippingOption] = useState('with'); // Para Shopee
  const [adType, setAdType] = useState('classico'); // Para Mercado Livre
  const [hasReputation, setHasReputation] = useState(false);
  
  // New States for Mode and Logic
  const [operationMode, setOperationMode] = useState('armazem_alob'); // 'armazem_alob' | 'dropshipping'
  const [deliveryMode, setDeliveryMode] = useState('mercado_envios'); // 'tiktok' | 'shopee_envios' | 'mercado_envios' | 'aliexpress'
  const [emergencyReserve, setEmergencyReserve] = useState('');
  const [workingCapital, setWorkingCapital] = useState('');
  const [returnRate, setReturnRate] = useState('33.33'); // Default 33.33%
  const [paidTraffic, setPaidTraffic] = useState('0'); // New Paid Traffic State

  // Payment Gateway Configuration
  const [gatewayBank, setGatewayBank] = useState('mercadopago'); // 'mercadopago' | 'nubank'
  const [gatewayMethod, setGatewayMethod] = useState('pix'); // 'pix' | 'credit' | 'debit' | 'credit_sight' | 'pix_credit'
  const [gatewayInstallments, setGatewayInstallments] = useState('1');

  // Helper for Delivery Mode
  const getDeliveryModeForMarketplace = (mkt: string) => {
    switch (mkt) {
      case 'mercadolivre': return 'mercado_envios';
      case 'shopee': return 'shopee_envios';
      case 'wordpress': return 'aliexpress';
      case 'tiktok': return 'tiktok';
      default: return 'shopee_envios';
    }
  };

  const handleOperationModeChange = (mode: string) => {
    setOperationMode(mode);
    if (mode === 'armazem_alob') {
      setDeliveryMode(getDeliveryModeForMarketplace(marketplace));
    }
  };

  const handleMarketplaceChange = (mkt: string) => {
    setMarketplace(mkt);
    if (operationMode === 'armazem_alob') {
      setDeliveryMode(getDeliveryModeForMarketplace(mkt));
    }
  };

  // Helper for Gateway Fee
  const calculateGatewayFee = (bank: string, method: string, installmentsStr: string) => {
    let fee = 0;
    const installments = parseInt(installmentsStr) || 1;

    if (bank === 'mercadopago') {
      switch (method) {
        case 'pix': fee = 0.49; break;
        case 'credit': fee = 4.99; break;
        case 'debit': fee = 1.99; break;
        default: fee = 4.99;
      }
    } else if (bank === 'nubank') {
      switch (method) {
        case 'pix': fee = 0.49; break;
        case 'pix_credit': fee = 1.99; break;
        case 'credit_sight': fee = 3.09; break;
        case 'credit': fee = 5.79 + (installments > 1 ? (installments - 1) * 1 : 0); break;
        case 'debit': fee = 0.89; break;
        default: fee = 0;
      }
    }
    return fee;
  };

  const handleGatewayBankChange = (bank: string) => {
    setGatewayBank(bank);
    const defaultMethod = 'pix';
    setGatewayMethod(defaultMethod);
    setGatewayFee(calculateGatewayFee(bank, defaultMethod, gatewayInstallments).toString());
  };

  const handleGatewayMethodChange = (method: string) => {
    setGatewayMethod(method);
    setGatewayFee(calculateGatewayFee(gatewayBank, method, gatewayInstallments).toString());
  };

  const handleGatewayInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGatewayInstallments(val);
    setGatewayFee(calculateGatewayFee(gatewayBank, gatewayMethod, val).toString());
  };

  const [useShopeeAds, setUseShopeeAds] = useState(false);
  const [adsCPC, setAdsCPC] = useState('');
  const [dailyBudget, setDailyBudget] = useState('10');
  const [salesQuantity, setSalesQuantity] = useState('');

  const handleShopeeAdsChange = (checked: boolean) => {
      setUseShopeeAds(checked);
      if (checked) {
          if (!adsCPC) setAdsCPC('0.40');
          if (!salesQuantity) setSalesQuantity('10');
      }
  };



  // Handler para mudança de categoria Shopee
  const handleShopeeCategoryChange = (cat: string) => {
    setCategory(cat);
    const catData = shopeeCategories[cat];
    if (catData) {
       setAdsCPC(catData.avgCPC.toString());
       // setAdsConversionRate(catData.avgCR.toString()); // Removed CR auto-set
    }
  };



  const addVariation = () => {
    // If no variation markup provided, use main markup multiplier as default
    const effectiveMarkup = variationMarkup || markupMultiplier;
    
    if (variationName && variationCost && effectiveMarkup) {
      setVariations([...variations, {
        id: Date.now().toString(),
        name: variationName,
        cost: variationCost,
        markup: effectiveMarkup
      }]);
      setVariationName('');
      setVariationCost('');
      setVariationMarkup('');
    }
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
  };



  const calculations = useMemo(() => {
    const cost = parseFloat(costPrice) || 0;
    const pkg = parseFloat(packagingCost) || 0;
    if (cost === 0 && !hasVariations) return null;

    const markupMult = parseFloat(markupMultiplier);
    const extra = parseFloat(extraCommission) || 0;
    const cpc = parseFloat(adsCPC) || 0;
    const budget = parseFloat(dailyBudget) || 10;
    const sales = parseFloat(salesQuantity) || 0;
    const gateway = parseFloat(gatewayFee) || 0;
    const manual = parseFloat(manualSellingPrice) || 0;
    const competitor = parseFloat(competitorPrice) || 0;
    const compMarkup = parseFloat(competitorMarkup) || 1.1;
    const tiktokComm = parseFloat(tiktokCommission) || 6;
    const wpShipping = parseFloat(wordpressShipping) || 0;
    const emergency = operationMode === 'dropshipping' ? (parseFloat(emergencyReserve) || 0) : 0;
    const rRate = parseFloat(returnRate) || 33.33;
    const pTraffic = parseFloat(paidTraffic) || 0;

    return calculateMetrics(
        cost, pkg, markupMult, marketplace, category, adType, shippingOption, extra, useShopeeAds, cpc, budget, sales, gateway, manual, competitor, compMarkup, tiktokComm, wpShipping, emergency, rRate, pTraffic
    );
  }, [costPrice, packagingCost, marketplace, category, shippingOption, adType, useShopeeAds, adsCPC, dailyBudget, salesQuantity, gatewayFee, markupMultiplier, manualSellingPrice, competitorPrice, competitorMarkup, hasVariations, extraCommission, tiktokCommission, wordpressShipping, operationMode, emergencyReserve, returnRate, paidTraffic]);

  // Calculate variations if any
  const variationCalculations = useMemo(() => {
      if (!hasVariations || variations.length === 0) return [];
      
      const pkg = parseFloat(packagingCost) || 0;
      const extra = parseFloat(extraCommission) || 0;
      const cpc = parseFloat(adsCPC) || 0;
      const budget = parseFloat(dailyBudget) || 10;
      const sales = parseFloat(salesQuantity) || 0;
      const gateway = parseFloat(gatewayFee) || 0;
      const competitor = parseFloat(competitorPrice) || 0;
      const compMarkup = parseFloat(competitorMarkup) || 1.1;
      const tiktokComm = parseFloat(tiktokCommission) || 6;
      const wpShipping = parseFloat(wordpressShipping) || 0;
      const emergency = operationMode === 'dropshipping' ? (parseFloat(emergencyReserve) || 0) : 0;
      const rRate = parseFloat(returnRate) || 33.33;
      const pTraffic = parseFloat(paidTraffic) || 0;

      return variations.map(v => {
          const vCost = parseFloat(v.cost) || 0;
          const vMarkup = parseFloat(v.markup) || 1.5; 
          
          return {
              ...v,
              metrics: calculateMetrics(
                  vCost, pkg, vMarkup, marketplace, category, adType, shippingOption, extra, useShopeeAds, cpc, budget, sales, gateway, 0, competitor, compMarkup, tiktokComm, wpShipping, emergency, rRate, pTraffic
              )
          };
      });
  }, [variations, packagingCost, marketplace, category, shippingOption, adType, extraCommission, useShopeeAds, adsCPC, dailyBudget, salesQuantity, gatewayFee, competitorPrice, competitorMarkup, hasVariations, tiktokCommission, wordpressShipping, operationMode, emergencyReserve, returnRate, paidTraffic]);

  useGSAP(() => {
    // Animate Header
    gsap.from(".header-animate", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    // Animate Main Cards and Sections
    gsap.from(".animate-on-scroll", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.2,
      clearProps: "all"
    });

    // Animate Form Elements with Fade In
    gsap.from(".animate-fadeIn", {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5,
        clearProps: "all"
    });
  }, { scope: container });

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans" ref={container}>
      {/* Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
         <video 
            autoPlay 
            loop 
            muted 
             playsInline
             className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          >
             <source src={dollarAnimateReal} type="video/mp4" />
          </video>
       </div>

      <div className="relative z-10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-4 items-center mb-8 header-animate">
          <div className="flex justify-center md:justify-start">
             <img 
                src={logo} 
                alt="Alob Express" 
                className="h-12 object-contain glitch-hover cursor-pointer" 
                onClick={() => window.location.reload()} 
             />
          </div>
          <div className="text-center md:text-right">
             <p className="text-gray-300 text-xl font-medium font-iceland">Calculadora de Precificação Dropshipping Nacional</p>
             <p className="text-sm text-gray-400 mt-1">Taxas reais atualizadas de Marketplaces 2025</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Painel de Entrada */}
          <Card className="shadow-xl border-gray-100 animate-on-scroll">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold text-gray-800 font-iceland">Dados do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              {/* Nome do Produto */}
              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label htmlFor="productName" className="text-sm font-semibold text-gray-800">
                  Nome do Produto
                </Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Fone Bluetooth"
                />
              </div>

              {/* Modalidade */}
              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label className="text-sm font-semibold text-gray-800">
                  Modalidade
                </Label>
                <Select value={operationMode} onValueChange={handleOperationModeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="armazem_alob">Armazém Alob</SelectItem>
                    <SelectItem value="dropshipping">Dropshipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Chance de Devolução */}
              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label htmlFor="returnRate" className="text-sm font-semibold text-gray-800">
                  Chance de devolução (%)
                </Label>
                <div className="relative">
                  <Input
                    id="returnRate"
                    type="number"
                    value={returnRate}
                    onChange={(e) => setReturnRate(e.target.value)}
                    className="pl-3"
                    placeholder="33.33"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Campos Condicionais da Modalidade */}
              {operationMode === 'armazem_alob' && (
                <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                  <Label className="text-sm font-semibold text-gray-800">
                    Modalidade de entrega
                  </Label>
                  <Select 
                    value={deliveryMode} 
                    disabled={true}
                  >
                    <SelectTrigger className="bg-gray-100 text-gray-500 cursor-not-allowed">
                      <SelectValue placeholder="Selecione a entrega" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiktok">Tiktokshop</SelectItem>
                      <SelectItem value="shopee_envios">Shopee Envios</SelectItem>
                      <SelectItem value="mercado_envios">Mercado Envios</SelectItem>
                      <SelectItem value="aliexpress">AliExpress Standard Ship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {operationMode === 'dropshipping' && (
                 <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                    <Label htmlFor="emergencyReserve" className="text-sm font-semibold text-gray-800">
                      Reserva de emergência (R$)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                        R$
                      </span>
                      <Input
                        id="emergencyReserve"
                        type="number"
                        value={emergencyReserve}
                        onChange={(e) => setEmergencyReserve(e.target.value)}
                        className="pl-10"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                 </div>
              )}

              {/* Preço de Custo */}
              {operationMode === 'dropshipping' && (
                 <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="workingCapital" className="text-sm font-semibold text-gray-800">
                        Capital de Giro
                      </Label>
                      <div className="group relative">
                        <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          Valor necessário disponível para compra do produto após venda
                          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                        R$
                      </span>
                      <Input
                        id="workingCapital"
                        type="number"
                        value={workingCapital}
                        onChange={(e) => setWorkingCapital(e.target.value)}
                        className="pl-10"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                 </div>
              )}

              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label htmlFor="costPrice" className="text-base font-bold text-[#fe2c55]">
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
                    className="pl-10 text-xl font-bold border-[#fe2c55] focus:border-[#fe2c55]"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Preço de Venda Manual */}
              <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                <Label htmlFor="manualSellingPrice" className="text-base font-bold text-blue-700">
                  Preço de venda
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    R$
                  </span>
                  <Input
                    id="manualSellingPrice"
                    type="number"
                    value={manualSellingPrice}
                    onChange={(e) => setManualSellingPrice(e.target.value)}
                    className="pl-10 text-xl border-blue-400 focus:border-blue-600 font-bold"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Markup */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-sm font-semibold text-gray-800">
                  Markup
                </Label>
                <Select value={markupMultiplier} onValueChange={setMarkupMultiplier}>
                  <SelectTrigger id="markupMultiplier">
                    <SelectValue placeholder="Selecione o markup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 (Automático / Margem Recomendada)</SelectItem>
                    <SelectItem value="1">1.0x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="1.75">1.75x</SelectItem>
                    <SelectItem value="2">2.0x</SelectItem>
                    <SelectItem value="3">3.0x</SelectItem>
                    <SelectItem value="4">4.0x</SelectItem>
                    <SelectItem value="5">5.0x</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-gray-500">Define o preço sugerido multiplicando o custo.</p>
              </div>

              {/* Variações Checkbox */}
              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Checkbox 
                  id="hasVariations" 
                  checked={hasVariations}
                  onCheckedChange={(checked) => setHasVariations(checked as boolean)}
                />
                <Label htmlFor="hasVariations" className="font-bold text-gray-800 cursor-pointer">
                  É produto com variação?
                </Label>
              </div>

              {/* Área de Variações */}
              {hasVariations && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-3 gap-2">
                    <Input 
                      placeholder="Variação (ex: P)" 
                      value={variationName}
                      onChange={(e) => setVariationName(e.target.value)}
                      className="text-xs"
                    />
                    <Input 
                      type="number" 
                      placeholder="Custo (R$)" 
                      value={variationCost}
                      onChange={(e) => setVariationCost(e.target.value)}
                      className="text-xs"
                    />
                    <Input 
                      type="number" 
                      placeholder="Markup" 
                      value={variationMarkup}
                      onChange={(e) => setVariationMarkup(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <Button onClick={addVariation} size="sm" className="w-full bg-[#d91c42] hover:bg-[#b91536]">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Variação
                  </Button>

                  {variations.length > 0 && (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="h-8 text-xs">Variação</TableHead>
                            <TableHead className="h-8 text-xs">Custo</TableHead>
                            <TableHead className="h-8 text-xs">Markup</TableHead>
                            <TableHead className="h-8 text-xs w-8"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variations.map((v) => (
                            <TableRow key={v.id}>
                              <TableCell className="py-2 text-xs font-medium">{v.name}</TableCell>
                              <TableCell className="py-2 text-xs">R$ {v.cost}</TableCell>
                              <TableCell className="py-2 text-xs">{v.markup}</TableCell>
                              <TableCell className="py-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-red-500 hover:text-red-700"
                                  onClick={() => removeVariation(v.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}

              {/* Marketplace */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-sm font-semibold text-gray-800">
                  Marketplace
                </Label>
                <Select value={marketplace} onValueChange={handleMarketplaceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o marketplace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
                    <SelectItem value="shopee">Shopee</SelectItem>
                    <SelectItem value="tiktok">Tiktok Shop</SelectItem>
                    <SelectItem value="wordpress">Wordpress (Site)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preço Mínimo Concorrente */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="competitorPrice" className="text-sm font-semibold text-gray-800">
                  Preço Mínimo Concorrente ({
                    marketplace === 'shopee' ? 'Shopee' : 
                    marketplace === 'mercadolivre' ? 'Mercado Livre' : 
                    marketplace === 'tiktok' ? 'Tiktok Shop' : 'Marketplaces'
                  })
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    R$
                  </span>
                  <Input
                    id="competitorPrice"
                    type="number"
                    value={competitorPrice}
                    onChange={(e) => setCompetitorPrice(e.target.value)}
                    className="pl-10 text-lg border-orange-200"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Configuração de Gateway de Pagamento */}
              <div className="grid w-full max-w-sm gap-2 animate-fadeIn bg-gray-50 p-3 rounded-lg border border-gray-200">
                 <Label className="text-sm font-semibold text-gray-800">
                   Configuração de Pagamento
                 </Label>
                 
                 <div className="flex gap-2">
                    <Button 
                      variant={gatewayBank === 'mercadopago' ? "default" : "outline"}
                      className={`flex-1 text-xs ${gatewayBank === 'mercadopago' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                      onClick={() => handleGatewayBankChange('mercadopago')}
                    >
                      Mercado Pago
                    </Button>
                    <Button 
                      variant={gatewayBank === 'nubank' ? "default" : "outline"}
                      className={`flex-1 text-xs ${gatewayBank === 'nubank' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      onClick={() => handleGatewayBankChange('nubank')}
                    >
                      Nubank
                    </Button>
                 </div>

                 <div className="grid grid-cols-2 gap-2 mt-2">
                    {gatewayBank === 'mercadopago' ? (
                       <>
                          <Button 
                             variant={gatewayMethod === 'pix' ? "secondary" : "ghost"}
                             className={`text-xs justify-start h-8 ${gatewayMethod === 'pix' ? 'bg-blue-100 text-blue-800' : ''}`}
                             onClick={() => handleGatewayMethodChange('pix')}
                          >
                             💠 PIX (0.49%)
                          </Button>
                          <Button 
                             variant={gatewayMethod === 'credit' ? "secondary" : "ghost"}
                             className={`text-xs justify-start h-8 ${gatewayMethod === 'credit' ? 'bg-blue-100 text-blue-800' : ''}`}
                             onClick={() => handleGatewayMethodChange('credit')}
                          >
                             💳 Crédito (4.99%)
                          </Button>
                          <Button 
                             variant={gatewayMethod === 'debit' ? "secondary" : "ghost"}
                             className={`text-xs justify-start h-8 ${gatewayMethod === 'debit' ? 'bg-blue-100 text-blue-800' : ''}`}
                             onClick={() => handleGatewayMethodChange('debit')}
                          >
                             💳 Débito (1.99%)
                          </Button>
                       </>
                    ) : (
                       <>
                          <Button 
                             variant={gatewayMethod === 'pix' ? "secondary" : "ghost"}
                             className={`text-xs justify-start h-8 ${gatewayMethod === 'pix' ? 'bg-purple-100 text-purple-800' : ''}`}
                             onClick={() => handleGatewayMethodChange('pix')}
                          >
                             💠 PIX (0.49%)
                          </Button>
                          <Button 
                             variant={gatewayMethod === 'credit_sight' ? "secondary" : "ghost"}
                             className={`text-xs justify-start h-8 ${gatewayMethod === 'credit_sight' ? 'bg-purple-100 text-purple-800' : ''}`}
                             onClick={() => handleGatewayMethodChange('credit_sight')}
                          >
                             💳 Crédito à Vista (3.09%)
                          </Button>
                           <Button 
                             variant={gatewayMethod === 'credit' ? "secondary" : "ghost"}
                             className={`text-xs justify-start h-8 ${gatewayMethod === 'credit' ? 'bg-purple-100 text-purple-800' : ''}`}
                             onClick={() => handleGatewayMethodChange('credit')}
                          >
                             💳 Crédito Parc.
                          </Button>
                          <Button 
                             variant={gatewayMethod === 'debit' ? "secondary" : "ghost"}
                             className={`text-xs justify-start h-8 ${gatewayMethod === 'debit' ? 'bg-purple-100 text-purple-800' : ''}`}
                             onClick={() => handleGatewayMethodChange('debit')}
                          >
                             💳 Débito (0.89%)
                          </Button>
                           <Button 
                             variant={gatewayMethod === 'pix_credit' ? "secondary" : "ghost"}
                             className={`text-xs justify-start h-8 ${gatewayMethod === 'pix_credit' ? 'bg-purple-100 text-purple-800' : ''}`}
                             onClick={() => handleGatewayMethodChange('pix_credit')}
                          >
                             💠 Pix no Crédito (1.99%)
                          </Button>
                       </>
                    )}
                 </div>

                 {gatewayMethod === 'credit' && gatewayBank === 'nubank' && (
                    <div className="mt-2 animate-fadeIn">
                       <Label className="text-xs">Parcelas (1-12)</Label>
                       <Input 
                          type="number" 
                          min="1" 
                          max="12" 
                          value={gatewayInstallments}
                          onChange={handleGatewayInstallmentsChange}
                          className="h-8 mt-1"
                       />
                       <p className="text-[10px] text-gray-500">Taxa aumenta com parcelas</p>
                    </div>
                 )}
              </div>

              {/* Taxa de Gateway (Display/Manual Override) */}
               <div className="grid w-full max-w-sm items-center gap-1.5">
                 <Label htmlFor="gatewayFee" className="text-sm font-semibold text-gray-800">
                   Taxa de Gateway de Pagamento (%)
                 </Label>
                 <div className="relative">
                   <Input
                     id="gatewayFee"
                     type="number"
                     value={gatewayFee}
                     onChange={(e) => setGatewayFee(e.target.value)}
                     placeholder="0.00"
                     className="bg-gray-50"
                   />
                 </div>
               </div>

               {/* Tráfego Pago */}
               <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                 <Label htmlFor="paidTraffic" className="text-sm font-semibold text-gray-800">
                   Tráfego Pago (%)
                 </Label>
                 <div className="relative">
                   <Input
                     id="paidTraffic"
                     type="number"
                     value={paidTraffic}
                     onChange={(e) => setPaidTraffic(e.target.value)}
                     placeholder="0.00"
                   />
                 </div>
               </div>

              {/* Custos Extras */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="packagingCost" className="text-sm font-semibold text-gray-800">
                  Custos embalagem + impressão + Transporte
                </Label>
                <div className="relative">
                   <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                   <Input
                    id="packagingCost"
                    type="number"
                    className="pl-8"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(e.target.value)}
                    placeholder="0.00"
                   />
                </div>
              </div>

              {/* Taxa de Gateway */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="gatewayFee" className="text-sm font-semibold text-gray-800">
                  Taxa de Gateway de Pagamento (%)
                </Label>
                <div className="relative">
                   <Input
                    id="gatewayFee"
                    type="number"
                    value={gatewayFee}
                    onChange={(e) => setGatewayFee(e.target.value)}
                    placeholder="Ex: 4.99"
                   />
                </div>
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
                            value="R$ 4,00 (Tarifa Fixa)" 
                            disabled 
                            className="bg-gray-100 text-gray-600 h-9 font-medium" 
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-2 space-y-1.5">
                         <Label className="text-xs text-gray-600">Comissões Extras (%)</Label>
                         <Input 
                            type="number"
                            value={extraCommission}
                            onChange={(e) => setExtraCommission(e.target.value)}
                            placeholder="0"
                            className="h-9 font-medium" 
                          />
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
                        onCheckedChange={(checked) => handleShopeeAdsChange(checked as boolean)}
                      />
                      <Label htmlFor="useShopeeAds" className="font-bold text-gray-800 cursor-pointer">
                        Calcular Shopee Ads
                      </Label>
                    </div>

                    {useShopeeAds && (
                      <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                        <div>
                          <Label htmlFor="adsCPC" className="text-xs font-semibold text-gray-700 mb-1">
                            CPC Médio (R$)
                          </Label>
                          <Input
                            id="adsCPC"
                            type="number"
                            value={adsCPC}
                            onChange={(e) => setAdsCPC(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="0.40"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dailyBudget" className="text-xs font-semibold text-gray-700 mb-1">
                            Orçamento Diário (R$)
                          </Label>
                          <Input
                            id="dailyBudget"
                            type="number"
                            value={dailyBudget}
                            onChange={(e) => setDailyBudget(e.target.value)}
                            className={`h-8 text-sm ${parseFloat(dailyBudget) < 10 ? 'border-red-500' : ''}`}
                            placeholder="10.00"
                            step="1"
                          />
                        </div>
                        {parseFloat(dailyBudget) < 10 && (
                            <div className="col-span-2 text-xs text-red-500 font-bold">
                                * Mínimo de R$ 10,00
                            </div>
                        )}
                        <div className="col-span-2">
                           <Label htmlFor="salesQuantity" className="text-xs font-semibold text-gray-700 mb-1">
                            Quantidade de Vendas (Para Cálculo de CR)
                          </Label>
                           <Input
                            id="salesQuantity"
                            type="number"
                            value={salesQuantity}
                            onChange={(e) => setSalesQuantity(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 text-[10px] text-gray-500 space-y-2 border-t pt-2 mt-2">
                           <p><strong>ROI (Retorno sobre Investimento):</strong></p>
                           <ul className="list-disc pl-4 space-y-1">
                                <li>1 - 3: Baixo/Arriscado</li>
                                <li>4 - 6: Bom</li>
                                <li>7+: Excelente</li>
                           </ul>
                           <p><strong>ACOS (Custo de Venda):</strong></p>
                           <ul className="list-disc pl-4 space-y-1">
                                <li>15% - 30%: Excelente</li>
                                <li>30% - 50%: Moderado</li>
                                <li>50%+: Alto</li>
                           </ul>
                        </div>
                        {calculations && parseFloat(calculations.reverseCR) > 0 && (
                            <div className="col-span-2 bg-blue-50 p-2 rounded text-center border border-blue-100 mt-2">
                                <p className="text-xs text-blue-800 font-semibold">Taxa de Conversão Estimada</p>
                                <p className="text-xl font-bold text-blue-600">{calculations.reverseCR}%</p>
                            </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {marketplace === 'mercadolivre' && (
                <>
                  <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4">
                    <Checkbox 
                      id="hasReputation" 
                      checked={hasReputation}
                      onCheckedChange={(checked) => setHasReputation(checked as boolean)}
                    />
                    <div className="space-y-0.5">
                        <Label htmlFor="hasReputation" className="font-bold text-gray-800 cursor-pointer">
                        Tenho Reputação no Mercado Livre
                        </Label>
                        {hasReputation ? (
                            <p className="text-[10px] text-green-600">Benefícios: Maior visibilidade, menor custo de frete (envios), confiança do comprador</p>
                        ) : (
                            <p className="text-[10px] text-gray-500">Sem reputação: Menor exposição, frete mais caro para o vendedor, limitações de envios</p>
                        )}
                    </div>
                  </div>

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
                        <SelectItem value="classico">Clássico (11.5% a 14.5% + taxa fixa)</SelectItem>
                        <SelectItem value="premium">Premium (16.5% a 19.5% + taxa fixa)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-gray-500 mt-1">
                        Modalidades: Clássico (Visibilidade média) | Premium (Máxima visibilidade + 12x sem juros)
                    </p>
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
                  
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-2">
                     <p className="text-xs text-yellow-800 font-semibold mb-2">Prazos de Recebimento:</p>
                     <ul className="text-[10px] text-yellow-700 space-y-1 mb-3">
                        <li>• <strong>Sem Reputação / Iniciante:</strong> 10 a 28 dias após a entrega</li>
                        <li>• <strong>Líder / Gold / Platinum:</strong> 5 dias após a entrega (ou na hora com Mercado Pago)</li>
                     </ul>

                     <p className="text-xs text-yellow-800 font-semibold mb-2">Regras de Custo Fixo (Atualizado):</p>
                     <ul className="text-[10px] text-yellow-700 space-y-1">
                        <li>• &lt; R$ 12,50: Metade do preço de venda</li>
                        <li>• R$ 12,50 - R$ 29: R$ 6,25</li>
                        <li>• R$ 29 - R$ 50: R$ 6,50</li>
                        <li>• R$ 50 - R$ 79: R$ 6,75</li>
                        <li>• &gt; R$ 79: Isento de taxa fixa</li>
                     </ul>
                  </div>
                </>
              )}

              {marketplace === 'tiktok' && (
                <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                   <Label htmlFor="tiktokCommission" className="text-sm font-semibold text-gray-800">
                     Taxa de Comissão Tiktok (%)
                   </Label>
                   <div className="relative">
                      <Input
                       id="tiktokCommission"
                       type="number"
                       value={tiktokCommission}
                       onChange={(e) => setTiktokCommission(e.target.value)}
                       placeholder="Ex: 6"
                      />
                   </div>
                </div>
              )}

              {marketplace === 'wordpress' && (
                <div className="grid w-full max-w-sm items-center gap-1.5 animate-fadeIn">
                   <Label htmlFor="wordpressShipping" className="text-sm font-semibold text-gray-800">
                     Frete (R$)
                   </Label>
                   <div className="relative">
                      <Input
                       id="wordpressShipping"
                       type="number"
                       value={wordpressShipping}
                       onChange={(e) => setWordpressShipping(e.target.value)}
                       placeholder="Ex: 0"
                      />
                   </div>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Painel de Resultados */}
          <Card className={`${calculations ? 'bg-[#d91c42] border-none' : 'bg-gray-500 border-none'} shadow-xl text-white transition-all duration-500 relative overflow-hidden animate-on-scroll`}>
            <div className="absolute inset-0 z-0">
                <img src={contactBg} alt="Background" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative z-10">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <TrendingUp className="w-6 h-6 text-white" />
              <CardTitle className="text-2xl font-bold text-white font-iceland">Resultado da Precificação</CardTitle>
            </CardHeader>
            <CardContent>
            {calculations ? (
              <div className="space-y-4">
                {/* Preço de Venda Sugerido */}
                <div className={`
                    rounded-xl p-5 border shadow-sm transition-colors duration-300 animate-on-scroll
                    ${calculations.marginStatus === 'negative' ? 'bg-red-600 border-red-500' : 
                      calculations.marginStatus === 'low' ? 'bg-yellow-400 border-yellow-500' :
                      calculations.marginStatus === 'excellent' ? 'bg-[#25f4ee] border-[#20d8d2]' :
                      'bg-[#DCFCE7] border-green-200' // good/default
                    }
                `}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <p className={`text-sm mb-1 font-iceland font-bold ${
                                calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                            }`}>Preço de Venda Sugerido</p>
                            
                            {productName && (
                                <p className={`text-lg font-semibold mb-1 ${
                                    calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                                }`}>{productName}</p>
                            )}
                            
                            <p className={`text-5xl font-bold ${
                                calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                            }`}>R$ {calculations.suggestedPrice}</p>
                            
                            <p className={`text-xs mt-2 font-medium ${
                                calculations.marginStatus === 'negative' ? 'text-white/90' : 'text-black/80'
                            }`}>{calculations.taxDescription}</p>
                        </div>
                        {calculations.manualPrice > 0 && (
                             <div className="text-left md:text-right">
                                <p className={`text-sm mb-1 font-bold ${
                                    calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                                }`}>Seu Preço</p>
                                <p className={`text-3xl font-bold ${
                                    calculations.marginStatus === 'negative' ? 'text-yellow-300' : 'text-black'
                                }`}>R$ {calculations.manualPrice.toFixed(2)}</p>
                             </div>
                        )}
                    </div>
                    
                    {calculations.manualPrice > 0 && (
                        <div className={`mt-4 pt-4 border-t flex flex-col md:flex-row justify-between items-center gap-2 ${
                            calculations.marginStatus === 'negative' ? 'border-white/20' : 'border-black/10'
                        }`}>
                            <div>
                                <p className={`text-xs font-bold ${
                                    calculations.marginStatus === 'negative' ? 'text-white/90' : 'text-black/70'
                                }`}>
                                    {calculations.discountApplied >= 0 ? 'Desconto Aplicado' : 'Acréscimo Aplicado'}
                                </p>
                                <p className={`font-bold ${
                                    calculations.marginStatus === 'negative' 
                                        ? (calculations.discountApplied < 0 ? 'text-green-300' : 'text-white')
                                        : (calculations.discountApplied < 0 ? 'text-green-700' : 'text-black')
                                }`}>
                                    R$ {Math.abs(calculations.discountApplied).toFixed(2)}
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className={`text-xs font-bold ${
                                    calculations.marginStatus === 'negative' ? 'text-white/90' : 'text-black/70'
                                }`}>
                                    Valor Recomendado {
                                        marketplace === 'shopee' ? 'Shopee' : 
                                        marketplace === 'mercadolivre' ? 'Mercado Livre' :
                                        marketplace === 'tiktok' ? 'Tiktok Shop' : 'Site'
                                    }
                                </p>
                                <p className={`font-bold text-lg ${
                                    calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                                }`}>R$ {calculations.recommendedValue}</p>
                            </div>
                        </div>
                    )}
                    
                    {calculations.competitor > 0 && !calculations.manualPrice && (
                        <div className={`mt-4 pt-4 border-t ${
                            calculations.marginStatus === 'negative' ? 'border-white/20' : 'border-black/10'
                        }`}>
                             <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                                <div className="text-left">
                                    <p className={`text-xs font-bold ${
                                        calculations.marginStatus === 'negative' ? 'text-white/90' : 'text-black/70'
                                    }`}>
                                        Valor Recomendado {
                                            marketplace === 'shopee' ? 'Shopee' : 
                                            marketplace === 'mercadolivre' ? 'Mercado Livre' :
                                            marketplace === 'tiktok' ? 'Tiktok Shop' : 'Site'
                                        }
                                    </p>
                                    <p className={`font-bold text-lg ${
                                        calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                                    }`}>R$ {calculations.recommendedValue}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Label htmlFor="competitorMarkup" className={`text-xs font-bold ${
                                         calculations.marginStatus === 'negative' ? 'text-white/90' : 'text-black/70'
                                     }`}>Markup Concorrência:</Label>
                                     <div className="flex items-center gap-2">
                                         <Input 
                                            id="competitorMarkup"
                                            type="number" 
                                            value={competitorMarkup} 
                                            onChange={(e) => setCompetitorMarkup(e.target.value)} 
                                            step="0.01" 
                                            min="1.10" 
                                            max="1.25"
                                            className={`h-8 w-20 text-xs bg-transparent border font-bold ${
                                                calculations.marginStatus === 'negative' ? 'border-white/30 text-white placeholder-white/50' : 'border-black/20 text-black placeholder-black/50'
                                            }`}
                                         />
                                         <span className={`text-xs font-bold ${
                                             calculations.marginStatus === 'negative' ? 'text-white/90' : 'text-black/70'
                                         }`}>x</span>
                                     </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Resultado das Variações */}
                {variationCalculations.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
                      {variationCalculations.map((v) => (
                           <Card key={v.id} className="bg-gradient-to-br from-blue-600 to-indigo-600 border-none shadow-xl text-white">
                              <CardHeader className="pb-2">
                                  <CardTitle className="text-xl font-bold">{v.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                      <p className="text-sm text-white/80 mb-1">Preço de Venda Sugerido</p>
                                      <p className="text-3xl font-bold">R$ {v.metrics.suggestedPrice}</p>
                                      <p className="text-xs text-white/70 mt-2">{v.metrics.taxDescription}</p>
                                  </div>
                                  <div className="mt-4 space-y-2 text-sm">
                                      <div className="flex justify-between py-1 font-bold">
                                          <span>Lucro Líquido</span>
                                          <span className="text-green-300">R$ {v.metrics.netRevenue}</span>
                                      </div>
                                      <div className="flex justify-between py-1 font-bold">
                                          <span>Margem</span>
                                          <span className="text-green-300">{v.metrics.actualMargin}%</span>
                                      </div>
                                  </div>
                              </CardContent>
                           </Card>
                      ))}
                  </div>
                )}

                {/* Detalhamento */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">Custos Embalagem</span>
                    <span className="font-semibold text-red-200">
                        {parseFloat(calculations.packagingCost) > 0 
                            ? `- R$ ${calculations.packagingCost}` 
                            : `R$ ${calculations.packagingCost}`
                        }
                    </span>
                  </div>

                  {marketplace === 'wordpress' && parseFloat(wordpressShipping) > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-white/80">Frete (Wordpress)</span>
                      <span className="font-semibold text-red-200">- R$ {wordpressShipping}</span>
                    </div>
                  )}
                  
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

                  <div className={`flex justify-between items-center py-4 rounded-lg px-4 mt-2 border shadow-lg animate-on-scroll ${
                     calculations.marginStatus === 'negative' ? 'bg-red-600 border-red-500' :
                     calculations.marginStatus === 'excellent' ? 'bg-[#25f4ee] border-[#20d8d2]' :
                     'bg-[#DCFCE7] border-green-200'
                   }`}>
                     <span className={`font-bold font-iceland text-xl ${
                         calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                     }`}>Lucro Líquido</span>
                     <span className={`text-4xl font-bold ${
                         calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                     }`}>R$ {calculations.netRevenue}</span>
                   </div>

                   <div className={`flex justify-between items-center py-4 rounded-lg px-4 border shadow-lg animate-on-scroll ${
                     calculations.marginStatus === 'negative' ? 'bg-red-600 border-red-500' :
                     calculations.marginStatus === 'excellent' ? 'bg-[#25f4ee] border-[#20d8d2]' :
                     'bg-[#DCFCE7] border-green-200'
                   }`}>
                     <span className={`font-bold font-iceland text-xl ${
                         calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                     }`}>Margem de Lucro</span>
                     <span className={`text-4xl font-bold ${
                         calculations.marginStatus === 'negative' ? 'text-white' : 'text-black'
                     }`}>{calculations.actualMargin}%</span>
                   </div>
                </div>

                {/* Recomendação */}
                <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 mt-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white mb-1">Margem Recomendada</p>
                      <p className="text-sm text-white/90">
                        Para produtos nesta faixa de preço (R$ {calculations.totalCost.toFixed(2)}), 
                        recomendamos uma margem de <strong>{calculations.recommendedMargin}%</strong> para cobrir custos operacionais e garantir lucratividade.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Tabela de Lucro por Unidade */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm mt-4 text-gray-800">
                    <div className="bg-green-600 p-2 text-center">
                        <p className="text-white font-bold">Projeção de Lucro</p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-green-100 hover:bg-green-100 border-b border-green-200">
                                <TableHead className="text-center font-bold text-green-800 h-8">Unidades Vendidas</TableHead>
                                <TableHead className="text-center font-bold text-green-800 h-8">Lucro Estimado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[10, 25, 50, 100, 250, 500, 1000].map((qty) => (
                                <TableRow key={qty} className="hover:bg-green-50 border-b border-gray-100 last:border-0">
                                    <TableCell className="text-center py-2 font-medium">
                                        <span className="font-bold">{qty}</span>
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-bold text-green-700">
                                        R$ {(parseFloat(calculations.netRevenue) * qty).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Tabela de Perdas Estimadas */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm mt-4 text-gray-800">
                    <div className="bg-red-600 p-2 text-center">
                        <p className="text-white font-bold">Projeção de Perdas</p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-red-100 hover:bg-red-100 border-b border-red-200">
                                <TableHead className="text-center font-bold text-red-800 h-8">Unidades Devolvidas</TableHead>
                                <TableHead className="text-center font-bold text-red-800 h-8">Perdas Estimadas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[10, 25, 50, 100, 250, 500, 1000].map((qty) => {
                                // Calculate returned units based on return rate
                                const returnedUnits = Math.round(qty * (calculations.returnRate / 100));
                                // Calculate loss: returned units * loss per return
                                const totalLoss = returnedUnits * parseFloat(calculations.lossPerReturn);
                                
                                return (
                                <TableRow key={qty} className="hover:bg-red-50 border-b border-gray-100 last:border-0">
                                    <TableCell className="text-center py-2 font-medium">
                                        <span className="font-bold">{returnedUnits}</span>
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-bold text-red-700">
                                        - R$ {totalLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                    {parseFloat(calculations.emergencyReserve) > 0 && (
                        <div className="p-3 bg-red-50 border-t border-red-100 text-center text-xs text-red-800">
                            <span className="font-bold">Reserva de Emergência Disponível (Total):</span> R$ {(parseFloat(calculations.emergencyReserve) * 50).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (para 50 unidades)
                        </div>
                    )}
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
            </div>
          </Card>
        </div>

        {/* Resultados das Variações */}
        {variations.length > 0 && (
          <Card className="mt-8 shadow-xl bg-black/40 backdrop-blur-md border-white/20 animate-on-scroll">
            <CardHeader>
              <CardTitle className="text-xl font-oxanium text-white/90">Resultados das Variações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white font-bold">Variação</TableHead>
                    <TableHead className="text-center text-white font-bold">Custo Total</TableHead>
                    <TableHead className="text-center text-white font-bold">Preço Sugerido</TableHead>
                    <TableHead className="text-center text-white font-bold">Lucro Líquido</TableHead>
                    <TableHead className="text-center text-white font-bold">Margem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variations.map((v) => {
                    const metrics = calculateMetrics(
                      parseFloat(v.cost),
                      parseFloat(packagingCost) || 0,
                      parseFloat(v.markup),
                      marketplace,
                      category,
                      adType,
                      shippingOption,
                      parseFloat(extraCommission) || 0,
                      useShopeeAds,
                      parseFloat(adsCPC) || 0,
                      parseFloat(dailyBudget) || 10,
                      parseFloat(salesQuantity) || 0,
                      parseFloat(gatewayFee) || 0,
                      0, // Manual Price 0 to force calculation
                      parseFloat(competitorPrice) || 0,
                      parseFloat(competitorMarkup) || 1.10,
                      parseFloat(tiktokCommission) || 0,
                      parseFloat(wordpressShipping) || 0,
                      operationMode === 'dropshipping' ? (parseFloat(emergencyReserve) || 0) : 0
                    );
                    
                    return (
                      <TableRow key={v.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">{v.name}</TableCell>
                        <TableCell className="text-center text-white">R$ {metrics.totalCost.toFixed(2)}</TableCell>
                        <TableCell className="text-center text-white">R$ {metrics.suggestedPrice}</TableCell>
                        <TableCell className={`text-center font-bold ${
                          metrics.marginStatus === 'negative' ? 'text-red-400' : 
                          metrics.marginStatus === 'excellent' ? 'text-[#25f4ee]' : 'text-green-400'
                        }`}>
                          R$ {metrics.netProfit}
                        </TableCell>
                        <TableCell className={`text-center font-bold ${
                           metrics.marginStatus === 'negative' ? 'text-red-400' : 
                           metrics.marginStatus === 'excellent' ? 'text-[#25f4ee]' : 'text-blue-300'
                        }`}>
                          {metrics.actualMargin}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Referência */}
        <CollapsibleSection 
          title="Tabela de Margem Recomendada por Faixa de Preço (Shopee)" 
          icon={<Package className="w-5 h-5 text-[#fe2c55]" />}
          className="animate-on-scroll"
        >
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
        </CollapsibleSection>

        {/* Tabela de Referência Mercado Livre */}
        <CollapsibleSection 
          title="Tabela de Margem Recomendada (Mercado Livre)" 
          icon={<Package className="w-5 h-5 text-yellow-500" />}
          className="animate-on-scroll"
        >
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
        </CollapsibleSection>

        {/* Informações Adicionais */}
        <CollapsibleSection 
          title="Informações Importantes sobre os Tipos de Anúncio" 
          icon={<AlertCircle className="w-5 h-5 text-[#fe2c55]" />}
          className="bg-pink-50 border-pink-200 animate-on-scroll"
        >
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
                <li>• <strong>Com Frete Grátis:</strong> 14% comissão + 6% frete + R$ 4 fixo*</li>
                <li>• <strong>Sem Frete Grátis:</strong> 12% comissão + 2% transação + R$ 4 fixo*</li>
                <li>• <strong>*Produtos abaixo de R$ 8:</strong> Taxa fixa é 50% do valor do item (não R$ 4)</li>
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
        </CollapsibleSection>
      </div>
      </div>
    </div>
  );
};

export default DropshippingCalculator;
