using System;

namespace ElArteDeHablar.Core.Entities
{
    public class Group
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty; // "Grupo 1", "Grupo 2", etc.
        public string Schedule { get; set; } = string.Empty; // "Martes y Jueves 4:00 PM - 7:30 PM", etc.
        public int Capacity { get; set; } = 25;
        public int AvailableSeats { get; set; } = 25;
        public string Status { get; set; } = "Disponible"; // "Disponible" or "Lleno"
    }
}
