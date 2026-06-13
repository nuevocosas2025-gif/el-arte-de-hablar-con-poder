using System;

namespace ElArteDeHablar.Core.Entities
{
    public class Attendance
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid StudentId { get; set; }
        public Student? Student { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } = "Presente"; // "Presente", "Falta", "Tardanza"
    }
}
