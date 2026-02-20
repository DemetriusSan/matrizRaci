import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AgileMetricsSettings,
  BaselineGoal,
  METRIC_DEFINITIONS,
  MetricCategory,
  MetricEntry,
  RADAR_DIMENSIONS,
} from '../models/agile-metrics.model';

const STORAGE_KEYS = {
  entries: 'agileMetrics.entries',
  baseline: 'agileMetrics.baseline',
  settings: 'agileMetrics.settings',
};

const defaultSettings: AgileMetricsSettings = {
  squadName: 'Squad Cartões - Transformação Ágil',
  pilotStart: new Date().toISOString(),
  wave1: '',
  wave2: '',
  wave3: '',
  radarBaseline: RADAR_DIMENSIONS.reduce((acc, dimension) => {
    acc[dimension] = 3;
    return acc;
  }, {} as Record<string, number>),
  radarCurrent: RADAR_DIMENSIONS.reduce((acc, dimension) => {
    acc[dimension] = 3;
    return acc;
  }, {} as Record<string, number>),
  roi: {
    dysfunctionCosts: 120000,
    projectedGains: 260000,
    investment: 80000,
  },
};

@Injectable({
  providedIn: 'root',
})
export class AgileMetricsService {
  private isBrowser = false;
  private entriesSubject: BehaviorSubject<MetricEntry[]>;
  private baselineSubject: BehaviorSubject<Record<string, BaselineGoal>>;
  private settingsSubject: BehaviorSubject<AgileMetricsSettings>;
  entries$: Observable<MetricEntry[]>;
  baseline$: Observable<Record<string, BaselineGoal>>;
  settings$: Observable<AgileMetricsSettings>;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.entriesSubject = new BehaviorSubject<MetricEntry[]>(this.loadEntries());
    this.baselineSubject = new BehaviorSubject<Record<string, BaselineGoal>>(
      this.loadBaseline()
    );
    this.settingsSubject = new BehaviorSubject<AgileMetricsSettings>(this.loadSettings());
    this.entries$ = this.entriesSubject.asObservable();
    this.baseline$ = this.baselineSubject.asObservable();
    this.settings$ = this.settingsSubject.asObservable();
  }

  getEntriesSnapshot(): MetricEntry[] {
    return this.entriesSubject.getValue();
  }

  getBaselineSnapshot(): Record<string, BaselineGoal> {
    return this.baselineSubject.getValue();
  }

  getSettingsSnapshot(): AgileMetricsSettings {
    return this.settingsSubject.getValue();
  }

  addEntry(entry: MetricEntry): void {
    const entries = [entry, ...this.entriesSubject.getValue()];
    this.entriesSubject.next(entries);
    this.persistEntries(entries);
  }

  updateEntry(updated: MetricEntry): void {
    const entries = this.entriesSubject
      .getValue()
      .map((entry) => (entry.id === updated.id ? updated : entry));
    this.entriesSubject.next(entries);
    this.persistEntries(entries);
  }

  deleteEntry(id: string): void {
    const entries = this.entriesSubject.getValue().filter((entry) => entry.id !== id);
    this.entriesSubject.next(entries);
    this.persistEntries(entries);
  }

  updateBaseline(baseline: Record<string, BaselineGoal>): void {
    this.baselineSubject.next(baseline);
    this.persistBaseline(baseline);
  }

  updateSettings(settings: AgileMetricsSettings): void {
    this.settingsSubject.next(settings);
    this.persistSettings(settings);
  }

  getDefinitionsByCategory(category: MetricCategory) {
    return METRIC_DEFINITIONS.filter((metric) => metric.category === category);
  }

  private loadEntries(): MetricEntry[] {
    if (!this.isBrowser) {
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEYS.entries);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw) as MetricEntry[];
      return parsed ?? [];
    } catch {
      return [];
    }
  }

  private loadBaseline(): Record<string, BaselineGoal> {
    if (!this.isBrowser) {
      return this.createDefaultBaseline();
    }
    const raw = localStorage.getItem(STORAGE_KEYS.baseline);
    if (raw) {
      try {
        return JSON.parse(raw) as Record<string, BaselineGoal>;
      } catch {
        return this.createDefaultBaseline();
      }
    }
    return this.createDefaultBaseline();
  }

  private loadSettings(): AgileMetricsSettings {
    if (!this.isBrowser) {
      return defaultSettings;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) {
      return defaultSettings;
    }
    try {
      return { ...defaultSettings, ...(JSON.parse(raw) as AgileMetricsSettings) };
    } catch {
      return defaultSettings;
    }
  }

  private createDefaultBaseline(): Record<string, BaselineGoal> {
    return METRIC_DEFINITIONS.reduce((acc, metric) => {
      acc[metric.key] = {
        baseline: metric.higherIsBetter ? 50 : 20,
        goal: metric.higherIsBetter ? 80 : 10,
      };
      return acc;
    }, {} as Record<string, BaselineGoal>);
  }

  private persistEntries(entries: MetricEntry[]): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
  }

  private persistBaseline(baseline: Record<string, BaselineGoal>): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(STORAGE_KEYS.baseline, JSON.stringify(baseline));
  }

  private persistSettings(settings: AgileMetricsSettings): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }
}
