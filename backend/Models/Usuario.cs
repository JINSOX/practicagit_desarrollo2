using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public int? IdMiembro { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Rol { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime UltimoAcceso { get; set; }
    }
}
