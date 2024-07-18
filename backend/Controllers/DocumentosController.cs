using System.Data.SqlClient;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentosController : ControllerBase
    {
        private readonly string _con;

        public DocumentosController(IConfiguration configuration)
        {
            _con = configuration.GetConnectionString("conexion");
        }

        [HttpGet]
        public IEnumerable<Documento> Get()
        {
            List<Documento> documentos = new();
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ObtenerDocumentos", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Documento d = new Documento
                            {
                                IdDocumento = Convert.ToInt32(reader["id_documento"]),
                                IdMiembro = Convert.ToInt32(reader["id_miembro"]),
                                TipoDocumento = reader["tipo_documento"].ToString(),
                                DocumentoUrl = reader["documento_url"].ToString(),
                                FechaCarga = Convert.ToDateTime(reader["fecha_carga"]),
                                Estado = reader["estado"].ToString()
                            };
                            documentos.Add(d);
                        }
                    }
                }
            }
            return documentos;
        }

        [HttpPost]
        public void Post([FromBody] Documento d)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("InsertarDocumento", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_miembro", d.IdMiembro);
                    cmd.Parameters.AddWithValue("@tipo_documento", d.TipoDocumento);
                    cmd.Parameters.AddWithValue("@documento_url", d.DocumentoUrl);
                    cmd.Parameters.AddWithValue("@fecha_carga", d.FechaCarga);
                    cmd.Parameters.AddWithValue("@estado", d.Estado);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        [HttpPut("{id}")]
        public void Put([FromBody] Documento d, int id)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ActualizarDocumento", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_documento", id);
                    cmd.Parameters.AddWithValue("@id_miembro", d.IdMiembro);
                    cmd.Parameters.AddWithValue("@tipo_documento", d.TipoDocumento);
                    cmd.Parameters.AddWithValue("@documento_url", d.DocumentoUrl);
                    cmd.Parameters.AddWithValue("@fecha_carga", d.FechaCarga);
                    cmd.Parameters.AddWithValue("@estado", d.Estado);
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
                using (SqlCommand cmd = new SqlCommand("EliminarDocumento", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_documento", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
