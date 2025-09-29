'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { ProjectionData } from '@/types'

interface ProjectionChartProps {
  data?: ProjectionData[]
  showComparison?: boolean
  lifeStatus?: 'Vivo' | 'Morto' | 'Inválido'
}

export function ProjectionChart({ data = [], showComparison = false, lifeStatus = 'Vivo' }: ProjectionChartProps) {
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value)
  }

  // Use dados reais do backend ou fallback para dados de exemplo
  const sampleData: ProjectionData[] = [
    { year: 2024, totalPatrimony: 2679930, financialPatrimony: 1679930, immobilizedPatrimony: 1000000, totalWithoutInsurance: 2479930 },
    { year: 2030, totalPatrimony: 3200000, financialPatrimony: 2000000, immobilizedPatrimony: 1200000, totalWithoutInsurance: 2900000 },
    { year: 2040, totalPatrimony: 4500000, financialPatrimony: 2800000, immobilizedPatrimony: 1700000, totalWithoutInsurance: 4100000 },
    { year: 2050, totalPatrimony: 6000000, financialPatrimony: 3800000, immobilizedPatrimony: 2200000, totalWithoutInsurance: 5500000 },
    { year: 2060, totalPatrimony: 7500000, financialPatrimony: 4800000, immobilizedPatrimony: 2700000, totalWithoutInsurance: 6900000 },
  ]

  const chartData = data && data.length > 0 ? data : sampleData

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="year" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
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
          <Legend />
          
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