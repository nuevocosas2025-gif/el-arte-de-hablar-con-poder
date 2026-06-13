using System;

namespace ElArteDeHablar.Core.Dtos
{
    public class PaymentDto
    {
        public Guid Id { get; set; }
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public int InstallmentNumber { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ReferenceCode { get; set; } = string.Empty;
    }

    public class CreatePaymentDto
    {
        public Guid StudentId { get; set; }
        public decimal Amount { get; set; }
        public int InstallmentNumber { get; set; }
        public string ReferenceCode { get; set; } = string.Empty;
    }
}
