using Microsoft.OpenApi.Models;

namespace GeneralData.API.Swagger
{
    public static class SwaggerConfigurator
    {
        private const string _swaggerVersion = "v1";
        private const string _authorizationType = "bearer";
        private const string _apiTitle = "Api Key Auth";
        private const string _apiAuthDescription = "Bearer token authentication";

        public static void AddSwaggerOptions(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(_swaggerVersion, new OpenApiInfo { Title = _apiTitle, Version = _swaggerVersion });

                c.AddSecurityDefinition(_authorizationType, new OpenApiSecurityScheme
                {
                    Description = _apiAuthDescription,
                    Type = SecuritySchemeType.Http,
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Scheme = _authorizationType
                });
                c.AddSecurityRequirement(ConfigureAuthorization());
            });
        }

        private static OpenApiSecurityRequirement ConfigureAuthorization()
        {
            var key = new OpenApiSecurityScheme()
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = _authorizationType
                },
                In = ParameterLocation.Header
            };

            return new OpenApiSecurityRequirement
            {
                { key, new List<string>() }
            };
        }
    }
}