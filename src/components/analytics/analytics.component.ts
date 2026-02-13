import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analytics.component.html',
    styles: [`
    .analytics-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
    }

    .title {
      font-size: 32px;
      font-weight: bold;
      color: #000;
      margin: 0 0 8px 0;
    }

    .subtitle {
      font-size: 14px;
      color: #666;
    }

    .section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #000;
      margin: 0 0 16px 0;
    }

    .grid {
      display: grid;
      gap: 20px;
    }

    .grid-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .grid-3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .grid-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1024px) {
      .grid-3, .grid-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.2s ease;
    }

    .card:hover {
      border-color: #000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .stat-card {
      text-align: center;
    }

    .stat-icon {
      font-size: 36px;
      margin-bottom: 12px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #000;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 13px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .chart-container {
      padding: 16px 0;
    }

    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .bar-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bar-label {
      min-width: 100px;
      font-size: 13px;
      font-weight: 600;
      color: #000;
    }

    .bar-track {
      flex: 1;
      background: #f0f0f0;
      height: 24px;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .bar-fill {
      background: #000;
      height: 100%;
      transition: width 0.6s ease;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
    }

    .bar-value {
      color: white;
      font-size: 12px;
      font-weight: 600;
    }

    .pie-chart {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      margin: 20px auto;
      position: relative;
    }

    .pie-legend {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .insight-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
    }

    .insight-card.strength {
      background: #f0fdf4;
      border: 1px solid #86efac;
    }

    .insight-card.weakness {
      background: #fef2f2;
      border: 1px solid #fca5a5;
    }

    .insight-card.recommendation {
      background: #eff6ff;
      border: 1px solid #93c5fd;
    }

    .insight-card.achievement {
      background: #fefce8;
      border: 1px solid #fde047;
    }

    .insight-icon {
      font-size: 24px;
    }

    .insight-content {
      flex: 1;
    }

    .insight-title {
      font-size: 14px;
      font-weight: 600;
      color: #000;
      margin-bottom: 4px;
    }

    .insight-desc {
      font-size: 13px;
      color: #666;
    }

    .session-table {
      width: 100%;
      border-collapse: collapse;
    }

    .session-table th {
      text-align: left;
      padding: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
      border-bottom: 2px solid #e5e5e5;
    }

    .session-table td {
      padding: 12px;
      font-size: 13px;
      border-bottom: 1px solid #f0f0f0;
    }

    .session-table tr:hover {
      background: #f9fafb;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge.quiz {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge.interpretation {
      background: #f3e8ff;
      color: #6b21a8;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #999;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
    private analyticsService = inject(AnalyticsService);

    data = signal<AnalyticsData | null>(null);

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        const analyticsData = this.analyticsService.getAnalyticsData();
        this.data.set(analyticsData);
    }

    getSubjectIcon(subject: string): string {
        const icons: Record<string, string> = {
            'Matemática': '📐',
            'Português': '📖',
            'Ciências': '🧪',
            'História': '🌍',
            'Geografia': '🗺️',
            'Geral': '📚'
        };
        return icons[subject] || '📄';
    }

    formatDate(isoString: string): string {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }

    formatDuration(minutes?: number): string {
        if (!minutes) return '-';
        if (minutes < 60) return `${minutes}min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}min`;
    }

    getPieChartStyle(correct: number, total: number): any {
        const percentage = total > 0 ? (correct / total) * 100 : 0;
        return {
            background: `conic-gradient(#000 0% ${percentage}%, #e5e5e5 ${percentage}% 100%)`
        };
    }
}
