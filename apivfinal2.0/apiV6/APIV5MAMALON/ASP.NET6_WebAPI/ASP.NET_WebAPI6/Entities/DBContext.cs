using Microsoft.EntityFrameworkCore;

namespace ASP.NET_WebAPI6.Entities
{
    public partial class DBContext : DbContext
    {
        public DBContext()
        {
        }

        public DBContext(DbContextOptions<DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Estudiante> Estudiante{ get; set; }
        public virtual DbSet<Profesor> Profesor { get; set; }
        public virtual DbSet<Examen> Examen { get; set; }
        public virtual DbSet<Pregunta> Pregunta { get; set; }
        public virtual DbSet<Respuesta> Respuesta{ get; set; }
        public virtual DbSet<Grupo> Grupo { get; set; }
        public virtual DbSet<estudiantegrupo> estudiantegrupo { get; set; }
        public virtual DbSet<estudianteexamen> estudianteexamen { get; set; }
        public virtual DbSet<preguntaexamenestudiante> preguntaexamenestudiante { get; set; }



        public DbSet<UserData> UserData { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySQL("server=localhost;port=3306;user=root;password=;database=tc2005b-final");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Estudiante>(entity =>
            {
                entity.ToTable("Estudiante");

                entity.Property(e => e.idEstudiante).HasColumnType("int");

                entity.Property(e => e.nombre)
                    .IsRequired()
                    .HasMaxLength(45);

                entity.Property(e => e.contraseña)
                    .IsRequired()
                    .HasMaxLength(45);

                entity.Property(e => e.email)
                    .IsRequired()
                    .HasMaxLength(45);

                entity.Property(e => e.username)
                    .IsRequired()
                    .HasMaxLength(45);

                // Agregar la siguiente línea para establecer la clave primaria
                entity.HasKey(e => e.idEstudiante);
            });


            // Agrega la configuración del modelo para Profesor aquí 
            modelBuilder.Entity<Profesor>(entity =>
            {
                entity.ToTable("Profesor");

                entity.Property(e => e.idProfesor).HasColumnType("int");

                entity.Property(e => e.nombre)
                    .IsRequired()
                    .HasMaxLength(45);

                entity.Property(e => e.contraseña)
                    .IsRequired()
                    .HasMaxLength(45);

                entity.Property(e => e.email)
                    .IsRequired()
                    .HasMaxLength(45);

                entity.Property(e => e.username)
                    .IsRequired()
                    .HasMaxLength(45);

                // Establecer la clave primaria
                entity.HasKey(e => e.idProfesor);
            });

            modelBuilder.Entity<Examen>(entity => {
                entity.ToTable("Examen");

                entity.Property(e => e.idExamen).HasColumnType("int");
                entity.Property(e => e.Grupo_idGrupo).HasColumnType("int");
                entity.Property(e => e.Dificultad_idDificultad).HasColumnType("int");
                entity.Property(e => e.nombreExamen).HasMaxLength(255);
                entity.HasKey(e => e.idExamen);
            });

            modelBuilder.Entity<Pregunta>(entity => {
                entity.ToTable("Pregunta");

                entity.Property(e => e.idPregunta).HasColumnType("int");
                entity.Property(e => e.Examen_idExamen).HasColumnType("int");
                entity.Property(e => e.enunciado).HasMaxLength(500);

                entity.HasKey(e => e.idPregunta);

 
            });

            modelBuilder.Entity<Respuesta>(entity => {
                entity.ToTable("Respuesta");

                entity.Property(e => e.idRespuesta).HasColumnType("int");
                entity.Property(e => e.Pregunta_idPregunta).HasColumnType("int");
                entity.Property(e => e.texto).HasMaxLength(500);
                entity.Property(e => e.es_correcta).HasColumnType("bool");

                entity.HasKey(e => e.idRespuesta);

            });

            modelBuilder.Entity<Grupo>(entity => {
                entity.ToTable("Grupo");

                entity.Property(e => e.idGrupo).HasColumnType("int");
                entity.Property(e => e.Profesor_idProfesor).HasColumnType("int");
                entity.Property(e => e.nombre).HasMaxLength(500);
                entity.Property(e => e.token).HasMaxLength(500);
                entity.Property(e => e.descripcion).HasMaxLength(500);

                entity.HasKey(e => e.idGrupo);

            });

            modelBuilder.Entity<estudiantegrupo>(entity => {
                entity.ToTable("estudiantegrupo");

                entity.Property(e => e.Estudiante_idEstudiante).HasColumnType("int");
                entity.Property(e => e.Grupo_idGrupo).HasColumnType("int");

                entity.HasKey(e => new { e.Grupo_idGrupo });

            });

            modelBuilder.Entity<estudianteexamen>(entity => {
                entity.ToTable("estudianteexamen");

                entity.Property(e => e.Estudiante_idEstudiante).HasColumnType("int");
                entity.Property(e => e.Examen_idExamen).HasColumnType("int");
                entity.Property(e => e.intentos).HasColumnType("int");
                entity.Property(e => e.calificación).HasColumnType("double");

                entity.HasKey(e => new { e.Estudiante_idEstudiante });

            });

            modelBuilder.Entity<preguntaexamenestudiante>(entity => {
                entity.ToTable("preguntaexamenestudiante");

                entity.Property(e => e.idPreguntaExamenEstudiante).HasColumnType("int");
                entity.Property(e => e.Estudiante_idEstudiante).HasColumnType("int");
                entity.Property(e => e.Examen_idExamen).HasColumnType("int");
                entity.Property(e => e.Pregunta_idPregunta).HasColumnType("int");
                entity.Property(e => e.Pregunta_idPregunta).HasColumnType("int");
                entity.Property(e => e.respuesta_idRespuesta).HasColumnType("int");


                entity.HasKey(e => new { e.idPreguntaExamenEstudiante });

            });



            OnModelCreatingPartial(modelBuilder);
        }


        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
