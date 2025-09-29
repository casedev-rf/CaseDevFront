'use client'

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectionsView } from "@/components/projections/projections-view";
import { AllocationsView } from "@/components/allocations/allocations-view";
import { HistoryView } from "@/components/history/history-view";

export default function Home() {
  const [activeTab, setActiveTab] = useState("projecao");
  const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null);

  const handleViewInChart = (simulationId: number) => {
    setSelectedSimulationId(simulationId);
    setActiveTab("projecao");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-4">Multi Family Office</h1>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
            <TabsTrigger 
              value="projecao" 
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Projeção</span>
              <span className="sm:hidden">Proj.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="historico" 
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Histórico</span>
              <span className="sm:hidden">Hist.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alocacoes" 
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Alocações</span>
              <span className="sm:hidden">Aloc.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projecao" className="space-y-4 sm:space-y-6">
            <ProjectionsView preSelectedSimulationId={selectedSimulationId} />
          </TabsContent>

          <TabsContent value="historico" className="space-y-4 sm:space-y-6">
            <HistoryView 
              selectedClient="Matheus Silveira" 
              onViewInChart={handleViewInChart}
            />
          </TabsContent>

          <TabsContent value="alocacoes" className="space-y-4 sm:space-y-6">
            <AllocationsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
