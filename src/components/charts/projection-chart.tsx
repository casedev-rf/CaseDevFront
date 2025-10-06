'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { ProjectionData } from '@/types'

interface ProjectionChartProps {
  data?: ProjectionData[]
  showComparison?: boolean
  lifeStatus?: 'Vivo' | 'Morto' | 'Inválido'
  activeScenario?: 'original' | 'current' | 'optimized'
}

export function ProjectionChart({ data = [], showComparison = false, lifeStatus = 'Vivo', activeScenario = 'current' }: ProjectionChartProps) {
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value)
  }

  // Dados específicos para cada cenário
  const scenarioData = {
    original: [
      { year: 2024, totalPatrimony: 2679930, financialPatrimony: 1679930, immobilizedPatrimony: 1000000, totalWithoutInsurance: 2479930 },
      { year: 2030, totalPatrimony: 3000000, financialPatrimony: 1900000, immobilizedPatrimony: 1100000, totalWithoutInsurance: 2800000 },
      { year: 2040, totalPatrimony: 4200000, financialPatrimony: 2600000, immobilizedPatrimony: 1600000, totalWithoutInsurance: 3900000 },
      { year: 2050, totalPatrimony: 5500000, financialPatrimony: 3500000, immobilizedPatrimony: 2000000, totalWithoutInsurance: 5100000 },
      { year: 2060, totalPatrimony: 7000000, financialPatrimony: 4500000, immobilizedPatrimony: 2500000, totalWithoutInsurance: 6500000 },
    ],
    current: [
      { year: 2024, totalPatrimony: 2679930, financialPatrimony: 1679930, immobilizedPatrimony: 1000000, totalWithoutInsurance: 2479930 },
      { year: 2030, totalPatrimony: 3200000, financialPatrimony: 2000000, immobilizedPatrimony: 1200000, totalWithoutInsurance: 2900000 },
      { year: 2040, totalPatrimony: 4500000, financialPatrimony: 2800000, immobilizedPatrimony: 1700000, totalWithoutInsurance: 4100000 },
      { year: 2050, totalPatrimony: 6000000, financialPatrimony: 3800000, immobilizedPatrimony: 2200000, totalWithoutInsurance: 5500000 },
      { year: 2060, totalPatrimony: 7500000, financialPatrimony: 4800000, immobilizedPatrimony: 2700000, totalWithoutInsurance: 6900000 },
    ],
    optimized: [
      { year: 2024, totalPatrimony: 2679930, financialPatrimony: 1679930, immobilizedPatrimony: 1000000, totalWithoutInsurance: 2479930 },
      { year: 2030, totalPatrimony: 3500000, financialPatrimony: 2200000, immobilizedPatrimony: 1300000, totalWithoutInsurance: 3200000 },
      { year: 2040, totalPatrimony: 5200000, financialPatrimony: 3200000, immobilizedPatrimony: 2000000, totalWithoutInsurance: 4700000 },
      { year: 2050, totalPatrimony: 7200000, financialPatrimony: 4500000, immobilizedPatrimony: 2700000, totalWithoutInsurance: 6600000 },
      { year: 2060, totalPatrimony: 9500000, financialPatrimony: 6000000, immobilizedPatrimony: 3500000, totalWithoutInsurance: 8800000 },
    ]
  }

  // Debug: Verificar estrutura dos dados do backend
  console.log('📊 ProjectionChart Debug:', {
    data,
    dataLength: data?.length,
    dataType: typeof data,
    firstItem: data?.[0],
    firstItemKeys: data?.[0] ? Object.keys(data[0]) : [],
    activeScenario,
    mockDataLength: scenarioData[activeScenario].length
  })
  
  // Debug: Comparar estrutura backend vs mock
  if (data && data.length > 0) {
    console.log('🔍 Backend Structure:', {
      firstItem: data[0],
      keys: Object.keys(data[0]),
      values: Object.values(data[0]),
      fullObject: JSON.stringify(data[0], null, 2)
    })
    
    console.log('🔍 Mock Structure:', {
      firstItem: scenarioData[activeScenario][0],
      keys: Object.keys(scenarioData[activeScenario][0]),
      values: Object.values(scenarioData[activeScenario][0])
    })
    
    console.log('🔍 First 3 Backend Items:', data.slice(0, 3))
  }

  // Use dados reais do backend ou dados específicos do cenário
  const chartData = data && data.length > 0 ? data : scenarioData[activeScenario]
  
  console.log('📈 ChartData Final:', {
    isUsingBackendData: data && data.length > 0,
    chartDataLength: chartData.length,
    firstChartItem: chartData[0]
  })

  return (
    <div className="w-full h-72 sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="year" 
            stroke="#9CA3AF"
            fontSize={10}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={10}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            labelStyle={{ color: '#1F2937' }}
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '6px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="line"
          />
          
          <Line
            type="monotone"
            dataKey="totalPatrimony"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Patrimônio Total"
            dot={false}
          />
          
          <Line
            type="monotone"
            dataKey="financialPatrimony"
            stroke="#10B981"
            strokeWidth={2}
            name="Patrimônio Financeiro"
            dot={false}
          />
          
          <Line
            type="monotone"
            dataKey="immobilizedPatrimony"
            stroke="#F59E0B"
            strokeWidth={2}
            name="Patrimônio Imobilizado"
            dot={false}
          />
          
          {showComparison && (
            <Line
              type="monotone"
              dataKey="totalWithoutInsurance"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Total sem Seguros"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}