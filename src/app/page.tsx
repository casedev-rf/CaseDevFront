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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold mb-4">Multi Family Office</h1>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="projecao">Projeção</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="alocacoes">Alocações</TabsTrigger>
          </TabsList>

          <TabsContent value="projecao" className="space-y-6">
            <ProjectionsView />
          </TabsContent>

          <TabsContent value="historico" className="space-y-6">
            <HistoryView selectedClient="Matheus Silveira" />
          </TabsContent>

          <TabsContent value="alocacoes" className="space-y-6">
            <AllocationsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
