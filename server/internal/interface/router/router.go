package router

import (
	"recruitment/internal/infrastructure/auth"
	"recruitment/internal/interface/handler"
	"recruitment/internal/interface/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/watchakorn-18k/scalar-go"
)

func SetupRouter(
	userHandler *handler.UserHandler,
	jobHandler *handler.JobHandler,
	appHandler *handler.ApplicationHandler,
	jwtService auth.JWTService,
) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Expose swagger.json for Scalar to fetch
	r.StaticFile("/docs/swagger.json", "./docs/swagger.json")

	// Scalar API Reference
	r.GET("/docs", func(c *gin.Context) {
		htmlContent, err := scalar.ApiReferenceHTML(&scalar.Options{
			SpecURL: "./docs/swagger.json",
			CustomOptions: scalar.CustomOptions{
				PageTitle: "Recruitment API",
			},
			DarkMode: true,
		})

		if err != nil {
			c.String(500, "Failed to generate documentation")
			return
		}

		c.Data(200, "text/html; charset=utf-8", []byte(htmlContent))
	})

	v1 := r.Group("/api/v1")

	// Públicas
	authGroup := v1.Group("/auth")
	{
		authGroup.POST("/register", userHandler.Register)
		authGroup.POST("/login", userHandler.Login)
	}

	// Mistas (GET público, POST protegido)
	jobsGroup := v1.Group("/jobs")
	{
		// Públicas
		jobsGroup.GET("", jobHandler.List)

		// Protegidas
		protectedJobs := jobsGroup.Group("")
		protectedJobs.Use(middleware.AuthMiddleware(jwtService))
		{
			protectedJobs.POST("", jobHandler.Create)
			protectedJobs.GET("/mine", jobHandler.ListMine)
			protectedJobs.POST("/:id/apply", appHandler.Apply)
		}
	}

	// Protegidas completas
	appGroup := v1.Group("/applications")
	appGroup.Use(middleware.AuthMiddleware(jwtService))
	{
		appGroup.GET("/mine", appHandler.ListMine)
	}

	return r
}
