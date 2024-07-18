using System.Data.SqlClient;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MiembrosController : ControllerBase
    {
        private readonly string _con;

        public MiembrosController(IConfiguration configuration)
        {
            _con = configuration.GetConnectionString("conexion");
        } 

        [HttpGet]
        public IEnumerable<Miembro> Get()
        {
            List<Miembro> miembros = new();
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ObtenerMiembros", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Miembro m = new Miembro
                            {
                                IdMiembro = Convert.ToInt32(reader["id_miembro"]),
                                Dni = reader["dni"].ToString(),
                                Nombres = reader["nombres"].ToString(),
                                Apellidos = reader["apellidos"].ToString(),
                                FechaNacimiento = Convert.ToDateTime(reader["fecha_nacimiento"]),
                                Direccion = reader["direccion"].ToString(),
                                Email = reader["email"].ToString(),
                                Telefono = reader["telefono"].ToString(),
                                Universidad = reader["universidad"].ToString(),
                                Titulo = reader["titulo"].ToString(),
                                FechaGraduacion = Convert.ToDateTime(reader["fecha_graduacion"]),
                                FotoUrl = reader["foto_url"].ToString(),
                                Estado = reader["estado"].ToString(),
                                FechaRegistro = Convert.ToDateTime(reader["fecha_registro"])
                            };
                            miembros.Add(m);
                        }
                    }
                }
            } 
            return miembros;
        }

        [HttpPost]
        public void Post([FromBody] Miembro m)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("InsertarMiembro", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@dni", m.Dni);
                    cmd.Parameters.AddWithValue("@nombres", m.Nombres);
                    cmd.Parameters.AddWithValue("@apellidos", m.Apellidos);
                    cmd.Parameters.AddWithValue("@fecha_nacimiento", m.FechaNacimiento);
                    cmd.Parameters.AddWithValue("@direccion", m.Direccion);
                    cmd.Parameters.AddWithValue("@email", m.Email);
                    cmd.Parameters.AddWithValue("@telefono", m.Telefono);
                    cmd.Parameters.AddWithValue("@universidad", m.Universidad);
                    cmd.Parameters.AddWithValue("@titulo", m.Titulo);
                    cmd.Parameters.AddWithValue("@fecha_graduacion", m.FechaGraduacion);
                    cmd.Parameters.AddWithValue("@foto_url", m.FotoUrl);
                    cmd.Parameters.AddWithValue("@estado", m.Estado);
                    cmd.Parameters.AddWithValue("@fecha_registro", m.FechaRegistro);
                    cmd.ExecuteNonQuery();
                }
            } 
        }

        [HttpPut("{id}")]
        public void Put([FromBody] Miembro m, int id)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ActualizarMiembro", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_miembro", id);
                    cmd.Parameters.AddWithValue("@dni", m.Dni);
                    cmd.Parameters.AddWithValue("@nombres", m.Nombres);
                    cmd.Parameters.AddWithValue("@apellidos", m.Apellidos);
                    cmd.Parameters.AddWithValue("@fecha_nacimiento", m.FechaNacimiento);
                    cmd.Parameters.AddWithValue("@direccion", m.Direccion);
                    cmd.Parameters.AddWithValue("@email", m.Email);
                    cmd.Parameters.AddWithValue("@telefono", m.Telefono);
                    cmd.Parameters.AddWithValue("@universidad", m.Universidad);
                    cmd.Parameters.AddWithValue("@titulo", m.Titulo);
                    cmd.Parameters.AddWithValue("@fecha_graduacion", m.FechaGraduacion);
                    cmd.Parameters.AddWithValue("@foto_url", m.FotoUrl);
                    cmd.Parameters.AddWithValue("@estado", m.Estado);
                    cmd.Parameters.AddWithValue("@fecha_registro", m.FechaRegistro);
                    cmd.ExecuteNonQuery();
                }
            } 
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("EliminarMiembro", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_miembro", id);
                    cmd.ExecuteNonQuery();
                }
            } 
        }
    }
}