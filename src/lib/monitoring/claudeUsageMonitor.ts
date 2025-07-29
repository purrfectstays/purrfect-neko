/**
 * Claude Usage Monitor for Purrfect Stays
 * 
 * A lightweight implementation inspired by the Claude Code Usage Monitor
 * to track API usage, costs, and token consumption for the project.
 */

import { createClient } from '@supabase/supabase-js';

interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens?: number;
  cacheReadTokens?: number;
  totalTokens: number;
}

interface UsageEntry {
  id?: string;
  timestamp: Date;
  model: string;
  tokenUsage: TokenUsage;
  cost: number;
  requestType: string;
  endpoint?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

interface UsageStats {
  totalTokens: number;
  totalCost: number;
  requestCount: number;
  byModel: Record<string, {
    tokens: number;
    cost: number;
    count: number;
  }>;
  byEndpoint: Record<string, {
    tokens: number;
    cost: number;
    count: number;
  }>;
}

interface ModelPricing {
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cacheCreationPricePerMillion?: number;
  cacheReadPricePerMillion?: number;
}

// Model pricing as of 2025 (prices per million tokens)
const MODEL_PRICING: Record<string, ModelPricing> = {
  'claude-3-5-sonnet': {
    inputPricePerMillion: 3.0,
    outputPricePerMillion: 15.0,
    cacheCreationPricePerMillion: 3.75,
    cacheReadPricePerMillion: 0.3,
  },
  'claude-3-5-haiku': {
    inputPricePerMillion: 0.25,
    outputPricePerMillion: 1.25,
    cacheCreationPricePerMillion: 0.3,
    cacheReadPricePerMillion: 0.03,
  },
  'claude-3-opus': {
    inputPricePerMillion: 15.0,
    outputPricePerMillion: 75.0,
    cacheCreationPricePerMillion: 18.75,
    cacheReadPricePerMillion: 1.5,
  },
  'claude-3-sonnet': {
    inputPricePerMillion: 3.0,
    outputPricePerMillion: 15.0,
    cacheCreationPricePerMillion: 3.75,
    cacheReadPricePerMillion: 0.3,
  },
  'claude-3-haiku': {
    inputPricePerMillion: 0.25,
    outputPricePerMillion: 1.25,
    cacheCreationPricePerMillion: 0.3,
    cacheReadPricePerMillion: 0.03,
  },
};

export class ClaudeUsageMonitor {
  private supabase: any;
  private sessionId: string;
  private entries: UsageEntry[] = [];
  private isEnabled: boolean = true;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    this.sessionId = this.generateSessionId();
  }

  /**
   * Enable or disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate cost for a given token usage
   */
  calculateCost(model: string, tokenUsage: TokenUsage): number {
    const pricing = MODEL_PRICING[model] || MODEL_PRICING['claude-3-5-sonnet'];
    
    const inputCost = (tokenUsage.inputTokens / 1_000_000) * pricing.inputPricePerMillion;
    const outputCost = (tokenUsage.outputTokens / 1_000_000) * pricing.outputPricePerMillion;
    
    let cacheCreationCost = 0;
    let cacheReadCost = 0;
    
    if (tokenUsage.cacheCreationTokens && pricing.cacheCreationPricePerMillion) {
      cacheCreationCost = (tokenUsage.cacheCreationTokens / 1_000_000) * pricing.cacheCreationPricePerMillion;
    }
    
    if (tokenUsage.cacheReadTokens && pricing.cacheReadPricePerMillion) {
      cacheReadCost = (tokenUsage.cacheReadTokens / 1_000_000) * pricing.cacheReadPricePerMillion;
    }
    
    return inputCost + outputCost + cacheCreationCost + cacheReadCost;
  }

  /**
   * Track a Claude API usage
   */
  async trackUsage(
    model: string,
    tokenUsage: Partial<TokenUsage>,
    requestType: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!this.isEnabled) return;

    const fullTokenUsage: TokenUsage = {
      inputTokens: tokenUsage.inputTokens || 0,
      outputTokens: tokenUsage.outputTokens || 0,
      cacheCreationTokens: tokenUsage.cacheCreationTokens || 0,
      cacheReadTokens: tokenUsage.cacheReadTokens || 0,
      totalTokens: (tokenUsage.inputTokens || 0) + 
                   (tokenUsage.outputTokens || 0) + 
                   (tokenUsage.cacheCreationTokens || 0) + 
                   (tokenUsage.cacheReadTokens || 0),
    };

    const cost = this.calculateCost(model, fullTokenUsage);

    const entry: UsageEntry = {
      timestamp: new Date(),
      model,
      tokenUsage: fullTokenUsage,
      cost,
      requestType,
      sessionId: this.sessionId,
      endpoint: metadata?.endpoint,
      userId: metadata?.userId,
      metadata,
    };

    this.entries.push(entry);

