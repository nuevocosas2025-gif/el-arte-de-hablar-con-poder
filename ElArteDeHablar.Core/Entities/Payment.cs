using System;

namespace ElArteDeHablar.Core.Entities
{
    public class Payment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid StudentId { get; set; }
        public Student? Student { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public int InstallmentNumber { get; set; } // 1 for complete payment, 1..3 for installment payments
        public string Status { get; set; } = "Pendiente"; // "Pagado", "Pendiente", "Vencido"
        public string ReferenceCode { get; set; } = string.Empty; // Transaction ID
    }
}
