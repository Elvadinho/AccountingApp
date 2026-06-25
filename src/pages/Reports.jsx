import { useMemo, useState, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown, Award, Calendar, BarChart2, PieChart as PieChartIcon, Activity, Download, ChevronDown, ChevronUp, Layers, Loader2 } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import BarChartComponent from '../components/charts/BarChart';
import AreaChartComponent from '../components/charts/AreaChart';
import RadarChartComponent from '../components/charts/RadarChart';
import DonutChartComponent from '../components/charts/DonutChart';
import MonthlyComparisonChart from '../components/charts/MonthlyComparisonChart';
import SavingsRateChartComponent from '../components/charts/SavingsRateChart';
import TransactionScatterChartComponent from '../components/charts/TransactionScatterChart';
import CategoryTrendChartComponent from '../components/charts/CategoryTrendChart';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { getCategoryColor } from '../utils/categories';

export default function Reports() {
  const { transactions, monthlyData, spendingByCategory } = useFinance();
  const [showMore, setShowMore] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  // Prepare donut chart data
  const donutData = useMemo(() => {
    return Object.entries(spendingByCategory)
      .map(([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name),
      }))
      .sort((a, b) => b.value - a.value);
  }, [spendingByCategory]);

  const radarData = useMemo(() => {
    return Object.entries(spendingByCategory).map(([name, value]) => ({
      name: name,
      value: value,
      fullMark: Math.max(...Object.values(spendingByCategory)),
    }));
  }, [spendingByCategory]);

  // Prepare balance trend data (cumulative)
  const balanceTrendData = useMemo(() => {
    let cumulative = 0;
    return monthlyData.map((m) => {
      cumulative += m.balance;
      return {
        month: m.month,
        balance: cumulative,
      };
    });
  }, [monthlyData]);

  // Summary stats
  const stats = useMemo(() => {
    const highestCategory = donutData.length > 0 ? donutData[0] : null;

    const bestSavingMonth = [...monthlyData].sort((a, b) => b.balance - a.balance)[0];

    const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
    const avgMonthlyExpense = monthlyData.length > 0 ? totalExpenses / monthlyData.length : 0;

    const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
    const avgMonthlyIncome = monthlyData.length > 0 ? totalIncome / monthlyData.length : 0;

    return { highestCategory, bestSavingMonth, avgMonthlyExpense, avgMonthlyIncome };
  }, [donutData, monthlyData]);

  // PDF Export function
  const handleExportPDF = useCallback(async () => {
    if (!reportRef.current || isExporting) return;

    setIsExporting(true);
    try {
      // Dynamically import to reduce initial bundle
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Temporarily expand the detailed section so all charts appear in the PDF
      const wasShowingMore = showMore;
      if (!wasShowingMore) {
        setShowMore(true);
        // Wait for the DOM to update
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(15, 23, 42);
      pdf.text('GereTonNkap — Financial Report', margin, 15);
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      pdf.text(`Generated on ${today}`, margin, 22);

      // Add a line separator
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, 25, pageWidth - margin, 25);

      // Calculate image dimensions to fit the page
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yOffset = 30;
      let remainingHeight = imgHeight;
      let sourceY = 0;

      // Handle multi-page content
      while (remainingHeight > 0) {
        const availableHeight = pageHeight - yOffset - margin;
        const sliceHeight = Math.min(remainingHeight, availableHeight);
        const sourceSliceHeight = (sliceHeight / imgHeight) * canvas.height;

        // Create a temporary canvas for the slice
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sourceSliceHeight;
        const ctx = sliceCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceSliceHeight, 0, 0, canvas.width, sourceSliceHeight);

        pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, yOffset, imgWidth, sliceHeight);

        remainingHeight -= sliceHeight;
        sourceY += sourceSliceHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
          yOffset = margin;
        }
      }

      pdf.save(`GereTonNkap_Report_${new Date().toISOString().slice(0, 10)}.pdf`);

      // Restore the show more state
      if (!wasShowingMore) {
        setShowMore(false);
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, showMore]);

  return (
    <PageWrapper title="Reports">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <p className="text-sm text-[var(--color-text-secondary)]">Your financial analytics and footprint.</p>
        <Button
          onClick={handleExportPDF}
          variant="primary"
          className="flex items-center gap-2"
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? 'Generating...' : 'Export PDF'}
        </Button>
      </div>

      {/* Report Content — wrapped in ref for PDF capture */}
      <div ref={reportRef}>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-finance-expense-glow)] flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-[var(--color-finance-expense)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Top Spending Category</p>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">
                {stats.highestCategory?.name || 'N/A'}
              </p>
              <p className="text-base font-bold font-mono text-[var(--color-finance-expense)] mt-0.5">
                {stats.highestCategory ? formatCurrency(stats.highestCategory.value) : '-'}
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-finance-income-glow)] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[var(--color-finance-savings)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Best Saving Month</p>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">
                {stats.bestSavingMonth?.month || 'N/A'}
              </p>
              <p className="text-base font-bold font-mono text-[var(--color-finance-balance)] mt-0.5">
                {stats.bestSavingMonth ? formatCurrency(stats.bestSavingMonth.balance) : '-'}
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(77, 148, 255, 0.15)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--color-accent-blue)]" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Avg Monthly Income</p>
              <p className="text-base font-bold font-mono text-[var(--color-finance-income)] mt-1">
                {formatCurrency(stats.avgMonthlyIncome)}
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(255, 184, 77, 0.15)' }}>
              <div className="w-full h-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--color-accent-yellow)]" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Avg Monthly Expense</p>
              <p className="text-base font-bold font-mono text-[var(--color-finance-expense)] mt-1">
                {formatCurrency(stats.avgMonthlyExpense)}
              </p>
            </div>
          </Card>
        </div>

        {/* ===== PRIMARY CHARTS (always visible) ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* 1. Income vs Expenses — Most fundamental view */}
          <Card className="xl:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="w-5 h-5 text-[var(--color-finance-income)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Income vs Expenses (6 Months)</h2>
            </div>
            <div className="flex-1 min-h-[350px]">
              <BarChartComponent data={monthlyData} />
            </div>
          </Card>

          {/* 2. Expense Distribution — Quick category breakdown */}
          <Card className="xl:col-span-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-[var(--color-finance-expense)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Expense Distribution</h2>
            </div>
            <div className="flex-1 min-h-[350px] flex items-center justify-center">
              {donutData.length > 0 ? (
                <DonutChartComponent data={donutData} />
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">No expense data available.</p>
              )}
            </div>
          </Card>

          {/* 3. Net Worth Growth — Long-term financial health */}
          <Card className="xl:col-span-3 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[var(--color-finance-balance)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Net Worth Growth</h2>
            </div>
            <div className="flex-1 min-h-[300px]">
              <AreaChartComponent data={balanceTrendData} height="100%" />
            </div>
          </Card>
        </div>

        {/* ===== SHOW MORE ANALYTICS TOGGLE ===== */}
        <div className="flex items-center gap-4 mb-6 print:hidden">
          <div className="flex-1 h-px bg-[var(--color-border-default)]" />
          <Button
            variant="secondary"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 px-6"
          >
            <Layers className="w-4 h-4" />
            {showMore ? 'Show Less' : 'Show More Analytics'}
            {showMore ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          <div className="flex-1 h-px bg-[var(--color-border-default)]" />
        </div>

        {/* ===== DETAILED CHARTS (behind toggle) ===== */}
        <div
          className={`grid grid-cols-1 xl:grid-cols-3 gap-6 transition-all duration-500 ease-in-out overflow-hidden ${
            showMore ? 'max-h-[5000px] opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}
        >
          {/* 4. Spending: This Month vs Last Month */}
          <Card className="xl:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown className="w-5 h-5 text-[var(--color-finance-expense)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Spending: This Month vs Last Month</h2>
            </div>
            <div className="flex-1 min-h-[300px]">
              <MonthlyComparisonChart transactions={transactions} height={300} />
            </div>
          </Card>

          {/* 5. Savings Rate Trend */}
          <Card className="xl:col-span-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-[var(--color-finance-savings)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Savings Rate Trend</h2>
            </div>
            <div className="flex-1 min-h-[300px]">
              <SavingsRateChartComponent data={monthlyData} height="100%" />
            </div>
          </Card>

          {/* 6. Spending Footprint (Radar) */}
          <Card className="xl:col-span-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-[var(--color-accent-blue)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Spending Footprint</h2>
            </div>
            <div className="flex-1 min-h-[350px]">
              {radarData.length > 0 ? (
                <RadarChartComponent data={radarData} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm">
                  No footprint data
                </div>
              )}
            </div>
          </Card>

          {/* 7. Category Trend — NEW: stacked area chart of top 3 expense categories */}
          <Card className="xl:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-[var(--color-accent-blue)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Category Trend (Top 3)</h2>
            </div>
            <div className="flex-1 min-h-[300px]">
              <CategoryTrendChartComponent transactions={transactions} height={300} />
            </div>
          </Card>

          {/* 8. Recent Expenses Scatter Plot */}
          <Card className="xl:col-span-3 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Recent Expenses by Day (Last 30 Days)</h2>
            </div>
            <div className="flex-1 min-h-[300px]">
              <TransactionScatterChartComponent transactions={transactions} height={300} />
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
