import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private featureFlags: { [key: string]: boolean } = {};
  private logLevel: number = 3; // 0: Nothing, 1: Error, 2: Warn, 3: Info, 4: Debug


  setFeatureFlag(flag: string, isEnabled: boolean): void {
    this.featureFlags[flag] = isEnabled;
  }

  isFeatureEnabled(flag: string): boolean {
    return !!this.featureFlags[flag];
  }

  setLogLevel(level: number): void {
    this.logLevel = level;
  }

  log(level: number, message: string): void {
    if (level <= this.logLevel) {
      const logMethods = [console.error, console.warn, console.info, console.debug];
      logMethods[level - 1]?.(message);
    }
  }
}