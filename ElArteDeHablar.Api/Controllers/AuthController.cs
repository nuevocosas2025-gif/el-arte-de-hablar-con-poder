using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ElArteDeHablar.Core.Dtos;
using ElArteDeHablar.Core.Entities;
using ElArteDeHablar.Core.Interfaces;
using ElArteDeHablar.Infrastructure.Security;
using System.Linq;

namespace ElArteDeHablar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<Student> _studentRepository;
        private readonly IConfiguration _configuration;

        public AuthController(
            IRepository<User> userRepository, 
            IRepository<Student> studentRepository, 
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _studentRepository = studentRepository;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var users = await _userRepository.FindAsync(u => u.Email.ToLower() == loginDto.Email.ToLower());
            var user = users.FirstOrDefault();

            if (user == null || !PasswordHasher.VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Correo o contraseña incorrectos." });
            }

            Guid? studentId = null;
            if (user.Role == "Estudiante")
            {
                var students = await _studentRepository.FindAsync(s => s.UserId == user.Id);
                studentId = students.FirstOrDefault()?.Id;
            }

            var token = GenerateJwtToken(user);

            return Ok(new LoginResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                StudentId = studentId
            });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "SuperSecretSecureKeyForElArteDeHablarConPoder2026!ElArte");
            
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:DurationInMinutes"] ?? "180")),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
