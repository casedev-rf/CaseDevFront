'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ProjectionData, Event } from "@/types"

interface TimelineEvent {
  year: number
  type: 'income' | 'expense' | 'milestone'
  label: string
  value?: number
  description?: string
  frequency?: string
}

interface TimelineValue {
  value: number
  label: string
}

interface TimelineProps {
  startYear?: number
  endYear?: number
  events?: Event[]  // Mudança: agora usa Event[] do backend
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
    
    // Incluir anos com eventos reais
    if (events && events.length > 0) {
      const eventYears = events.map(e => new Date(e.startDate).getFullYear())
        .filter(year => year >= startYear && year <= endYear && !years.includes(year))
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
              : valueInMillions >= 0.1
              ? `R$ ${(valueInMillions * 1000).toFixed(0)}K`
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
                : valueInMillions >= 0.1
                ? `R$ ${(valueInMillions * 1000).toFixed(0)}K`
                : formatCurrency(interpolatedValue)
            }
          } else if (beforeData) {
            // Usar o último valor disponível
            const valueInMillions = beforeData.totalPatrimony / 1000000
            values[year] = {
              value: beforeData.totalPatrimony,
              label: valueInMillions >= 1 
                ? `R$ ${valueInMillions.toFixed(1)}M`
                : valueInMillions >= 0.1
                ? `R$ ${(valueInMillions * 1000).toFixed(0)}K`
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

  // Converter eventos do backend para formato da timeline
  const getTimelineEvents = (): TimelineEvent[] => {
    if (events && events.length > 0) {
      return events.map(event => {
        const year = new Date(event.startDate).getFullYear()
        const isIncome = event.type === 'entrada' || event.type === 'herança' || event.type === 'aposentadoria' || event.type === 'comissão'
        
        // Mapear tipos do backend para labels mais amigáveis
        const getEventLabel = (type: string): string => {
          const labelMap: Record<string, string> = {
            'entrada': 'Entrada',
            'saída': 'Saída', 
            'herança': 'Herança',
            'aposentadoria': 'Aposentadoria',
            'comissão': 'Comissão',
            'custo': 'Custo',
            'outros': 'Outros'
          }
          return labelMap[type] || type
        }

        // Formatar descrição baseada na frequência
        const getEventDescription = (value: number, frequency: string): string => {
          const formattedValue = formatCurrency(value)
          switch (frequency) {
            case 'única':
              return formattedValue
            case 'mensal':
              return `${formattedValue}/mês`
            case 'anual':
              return `${formattedValue}/ano`
            default:
              return formattedValue
          }
        }

        return {
          year,
          type: isIncome ? 'income' : 'expense',
          label: getEventLabel(event.type),
          value: event.value,
          description: getEventDescription(event.value, event.frequency),
          frequency: event.frequency
        }
      })
    }
    
    // Fallback: eventos padrão apenas se não houver eventos reais
    return []
  }

  const timelineEvents = getTimelineEvents()

  // Debug específico dos eventos na Timeline
  console.log('📅 TIMELINE EVENTOS DEBUG:', {
    'Eventos originais recebidos': events?.map(e => ({
      tipo: e.type,
      valor: e.value,
      dataInicio: e.startDate,
      ano: new Date(e.startDate).getFullYear(),
      'Está no range?': new Date(e.startDate).getFullYear() >= startYear && new Date(e.startDate).getFullYear() <= endYear
    })),
    'Timeline events processados': timelineEvents.map(e => ({
      year: e.year,
      type: e.type,
      label: e.label,
      description: e.description
    })),
    'Anos da timeline': years,
    'StartYear-EndYear': `${startYear}-${endYear}`,
    'Eventos filtrados por ano': years.map(year => ({
      ano: year,
      eventos: timelineEvents.filter(e => e.year === year).map(e => e.label),
      quantidadeEventos: timelineEvents.filter(e => e.year === year).length
    }))
  })

  // Calcular posição no timeline sem margens laterais
  const getPositionPercent = (year: number) => {
    const totalRange = endYear - startYear
    const yearPosition = year - startYear
    
    // Se é o primeiro ano, posiciona em 5%
    if (year === startYear) return 5
    // Se é o último ano, posiciona em 95%  
    if (year === endYear) return 95
    // Para anos intermediários, distribui entre 5% e 95%
    return 5 + ((yearPosition / totalRange) * 90)
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
        <div className="relative pb-4 overflow-visible">
          {/* Linha principal do timeline */}
          <div className="relative h-24 sm:h-28 mb-4 sm:mb-6 w-full overflow-visible">
            {/* Linha horizontal */}
            <div className="absolute top-10 sm:top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 rounded-full shadow-lg"></div>
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
                  <div className="relative group">
                    {/* Área de hover expandida para o ano */}
                    <div className="text-center max-w-20 cursor-pointer" style={{ marginTop: '30px' }}>
                      <div className="text-sm text-gray-400 mb-1 truncate">
                        {year}
                      </div>
                      {yearValue && (
                        <div className="text-xs text-blue-300 font-bold bg-gray-800/60 px-1 py-1 rounded border border-blue-400/30 truncate">
                          {yearValue.label}
                        </div>
                      )}
                    </div>

                    {/* Tooltip unificado - aparece no hover do ano ou ponto */}
                    {(yearValue || eventsForYear.length > 0) && (
                      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[9999]">
                        <div className="bg-gray-900/95 border border-gray-600 rounded-lg shadow-xl p-3 min-w-48 max-w-72">
                          {yearValue && (
                            <>
                              <div className="text-blue-300 text-sm font-bold mb-1">
                                {year}
                              </div>
                              <div className="text-white text-sm font-semibold">
                                {yearValue.label}
                              </div>
                              <div className="text-gray-400 text-xs mb-2">
                                Patrimônio Total
                              </div>
                            </>
                          )}
                          
                          {/* Mostrar eventos se houver */}
                          {eventsForYear.length > 0 && (
                            <>
                              {yearValue && <div className="border-t border-gray-600 pt-2 mt-2"></div>}
                              <div className="text-white text-xs font-medium mb-2">
                                {eventsForYear.length > 1 ? `${eventsForYear.length} Eventos:` : 'Evento:'}
                              </div>
                              <div className="space-y-1">
                                {eventsForYear.map((event, index) => (
                                  <div key={index} className="flex items-start gap-2 text-xs">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                                      event.type === 'income' ? 'bg-green-400' : 'bg-red-400'
                                    }`}></div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`font-medium ${
                                        event.type === 'income' ? 'text-green-300' : 'text-red-300'
                                      }`}>
                                        {event.label}
                                      </div>
                                      <div className="text-gray-300 text-xs break-words">
                                        {event.description}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                          
                          {/* Setinha do tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-600"></div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )
            })}
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