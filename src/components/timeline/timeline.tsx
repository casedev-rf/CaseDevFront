'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ProjectionData } from "@/types"

interface TimelineEvent {
  year: number
  type: 'income' | 'expense' | 'milestone'
  label: string
  value?: number
  description?: string
}

interface TimelineValue {
  value: number
  label: string
}

interface TimelineProps {
  startYear?: number
  endYear?: number
  events?: TimelineEvent[]
  projectionData?: ProjectionData[]
  lifeStatus?: 'Vivo' | 'Morto' | 'Inválido'
}

export function Timeline({ 
  startYear = 2025, 
  endYear = 2060, 
  events = [], 
  projectionData = [],
  lifeStatus = 'Vivo'
}: TimelineProps) {
  // Gerar anos do timeline - marcos principais a cada 5 anos
  const getTimelineYears = (): number[] => {
    const years: number[] = []
    
    // Marcos principais a cada 5 anos
    for (let year = startYear; year <= endYear; year += 5) {
      years.push(year)
    }
    
    // Se temos dados reais, incluir anos com eventos importantes
    if (projectionData && projectionData.length > 0) {
      const eventYears = events.map(e => e.year).filter(year => 
        year >= startYear && year <= endYear && !years.includes(year)
      )
      years.push(...eventYears)
      years.sort((a, b) => a - b)
    }
    
    return years
  }

  const years = getTimelineYears()

  // Converter dados de projeção para valores do timeline
  const getTimelineValues = (): Record<number, TimelineValue> => {
    const values: Record<number, TimelineValue> = {}
    
    if (projectionData && projectionData.length > 0) {
      // Criar um mapa dos dados por ano para acesso rápido
      const dataByYear = new Map(projectionData.map(data => [data.year, data]))
      
      // Para cada ano do timeline, buscar o valor correspondente ou interpolar
      years.forEach(year => {
        const exactData = dataByYear.get(year)
        
        if (exactData) {
          // Temos dados exatos para este ano
          const valueInMillions = exactData.totalPatrimony / 1000000
          values[year] = {
            value: exactData.totalPatrimony,
            label: valueInMillions >= 1 
              ? `R$ ${valueInMillions.toFixed(1)}M`
              : formatCurrency(exactData.totalPatrimony)
          }
        } else {
          // Interpolar entre os dados disponíveis
          const beforeData = projectionData.filter(d => d.year < year).pop()
          const afterData = projectionData.find(d => d.year > year)
          
          if (beforeData && afterData) {
            // Interpolação linear
            const ratio = (year - beforeData.year) / (afterData.year - beforeData.year)
            const interpolatedValue = beforeData.totalPatrimony + 
              (afterData.totalPatrimony - beforeData.totalPatrimony) * ratio
            
            const valueInMillions = interpolatedValue / 1000000
            values[year] = {
              value: interpolatedValue,
              label: valueInMillions >= 1 
                ? `R$ ${valueInMillions.toFixed(1)}M`
                : formatCurrency(interpolatedValue)
            }
          } else if (beforeData) {
            // Usar o último valor disponível
            const valueInMillions = beforeData.totalPatrimony / 1000000
            values[year] = {
              value: beforeData.totalPatrimony,
              label: valueInMillions >= 1 
                ? `R$ ${valueInMillions.toFixed(1)}M`
                : formatCurrency(beforeData.totalPatrimony)
            }
          }
        }
      })
    } else {
      // Fallback com dados de exemplo (baseado no Figma)
      const fallbackValues = {
        2025: { value: 0, label: 'Início' },
        2030: { value: 3200000, label: 'R$ 3,2M' },
        2035: { value: 4500000, label: 'R$ 4,5M' },
        2040: { value: 6000000, label: 'R$ 6,0M' },
        2045: { value: 7500000, label: 'R$ 7,5M' },
        2050: { value: 9000000, label: 'R$ 9,0M' },
        2055: { value: 10500000, label: 'R$ 10,5M' },
        2060: { value: 12000000, label: 'R$ 12,0M' },
      }
      
      years.forEach(year => {
        if (fallbackValues[year as keyof typeof fallbackValues]) {
          values[year] = fallbackValues[year as keyof typeof fallbackValues]
        }
      })
    }
    
    return values
  }

  const timelineValues = getTimelineValues()

  // Eventos específicos baseados nos dados ou fallback
  const getTimelineEvents = (): TimelineEvent[] => {
    if (events.length > 0) {
      return events
    }
    
    // Eventos padrão baseados no status de vida
    const defaultEvents: TimelineEvent[] = [
      { year: 2025, type: 'income', label: 'CLT', value: 15000, description: 'R$ 15.000' },
    ]
    
    // Adicionar aposentadoria baseada no status
    if (lifeStatus === 'Vivo') {
      defaultEvents.push({ 
        year: 2055, 
        type: 'income', 
        label: 'Aposentadoria', 
        value: 25000, 
        description: 'R$ 25.000' 
      })
    }
    
    return defaultEvents
  }

  const timelineEvents = getTimelineEvents()

  // Calcular posição no timeline
  const getPositionPercent = (year: number) => {
    return ((year - startYear) / (endYear - startYear)) * 100
  }

  // Filtrar eventos para o ano específico
  const getEventsForYear = (year: number) => {
    return timelineEvents.filter(event => event.year === year)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          {/* Linha principal do timeline */}
          <div className="relative h-20 sm:h-24 mb-4 sm:mb-6 min-w-[600px] sm:min-w-0">
            {/* Linha horizontal */}
            <div className="absolute top-10 sm:top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 via-orange-400 to-red-400"></div>
            
            {/* Marcadores de anos */}
            {years.map((year) => {
              const yearValue = timelineValues[year]
              const eventsForYear = getEventsForYear(year)
              
              return (
                <div
                  key={year}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${getPositionPercent(year)}%` }}
                >
                  {/* Valores patrimoniais acima da linha */}
                  {yearValue && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-center text-blue-400 font-medium">
                        {yearValue.label}
                      </div>
                    </div>
                  )}
                  
                  {/* Ponto no timeline */}
                  <div className="relative">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full border-2 border-background absolute top-8 sm:top-10 left-1/2 transform -translate-x-1/2"></div>
                    
                    {/* Ano */}
                    <div className="text-xs text-center text-muted-foreground whitespace-nowrap" style={{ marginTop: '50px' }}>
                      {year}
                    </div>
                    
                    {/* Eventos específicos (CLT, Aposentadoria) */}
                    {eventsForYear.map((event, index) => (
                      <div key={index} className="absolute top-12 sm:top-16 left-1/2 transform -translate-x-1/2">
                        <div className="text-center">
                          <div className={`text-xs font-medium whitespace-nowrap ${event.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                            {event.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legenda de eventos principais */}
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mt-6 sm:mt-8">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
              <span className="text-green-400">CLT R$ 15.000</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
              <span>Aposentadoria R$ 25.000</span>
            </div>
          </div>

          {/* Linha de anos detalhada */}
          <div className="text-xs text-muted-foreground mt-3 sm:mt-4 hidden sm:block">
            <span>Anos: </span>
            {years.map((year, index) => (
              <span key={year}>
                {year}
                {index < years.length - 1 && ' - '}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}