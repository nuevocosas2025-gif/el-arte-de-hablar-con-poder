using System;

namespace ElArteDeHablar.Core.Dtos
{
    public class GroupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Schedule { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int AvailableSeats { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class CreateGroupDto
    {
        public string Name { get; set; } = string.Empty;
        public string Schedule { get; set; } = string.Empty;
        public int Capacity { get; set; } = 25;
    }
}