    // Persist to Supabase if configured
    if (this.supabase) {
      try {
        await this.supabase.from('claude_usage_logs').insert([{
          timestamp: entry.timestamp.toISOString(),
          model: entry.model,
          input_tokens: entry.tokenUsage.inputTokens,
          output_tokens: entry.tokenUsage.outputTokens,
          cache_creation_tokens: entry.tokenUsage.cacheCreationTokens,
          cache_read_tokens: entry.tokenUsage.cacheReadTokens,
          total_tokens: entry.tokenUsage.totalTokens,
          cost_usd: entry.cost,
          request_type: entry.requestType,
          session_id: entry.sessionId,
          endpoint: entry.endpoint,
          user_id: entry.userId,
          metadata: entry.metadata,
        }]);
      } catch (error) {
        console.error('Failed to persist usage data:', error);
      }
    }
  }

  /**
   * Get usage statistics for the current session
   */
  getSessionStats(): UsageStats {
    return this.calculateStats(this.entries);
  }

  /**
   * Get usage statistics for a time period
   */
  async getUsageStats(startDate: Date, endDate: Date): Promise<UsageStats> {
    if (!this.supabase) {
      // Filter local entries
      const filteredEntries = this.entries.filter(entry => 
        entry.timestamp >= startDate && entry.timestamp <= endDate
      );
      return this.calculateStats(filteredEntries);
    }

    try {
      const { data, error } = await this.supabase
        .from('claude_usage_logs')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (error) throw error;

      const entries: UsageEntry[] = data.map((row: any) => ({
        timestamp: new Date(row.timestamp),
        model: row.model,
        tokenUsage: {
          inputTokens: row.input_tokens,
          outputTokens: row.output_tokens,
          cacheCreationTokens: row.cache_creation_tokens,
          cacheReadTokens: row.cache_read_tokens,
          totalTokens: row.total_tokens,
        },
        cost: row.cost_usd,
        requestType: row.request_type,
        sessionId: row.session_id,
        endpoint: row.endpoint,
        userId: row.user_id,
        metadata: row.metadata,
      }));

      return this.calculateStats(entries);
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
      return this.calculateStats([]);
    }
  }

  /**
   * Calculate statistics from usage entries
   */
  private calculateStats(entries: UsageEntry[]): UsageStats {
    const stats: UsageStats = {
      totalTokens: 0,
      totalCost: 0,
      requestCount: entries.length,
      byModel: {},
      byEndpoint: {},
    };

    for (const entry of entries) {
      stats.totalTokens += entry.tokenUsage.totalTokens;
      stats.totalCost += entry.cost;

      // By model stats
      if (!stats.byModel[entry.model]) {
        stats.byModel[entry.model] = { tokens: 0, cost: 0, count: 0 };
      }
      stats.byModel[entry.model].tokens += entry.tokenUsage.totalTokens;
      stats.byModel[entry.model].cost += entry.cost;
      stats.byModel[entry.model].count += 1;

      // By endpoint stats
      if (entry.endpoint) {
        if (!stats.byEndpoint[entry.endpoint]) {
          stats.byEndpoint[entry.endpoint] = { tokens: 0, cost: 0, count: 0 };
        }
        stats.byEndpoint[entry.endpoint].tokens += entry.tokenUsage.totalTokens;
        stats.byEndpoint[entry.endpoint].cost += entry.cost;
        stats.byEndpoint[entry.endpoint].count += 1;
      }
    }

    return stats;
  }

  /**
   * Get burn rate (tokens per minute) for the last N minutes
   */
  getBurnRate(minutes: number = 60): number {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const recentEntries = this.entries.filter(entry => entry.timestamp >= cutoffTime);
    
    if (recentEntries.length === 0) return 0;
    
    const totalTokens = recentEntries.reduce((sum, entry) => sum + entry.tokenUsage.totalTokens, 0);
    return totalTokens / minutes;
  }

  /**
   * Export usage data as JSON
   */
  exportData(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      entries: this.entries,
      stats: this.getSessionStats(),
    }, null, 2);
  }

  /**
   * Clear local entries
   */
  clearLocalData(): void {
    this.entries = [];
  }

  /**
   * Get daily usage summary
   */
  async getDailySummary(date: Date = new Date()): Promise<{
    date: string;
    totalTokens: number;
    totalCost: number;
    requestCount: number;
    averageTokensPerRequest: number;
    mostUsedModel: string;
  }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const stats = await this.getUsageStats(startOfDay, endOfDay);
    
    // Find most used model
    let mostUsedModel = '';
    let maxCount = 0;
    for (const [model, modelStats] of Object.entries(stats.byModel)) {
      if (modelStats.count > maxCount) {
        maxCount = modelStats.count;
        mostUsedModel = model;
      }
    }
    
    return {
      date: date.toISOString().split('T')[0],
      totalTokens: stats.totalTokens,
      totalCost: stats.totalCost,
      requestCount: stats.requestCount,
      averageTokensPerRequest: stats.requestCount > 0 ? stats.totalTokens / stats.requestCount : 0,
      mostUsedModel,
    };
  }
}

// Export a singleton instance for easy use
export const claudeMonitor = new ClaudeUsageMonitor(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);