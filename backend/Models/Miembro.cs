using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Miembro
    {
        public int IdMiembro { get; set; }
        public string Dni { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Direccion { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Universidad { get; set; }
        public string Titulo { get; set; }
        public DateTime FechaGraduacion { get; set; }
        public string FotoUrl { get; set; }
        public string Estado { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
}