import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import type { PassengerSignal, BusEstimate, ScenarioType, ProcessingPhase } from '../types';
import { simulationTick, resetSimulation } from '../engine/simulation';
import { computeBusEstimate } from '../engine/crowdConsensus';

export type EngineMode = 'LOCAL' | 'BACKEND';

interface SimContextValue {
  signals: PassengerSignal[];
  busEstimate: BusEstimate | null;
  isRunning: boolean;
  isPaused: boolean;
  scenario: ScenarioType;
  processingPhase: ProcessingPhase;
  demoStep: number;
  engineMode: EngineMode;
  setEngineMode: (mode: EngineMode) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSim: () => void;
  setScenario: (s: ScenarioType) => void;
}

const SimContext = createContext<SimContextValue | null>(null);

export function useSimulation() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}

const DEMO_PHASES: ProcessingPhase[] = [
  'COLLECTING',
  'SPEED_ANALYSIS',
  'DIRECTION_ANALYSIS',
  'ROUTE_ADHERENCE',
  'CONTINUITY_CHECK',
  'STOP_BEHAVIOR',
  'SCORING',
  'FILTERING',
  'CLUSTERING',
  'CONSENSUS',
  'ESTIMATING',
  'ETA',
  'COMPLETE',
];

const TICK_MS = 1500; // Update interval
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [signals, setSignals] = useState<PassengerSignal[]>([]);
  const [busEstimate, setBusEstimate] = useState<BusEstimate | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [scenario, setScenarioState] = useState<ScenarioType>('NORMAL');
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('IDLE');
  const [demoStep, setDemoStep] = useState(0);
  const [engineMode, setEngineMode] = useState<EngineMode>('BACKEND');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickCountRef = useRef(0);

  const tickLocal = useCallback((sc: ScenarioType) => {
    tickCountRef.current += 1;
    const newSignals = simulationTick(sc);
    setSignals(newSignals);
    const estimate = computeBusEstimate(newSignals);
    setBusEstimate(estimate);

    const phaseIndex = Math.min(tickCountRef.current - 1, DEMO_PHASES.length - 1);
    setProcessingPhase(DEMO_PHASES[phaseIndex]);
    setDemoStep(phaseIndex);
  }, []);

  const fetchBackendData = useCallback(async () => {
    try {
      const [sigRes, busRes] = await Promise.all([
        fetch(`${API_URL}/api/signals`),
        fetch(`${API_URL}/api/bus/route-104`)
      ]);
      if (sigRes.ok) {
        const sigData = await sigRes.json();
        setSignals(sigData.signals || []);
      }
      if (busRes.ok) {
        const busData = await busRes.json();
        setBusEstimate(busData);
      }
      
      tickCountRef.current += 1;
      const phaseIndex = Math.min(tickCountRef.current - 1, DEMO_PHASES.length - 1);
      setProcessingPhase(DEMO_PHASES[phaseIndex]);
      setDemoStep(phaseIndex);
    } catch (err) {
      console.error('Failed to fetch from backend:', err);
    }
  }, []);

  const tick = useCallback((sc: ScenarioType, mode: EngineMode) => {
    if (mode === 'LOCAL') {
      tickLocal(sc);
    } else {
      fetchBackendData();
    }
  }, [tickLocal, fetchBackendData]);

  const startSimulation = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    tickCountRef.current = 0;
    setIsRunning(true);
    setIsPaused(false);
    setProcessingPhase('COLLECTING');

    if (engineMode === 'BACKEND') {
      try {
        await fetch(`${API_URL}/api/simulation/start`, { method: 'POST' });
      } catch (err) {
        console.error('Failed to start backend simulation:', err);
      }
    }

    const sc = scenario;
    const mode = engineMode;
    tick(sc, mode);
    intervalRef.current = setInterval(() => tick(sc, mode), TICK_MS);
  }, [scenario, engineMode, tick]);

  const pauseSimulation = useCallback(async () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      
      if (engineMode === 'BACKEND') {
        try {
          await fetch(`${API_URL}/api/simulation/start`, { method: 'POST' });
        } catch (err) {
          console.error('Failed to resume backend simulation:', err);
        }
      }

      const sc = scenario;
      const mode = engineMode;
      intervalRef.current = setInterval(() => tick(sc, mode), TICK_MS);
    } else {
      // Pause
      setIsPaused(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      if (engineMode === 'BACKEND') {
        try {
          await fetch(`${API_URL}/api/simulation/stop`, { method: 'POST' });
        } catch (err) {
          console.error('Failed to stop backend simulation:', err);
        }
      }
    }
  }, [isPaused, scenario, engineMode, tick]);

  const resetSim = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    
    if (engineMode === 'LOCAL') {
      resetSimulation();
    } else {
      try {
        await fetch(`${API_URL}/api/simulation/reset`, { method: 'POST' });
      } catch (err) {
        console.error('Failed to reset backend simulation:', err);
      }
    }
    
    tickCountRef.current = 0;
    setSignals([]);
    setBusEstimate(null);
    setIsRunning(false);
    setIsPaused(false);
    setProcessingPhase('IDLE');
    setDemoStep(0);
  }, [engineMode]);

  const setScenario = useCallback((s: ScenarioType) => {
    resetSim();
    setScenarioState(s);
  }, [resetSim]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, []);

  // Auto-start simulation on first load for ambient data
  useEffect(() => {
    const timer = setTimeout(() => {
      startSimulation();
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SimContext.Provider value={{
      signals,
      busEstimate,
      isRunning,
      isPaused,
      scenario,
      processingPhase,
      demoStep,
      engineMode,
      setEngineMode,
      startSimulation,
      pauseSimulation,
      resetSim,
      setScenario,
    }}>
      {children}
    </SimContext.Provider>
  );
}
