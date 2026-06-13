using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ElArteDeHablar.Core.Dtos;
using ElArteDeHablar.Core.Entities;
using ElArteDeHablar.Core.Interfaces;

namespace ElArteDeHablar.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupsController : ControllerBase
    {
        private readonly IRepository<Group> _groupRepository;

        public GroupsController(IRepository<Group> groupRepository)
        {
            _groupRepository = groupRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var groups = await _groupRepository.GetAllAsync();
            var dtos = groups.Select(g => new GroupDto
            {
                Id = g.Id,
                Name = g.Name,
                Schedule = g.Schedule,
                Capacity = g.Capacity,
                AvailableSeats = g.AvailableSeats,
                Status = g.Status
            }).ToList();
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Create([FromBody] CreateGroupDto dto)
        {
            if (string.IsNullOrEmpty(dto.Name) || string.IsNullOrEmpty(dto.Schedule))
            {
                return BadRequest("Nombre y horario son requeridos.");
            }

            var group = new Group
            {
                Name = dto.Name,
                Schedule = dto.Schedule,
                Capacity = dto.Capacity,
                AvailableSeats = dto.Capacity,
                Status = "Disponible"
            };

            await _groupRepository.AddAsync(group);
            await _groupRepository.SaveChangesAsync();

            return Ok(new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Schedule = group.Schedule,
                Capacity = group.Capacity,
                AvailableSeats = group.AvailableSeats,
                Status = group.Status
            });
        }
    }
}
