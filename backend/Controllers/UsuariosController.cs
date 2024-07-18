using System.Data.SqlClient;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly string _con;

        public UsuariosController(IConfiguration configuration)
        {
            _con = configuration.GetConnectionString("conexion");
        }

        [HttpGet]
        public IEnumerable<Usuario> Get()
        {
            List<Usuario> usuarios = new();
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ObtenerUsuarios", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Usuario u = new Usuario
                            {
                                IdUsuario = Convert.ToInt32(reader["id_usuario"]),
                                IdMiembro = Convert.ToInt32(reader["id_miembro"]),
                                Username = reader["username"].ToString(),
                                PasswordHash = reader["password_hash"].ToString(),
                                Rol = reader["rol"].ToString(),
                                FechaCreacion = Convert.ToDateTime(reader["fecha_creacion"]),
                                UltimoAcceso = Convert.ToDateTime(reader["ultimo_acceso"]),
                            };
                            usuarios.Add(u);
                        }
                    }
                }
            }
            return usuarios;
        }

        [HttpPost]
        public void Post([FromBody] Usuario u)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("InsertarUsuario", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_miembro", u.IdMiembro);
                    cmd.Parameters.AddWithValue("@username", u.Username);
                    cmd.Parameters.AddWithValue("@password_hash", u.PasswordHash);
                    cmd.Parameters.AddWithValue("@rol", u.Rol);
                    cmd.Parameters.AddWithValue("@fecha_creacion", u.FechaCreacion);
                    cmd.Parameters.AddWithValue("@ultimo_acceso", u.UltimoAcceso);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        [HttpPut("{id}")]
        public void Put([FromBody] Usuario u, int id)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ActualizarUsuario", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_usuario", id);
                    cmd.Parameters.AddWithValue("@id_miembro", u.IdMiembro);
                    cmd.Parameters.AddWithValue("@username", u.Username);
                    cmd.Parameters.AddWithValue("@password_hash", u.PasswordHash);
                    cmd.Parameters.AddWithValue("@rol", u.Rol);
                    cmd.Parameters.AddWithValue("@fecha_creacion", u.FechaCreacion);
                    cmd.Parameters.AddWithValue("@ultimo_acceso", u.UltimoAcceso);
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
                using (SqlCommand cmd = new SqlCommand("EliminarUsuario", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_usuario", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
