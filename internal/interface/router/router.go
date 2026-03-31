package router

import (
	"recruitment/internal/infrastructure/auth"
	"recruitment/internal/interface/handler"
	"recruitment/internal/interface/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(
	userHandler *handler.UserHandler,
	jobHandler *handler.JobHandler,
	appHandler *handler.ApplicationHandler,
	jwtService auth.JWTService,
) *gin.Engine {
	r := gin.Default()

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
