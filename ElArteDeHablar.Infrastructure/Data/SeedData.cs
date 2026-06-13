using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ElArteDeHablar.Core.Entities;
using ElArteDeHablar.Infrastructure.Security;

namespace ElArteDeHablar.Infrastructure.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(ApplicationDbContext context)
        {
            // Ensure database is created (or apply migrations)
            await context.Database.EnsureCreatedAsync();

            // Seed Groups if not present
            if (!await context.Groups.AnyAsync())
            {
                var groups = new List<Group>
                {
                    new Group
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        Name = "Grupo 1",
                        Schedule = "Martes y Jueves (4:00 PM - 7:30 PM)",
                        Capacity = 25,
                        AvailableSeats = 22,
                        Status = "Disponible"
                    },
                    new Group
                    {
                        Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        Name = "Grupo 2",
                        Schedule = "Martes y Jueves (7:45 PM - 10:45 PM)",
                        Capacity = 25,
                        AvailableSeats = 0,
                        Status = "Lleno"
                    },
                    new Group
                    {
                        Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        Name = "Grupo 3",
                        Schedule = "Sábado y Domingo (4:00 PM - 7:00 PM)",
                        Capacity = 25,
                        AvailableSeats = 18,
                        Status = "Disponible"
                    },
                    new Group
                    {
                        Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        Name = "Grupo 4",
                        Schedule = "Miércoles y Viernes (8:00 AM - 12:00 PM)",
                        Capacity = 25,
                        AvailableSeats = 25,
                        Status = "Disponible"
                    }
                };

                await context.Groups.AddRangeAsync(groups);
                await context.SaveChangesAsync();
            }

            // Seed Users and Students
            if (!await context.Users.AnyAsync())
            {
                // Create Admin
                var adminUser = new User
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    Username = "Admin",
                    Email = "admin@hablarconpoder.com",
                    PasswordHash = PasswordHasher.HashPassword("Admin123!"),
                    Role = "Administrador"
                };

                // Create Student 1 (Estudiante Semilla)
                var studentUser1 = new User
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    Username = "estudiante",
                    Email = "estudiante@hablarconpoder.com",
                    PasswordHash = PasswordHasher.HashPassword("Student123!"),
                    Role = "Estudiante"
                };

                // Create Student 2
                var studentUser2 = new User
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    Username = "mrojas",
                    Email = "maria.rojas@gmail.com",
                    PasswordHash = PasswordHasher.HashPassword("Student123!"),
                    Role = "Estudiante"
                };

                // Create Student 3
                var studentUser3 = new User
                {
                    Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                    Username = "cgomez",
                    Email = "carlos.gomez@gmail.com",
                    PasswordHash = PasswordHasher.HashPassword("Student123!"),
                    Role = "Estudiante"
                };

                await context.Users.AddRangeAsync(adminUser, studentUser1, studentUser2, studentUser3);
                await context.SaveChangesAsync();

                // Create Student Profiles
                var student1 = new Student
                {
                    Id = Guid.Parse("11111111-2222-3333-4444-555555555555"),
                    Name = "Juan Pérez",
                    Email = "estudiante@hablarconpoder.com",
                    Phone = "+51 987 654 321",
                    EnrollmentStatus = "Activo",
                    GroupId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // Grupo 1
                    UserId = studentUser1.Id,
                    RegisteredAt = DateTime.UtcNow.AddDays(-15)
                };

                var student2 = new Student
                {
                    Id = Guid.Parse("22222222-3333-4444-5555-666666666666"),
                    Name = "María Rojas",
                    Email = "maria.rojas@gmail.com",
                    Phone = "+51 912 345 678",
                    EnrollmentStatus = "Activo",
                    GroupId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // Grupo 1
                    UserId = studentUser2.Id,
                    RegisteredAt = DateTime.UtcNow.AddDays(-12)
                };

                var student3 = new Student
                {
                    Id = Guid.Parse("33333333-4444-5555-6666-777777777777"),
                    Name = "Carlos Gómez",
                    Email = "carlos.gomez@gmail.com",
                    Phone = "+51 954 789 123",
                    EnrollmentStatus = "Pendiente",
                    GroupId = Guid.Parse("33333333-3333-3333-3333-333333333333"), // Grupo 3
                    UserId = studentUser3.Id,
                    RegisteredAt = DateTime.UtcNow.AddDays(-2)
                };

                await context.Students.AddRangeAsync(student1, student2, student3);
                await context.SaveChangesAsync();

                // Seed Enrollments (Matrículas)
                var enroll1 = new Enrollment
                {
                    Id = Guid.NewGuid(),
                    StudentId = student1.Id,
                    GroupId = student1.GroupId!.Value,
                    PlanName = "Plan Regular",
                    PaymentMethod = "Cuotas",
                    Price = 497,
                    Status = "Aprobado",
                    CreatedAt = student1.RegisteredAt
                };

                var enroll2 = new Enrollment
                {
                    Id = Guid.NewGuid(),
                    StudentId = student2.Id,
                    GroupId = student2.GroupId!.Value,
                    PlanName = "Plan Estudiante",
                    PaymentMethod = "Completo",
                    Price = 397,
                    Status = "Aprobado",
                    CreatedAt = student2.RegisteredAt
                };

                var enroll3 = new Enrollment
                {
                    Id = Guid.NewGuid(),
                    StudentId = student3.Id,
                    GroupId = student3.GroupId!.Value,
                    PlanName = "Plan Regular",
                    PaymentMethod = "Completo",
                    Price = 497,
                    Status = "Pendiente",
                    CreatedAt = student3.RegisteredAt
                };

                await context.Enrollments.AddRangeAsync(enroll1, enroll2, enroll3);
                await context.SaveChangesAsync();

                // Seed Payments for Student 1 (Juan Perez) - Cuotas
                var payments1 = new List<Payment>
                {
                    new Payment
                    {
                        Id = Guid.NewGuid(),
                        StudentId = student1.Id,
                        Amount = 166,
                        PaymentDate = DateTime.UtcNow.AddDays(-15),
                        InstallmentNumber = 1,
                        Status = "Pagado",
                        ReferenceCode = "TRX-12345"
                    },
                    new Payment
                    {
                        Id = Guid.NewGuid(),
                        StudentId = student1.Id,
                        Amount = 166,
                        PaymentDate = DateTime.UtcNow.AddDays(15), // future payment
                        InstallmentNumber = 2,
                        Status = "Pendiente",
                        ReferenceCode = ""
                    },
                    new Payment
                    {
                        Id = Guid.NewGuid(),
                        StudentId = student1.Id,
                        Amount = 165,
                        PaymentDate = DateTime.UtcNow.AddDays(45), // future payment
                        InstallmentNumber = 3,
                        Status = "Pendiente",
                        ReferenceCode = ""
                    }
                };

                // Seed Payments for Student 2 (Maria Rojas) - Completo
                var payments2 = new List<Payment>
                {
                    new Payment
                    {
                        Id = Guid.NewGuid(),
                        StudentId = student2.Id,
                        Amount = 397,
                        PaymentDate = DateTime.UtcNow.AddDays(-12),
                        InstallmentNumber = 1,
                        Status = "Pagado",
                        ReferenceCode = "TRX-98765"
                    }
                };

                // Seed Payments for Student 3 (Carlos Gomez) - Pendiente
                var payments3 = new List<Payment>
                {
                    new Payment
                    {
                        Id = Guid.NewGuid(),
                        StudentId = student3.Id,
                        Amount = 497,
                        PaymentDate = DateTime.UtcNow.AddDays(5),
                        InstallmentNumber = 1,
                        Status = "Pendiente",
                        ReferenceCode = ""
                    }
                };

                await context.Payments.AddRangeAsync(payments1);
                await context.Payments.AddRangeAsync(payments2);
                await context.Payments.AddRangeAsync(payments3);
                await context.SaveChangesAsync();

                // Seed Attendances for Student 1 and Student 2
                var attendances = new List<Attendance>
                {
                    // Student 1 (Juan Perez)
                    new Attendance { StudentId = student1.Id, Date = DateTime.UtcNow.AddDays(-10), Status = "Presente" },
                    new Attendance { StudentId = student1.Id, Date = DateTime.UtcNow.AddDays(-8), Status = "Presente" },
                    new Attendance { StudentId = student1.Id, Date = DateTime.UtcNow.AddDays(-3), Status = "Tardanza" },
                    new Attendance { StudentId = student1.Id, Date = DateTime.UtcNow.AddDays(-1), Status = "Presente" },

                    // Student 2 (Maria Rojas)
                    new Attendance { StudentId = student2.Id, Date = DateTime.UtcNow.AddDays(-10), Status = "Presente" },
                    new Attendance { StudentId = student2.Id, Date = DateTime.UtcNow.AddDays(-8), Status = "Falta" },
                    new Attendance { StudentId = student2.Id, Date = DateTime.UtcNow.AddDays(-3), Status = "Presente" },
                    new Attendance { StudentId = student2.Id, Date = DateTime.UtcNow.AddDays(-1), Status = "Presente" }
                };

                await context.Attendances.AddRangeAsync(attendances);
                await context.SaveChangesAsync();
            }
        }
    }
}
