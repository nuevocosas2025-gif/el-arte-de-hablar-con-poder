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
    public class PaymentsController : ControllerBase
    {
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IRepository<Student> _studentRepository;

        public PaymentsController(
            IRepository<Payment> paymentRepository,
            IRepository<Student> studentRepository)
        {
            _paymentRepository = paymentRepository;
            _studentRepository = studentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetPayments()
        {
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            Guid userId = Guid.Parse(userIdClaim!);

            var payments = await _paymentRepository.GetAllAsync();
            var students = await _studentRepository.GetAllAsync();

            if (userRole == "Administrador")
            {
                var dtos = payments.Select(p => {
                    var student = students.FirstOrDefault(s => s.Id == p.StudentId);
                    return new PaymentDto
                    {
                        Id = p.Id,
                        StudentId = p.StudentId,
                        StudentName = student?.Name ?? "Estudiante Eliminado",
                        Amount = p.Amount,
                        PaymentDate = p.PaymentDate,
                        InstallmentNumber = p.InstallmentNumber,
                        Status = p.Status,
                        ReferenceCode = p.ReferenceCode
                    };
                }).OrderByDescending(p => p.PaymentDate).ToList();

                return Ok(dtos);
            }
            else // Estudiante
            {
                var student = students.FirstOrDefault(s => s.UserId == userId);
                if (student == null)
                {
                    return NotFound(new { message = "Perfil de estudiante no encontrado." });
                }

                var studentPayments = payments.Where(p => p.StudentId == student.Id);
                var dtos = studentPayments.Select(p => new PaymentDto
                {
                    Id = p.Id,
                    StudentId = p.Id,
                    StudentName = student.Name,
                    Amount = p.Amount,
                    PaymentDate = p.PaymentDate,
                    InstallmentNumber = p.InstallmentNumber,
                    Status = p.Status,
                    ReferenceCode = p.ReferenceCode
                }).OrderBy(p => p.InstallmentNumber).ToList();

                return Ok(dtos);
            }
        }

        [HttpPost("{id}/record")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> RecordPayment(Guid id, [FromBody] string referenceCode)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null)
            {
                return NotFound(new { message = "Registro de pago no encontrado." });
            }

            payment.Status = "Pagado";
            payment.PaymentDate = DateTime.UtcNow;
            payment.ReferenceCode = string.IsNullOrEmpty(referenceCode) ? $"REF-{new Random().Next(100000, 999999)}" : referenceCode;

            _paymentRepository.Update(payment);
            await _paymentRepository.SaveChangesAsync();

            // Check if student's enrollment status needs activation
            var student = await _studentRepository.GetByIdAsync(payment.StudentId);
            if (student != null && student.EnrollmentStatus == "Pendiente")
            {
                student.EnrollmentStatus = "Activo";
                _studentRepository.Update(student);
                await _studentRepository.SaveChangesAsync();
            }

            return Ok(new { message = "Pago registrado exitosamente." });
        }
    }
}
