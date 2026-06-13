using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ElArteDeHablar.Core.Dtos;
using ElArteDeHablar.Core.Entities;
using ElArteDeHablar.Core.Interfaces;
using ElArteDeHablar.Infrastructure.Security;

namespace ElArteDeHablar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly IRepository<Student> _studentRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Group> _groupRepository;
        private readonly IRepository<Enrollment> _enrollmentRepository;
        private readonly IRepository<Payment> _paymentRepository;

        public StudentsController(
            IRepository<Student> studentRepository,
            IRepository<User> userRepository,
            IRepository<Group> groupRepository,
            IRepository<Enrollment> enrollmentRepository,
            IRepository<Payment> paymentRepository)
        {
            _studentRepository = studentRepository;
            _userRepository = userRepository;
            _groupRepository = groupRepository;
            _enrollmentRepository = enrollmentRepository;
            _paymentRepository = paymentRepository;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetAll()
        {
            var students = await _studentRepository.GetAllAsync();
            var groups = await _groupRepository.GetAllAsync();

            var dtos = students.Select(s => {
                var group = groups.FirstOrDefault(g => g.Id == s.GroupId);
                return new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email,
                    Phone = s.Phone,
                    EnrollmentStatus = s.EnrollmentStatus,
                    GroupId = s.GroupId,
                    GroupName = group?.Name ?? "Ninguno",
                    Schedule = group?.Schedule ?? "Sin horario",
                    UserId = s.UserId,
                    RegisteredAt = s.RegisteredAt
                };
            }).OrderByDescending(s => s.RegisteredAt).ToList();

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
            {
                return NotFound(new { message = "Estudiante no encontrado." });
            }

            // Security check: Only allow Admin or the student themselves
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userRole != "Administrador" && userIdClaim != student.UserId.ToString())
            {
                return Forbid();
            }

            var group = student.GroupId.HasValue ? await _groupRepository.GetByIdAsync(student.GroupId.Value) : null;

            var dto = new StudentDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                Phone = student.Phone,
                EnrollmentStatus = student.EnrollmentStatus,
                GroupId = student.GroupId,
                GroupName = group?.Name ?? "Ninguno",
                Schedule = group?.Schedule ?? "Sin horario",
                UserId = student.UserId,
                RegisteredAt = student.RegisteredAt
            };

            return Ok(dto);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterStudentDto dto)
        {
            if (string.IsNullOrEmpty(dto.Name) || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { message = "Nombre, correo y contraseña son obligatorios." });
            }

            // Check if user already exists
            var existingUsers = await _userRepository.FindAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (existingUsers.Any())
            {
                return BadRequest(new { message = "El correo electrónico ya está registrado." });
            }

            var group = await _groupRepository.GetByIdAsync(dto.GroupId);
            if (group == null)
            {
                return BadRequest(new { message = "El grupo seleccionado no existe." });
            }

            if (group.AvailableSeats <= 0)
            {
                return BadRequest(new { message = "El grupo seleccionado ya no tiene cupos disponibles." });
            }

            // Create User account
            var user = new User
            {
                Username = dto.Name.Split(' ')[0],
                Email = dto.Email,
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                Role = "Estudiante"
            };
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // Create Student Profile
            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                EnrollmentStatus = "Pendiente",
                GroupId = dto.GroupId,
                UserId = user.Id
            };
            await _studentRepository.AddAsync(student);
            await _studentRepository.SaveChangesAsync();

            // Create Enrollment record
            var enrollment = new Enrollment
            {
                StudentId = student.Id,
                GroupId = dto.GroupId,
                PlanName = dto.PlanName,
                PaymentMethod = dto.PaymentMethod,
                Price = dto.Price,
                Status = "Pendiente"
            };
            await _enrollmentRepository.AddAsync(enrollment);
            await _enrollmentRepository.SaveChangesAsync();

            // Generate Payment schedules
            if (dto.PaymentMethod == "Completo")
            {
                var payment = new Payment
                {
                    StudentId = student.Id,
                    Amount = dto.Price,
                    InstallmentNumber = 1,
                    Status = "Pendiente"
                };
                await _paymentRepository.AddAsync(payment);
            }
            else // Cuotas (3 installments)
            {
                decimal baseAmount = Math.Round(dto.Price / 3, 2);
                decimal lastAmount = dto.Price - (baseAmount * 2);

                for (int i = 1; i <= 3; i++)
                {
                    var payment = new Payment
                    {
                        StudentId = student.Id,
                        Amount = i == 3 ? lastAmount : baseAmount,
                        InstallmentNumber = i,
                        Status = "Pendiente"
                    };
                    await _paymentRepository.AddAsync(payment);
                }
            }
            await _paymentRepository.SaveChangesAsync();

            // Update Group available seats
            group.AvailableSeats--;
            if (group.AvailableSeats <= 0)
            {
                group.Status = "Lleno";
            }
            _groupRepository.Update(group);
            await _groupRepository.SaveChangesAsync();

            return Ok(new { message = "¡Registro e inscripción de matrícula realizados con éxito! Inicia sesión para ver tu estado." });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(Guid id, [FromBody] UpdateProfileDto dto)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
            {
                return NotFound(new { message = "Estudiante no encontrado." });
            }

            // Security check: Only allow the student themselves (or admin)
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userRole != "Administrador" && userIdClaim != student.UserId.ToString())
            {
                return Forbid();
            }

            if (!string.IsNullOrEmpty(dto.Name))
            {
                student.Name = dto.Name;
            }
            if (!string.IsNullOrEmpty(dto.Phone))
            {
                student.Phone = dto.Phone;
            }

            _studentRepository.Update(student);
            await _studentRepository.SaveChangesAsync();

            // Update User details
            var user = await _userRepository.GetByIdAsync(student.UserId);
            if (user != null)
            {
                if (!string.IsNullOrEmpty(dto.Name))
                {
                    user.Username = dto.Name.Split(' ')[0];
                }
                if (!string.IsNullOrEmpty(dto.Password))
                {
                    user.PasswordHash = PasswordHasher.HashPassword(dto.Password);
                }
                _userRepository.Update(user);
                await _userRepository.SaveChangesAsync();
            }

            return Ok(new { message = "Perfil actualizado correctamente." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
            {
                return NotFound(new { message = "Estudiante no encontrado." });
            }

            // Re-add group seat if student was in a group
            if (student.GroupId.HasValue)
            {
                var group = await _groupRepository.GetByIdAsync(student.GroupId.Value);
                if (group != null)
                {
                    group.AvailableSeats++;
                    if (group.AvailableSeats > 0)
                    {
                        group.Status = "Disponible";
                    }
                    _groupRepository.Update(group);
                }
            }

            var user = await _userRepository.GetByIdAsync(student.UserId);
            if (user != null)
            {
                _userRepository.Remove(user);
            }

            _studentRepository.Remove(student);
            await _studentRepository.SaveChangesAsync();
            await _userRepository.SaveChangesAsync();

            return Ok(new { message = "Estudiante eliminado correctamente." });
        }
    }
}
