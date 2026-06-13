using System;

namespace ElArteDeHablar.Core.Dtos
{
    public class AttendanceDto
    {
        public Guid Id { get; set; }
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty; // "Presente", "Falta", "Tardanza"
    }

    public class RecordAttendanceDto
    {
        public Guid StudentId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } = "Presente";
    }
}
