using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ElArteDeHablar.Core.Dtos;
using ElArteDeHablar.Core.Entities;
using ElArteDeHablar.Core.Interfaces;

namespace ElArteDeHablar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrador")]
    public class DashboardController : ControllerBase
    {
        private readonly IRepository<Student> _studentRepository;
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IRepository<Attendance> _attendanceRepository;
        private readonly IRepository<Group> _groupRepository;

        public DashboardController(
            IRepository<Student> studentRepository,
            IRepository<Payment> paymentRepository,
            IRepository<Attendance> attendanceRepository,
            IRepository<Group> groupRepository)
        {
            _studentRepository = studentRepository;
            _paymentRepository = paymentRepository;
            _attendanceRepository = attendanceRepository;
            _groupRepository = groupRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            var students = await _studentRepository.GetAllAsync();
            var payments = await _paymentRepository.GetAllAsync();
            var attendances = await _attendanceRepository.GetAllAsync();
            var groups = await _groupRepository.GetAllAsync();

            int totalStudents = students.Count();
            decimal totalRevenue = payments.Where(p => p.Status == "Pagado").Sum(p => p.Amount);
            decimal pendingPayments = payments.Where(p => p.Status == "Pendiente").Sum(p => p.Amount);

            int totalAttendanceCount = attendances.Count();
            double attendanceRate = 100.0;
            if (totalAttendanceCount > 0)
            {
                int presentOrLate = attendances.Count(a => a.Status == "Presente" || a.Status == "Tardanza");
                attendanceRate = (double)presentOrLate / totalAttendanceCount * 100.0;
            }

            int activeCourses = groups.Count();

            // Monthly revenue grouping
            var monthlyGroup = payments
                .Where(p => p.Status == "Pagado")
                .GroupBy(p => p.PaymentDate.ToString("yyyy-MM"))
                .Select(g => new RevenueMonthlyDto
                {
                    Month = g.Key,
                    Amount = g.Sum(p => p.Amount)
                })
                .OrderBy(m => m.Month)
                .ToList();

            // Attendance summary
            var attendanceSummary = attendances
                .GroupBy(a => a.Status)
                .Select(g => new AttendanceSummaryDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToList();

            // Ensure all statuses exist in summary
            var statuses = new[] { "Presente", "Falta", "Tardanza" };
            foreach (var status in statuses)
            {
                if (!attendanceSummary.Any(s => s.Status == status))
                {
                    attendanceSummary.Add(new AttendanceSummaryDto { Status = status, Count = 0 });
                }
            }

            var dashboardDto = new DashboardDataDto
            {
                Kpis = new DashboardKpisDto
                {
                    TotalStudents = totalStudents,
                    TotalRevenue = totalRevenue,
                    PendingPayments = pendingPayments,
                    AttendanceRate = Math.Round(attendanceRate, 1),
                    ActiveCourses = activeCourses
                },
                MonthlyRevenue = monthlyGroup,
                AttendanceSummary = attendanceSummary
            };

            return Ok(dashboardDto);
        }
    }
}
