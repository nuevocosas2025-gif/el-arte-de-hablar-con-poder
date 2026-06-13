using System;

namespace ElArteDeHablar.Core.Entities
{
    public class Enrollment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid StudentId { get; set; }
        public Student? Student { get; set; }
        public Guid GroupId { get; set; }
        public Group? Group { get; set; }
        public string PlanName { get; set; } = string.Empty; // "Plan Regular" or "Plan Estudiante"
        public string PaymentMethod { get; set; } = string.Empty; // "Completo" or "Cuotas"
        public decimal Price { get; set; } // S/ 497 or S/ 397
        public string Status { get; set; } = "Pendiente"; // "Pendiente", "Aprobado", "Cancelado"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
