using System;

namespace ElArteDeHablar.Core.Dtos
{
    public class StudentDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string EnrollmentStatus { get; set; } = string.Empty;
        public Guid? GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string Schedule { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public DateTime RegisteredAt { get; set; }
    }

    public class RegisterStudentDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Guid GroupId { get; set; }
        public string Password { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty; // "Plan Regular" or "Plan Estudiante"
        public string PaymentMethod { get; set; } = string.Empty; // "Completo" or "Cuotas"
        public decimal Price { get; set; } // e.g. 497 or 397
    }

    public class UpdateProfileDto
    {
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // Optional password update
    }
}
