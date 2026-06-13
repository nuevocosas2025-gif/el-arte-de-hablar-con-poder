using System.Collections.Generic;

namespace ElArteDeHablar.Core.Dtos
{
    public class DashboardKpisDto
    {
        public int TotalStudents { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal PendingPayments { get; set; }
        public double AttendanceRate { get; set; } // Percentage
        public int ActiveCourses { get; set; }
    }

    public class DashboardDataDto
    {
        public DashboardKpisDto Kpis { get; set; } = new DashboardKpisDto();
        public List<RevenueMonthlyDto> MonthlyRevenue { get; set; } = new List<RevenueMonthlyDto>();
        public List<AttendanceSummaryDto> AttendanceSummary { get; set; } = new List<AttendanceSummaryDto>();
    }

    public class RevenueMonthlyDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class AttendanceSummaryDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
