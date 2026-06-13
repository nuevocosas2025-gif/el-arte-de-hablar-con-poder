using System;

namespace ElArteDeHablar.Core.Entities
{
    public class Student
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string EnrollmentStatus { get; set; } = "Pendiente"; // "Activo", "Pendiente", "Inactivo"
        
        public Guid? GroupId { get; set; }
        public Group? Group { get; set; }
        
        public Guid UserId { get; set; }
        public User? User { get; set; }
        
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    }
}
