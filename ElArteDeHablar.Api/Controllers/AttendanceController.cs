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
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IRepository<Attendance> _attendanceRepository;
        private readonly IRepository<Student> _studentRepository;

        public AttendanceController(
            IRepository<Attendance> attendanceRepository,
            IRepository<Student> studentRepository)
        {
            _attendanceRepository = attendanceRepository;
            _studentRepository = studentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAttendance()
        {
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            Guid userId = Guid.Parse(userIdClaim!);

            var attendances = await _attendanceRepository.GetAllAsync();
            var students = await _studentRepository.GetAllAsync();

            if (userRole == "Administrador")
            {
                var dtos = attendances.Select(a => {
                    var student = students.FirstOrDefault(s => s.Id == a.StudentId);
                    return new AttendanceDto
                    {
                        Id = a.Id,
                        StudentId = a.StudentId,
                        StudentName = student?.Name ?? "Estudiante Eliminado",
                        Date = a.Date,
                        Status = a.Status
                    };
                }).OrderByDescending(a => a.Date).ToList();

                return Ok(dtos);
            }
            else // Estudiante
            {
                var student = students.FirstOrDefault(s => s.UserId == userId);
                if (student == null)
                {
                    return NotFound(new { message = "Perfil de estudiante no encontrado." });
                }

                var studentAttendances = attendances.Where(a => a.StudentId == student.Id);
                var dtos = studentAttendances.Select(a => new AttendanceDto
                {
                    Id = a.Id,
                    StudentId = a.StudentId,
                    StudentName = student.Name,
                    Date = a.Date,
                    Status = a.Status
                }).OrderByDescending(a => a.Date).ToList();

                return Ok(dtos);
            }
        }

        [HttpPost("record")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> RecordAttendance([FromBody] RecordAttendanceDto dto)
        {
            var student = await _studentRepository.GetByIdAsync(dto.StudentId);
            if (student == null)
            {
                return NotFound(new { message = "Estudiante no encontrado." });
            }

            var date = dto.Date.Date;

            // Check if there is already an attendance record for this student on this day
            var existingRecords = await _attendanceRepository.FindAsync(a => a.StudentId == dto.StudentId && a.Date.Date == date);
            var existing = existingRecords.FirstOrDefault();

            if (existing != null)
            {
                existing.Status = dto.Status;
                _attendanceRepository.Update(existing);
                await _attendanceRepository.SaveChangesAsync();
                return Ok(new { message = "Asistencia actualizada correctamente." });
            }
            else
            {
                var attendance = new Attendance
                {
                    StudentId = dto.StudentId,
                    Date = date,
                    Status = dto.Status
                };
                await _attendanceRepository.AddAsync(attendance);
                await _attendanceRepository.SaveChangesAsync();
                return Ok(new { message = "Asistencia registrada correctamente." });
            }
        }
    }
}
