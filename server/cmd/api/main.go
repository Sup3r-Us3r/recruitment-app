package main

import (
	"log"
	"os"

	_ "recruitment/docs" // Swagger docs
	"recruitment/internal/infrastructure/auth"
	"recruitment/internal/infrastructure/database"
	"recruitment/internal/infrastructure/repository"
	"recruitment/internal/interface/handler"
	"recruitment/internal/interface/router"
	"recruitment/internal/usecase/application"
	"recruitment/internal/usecase/job"
	"recruitment/internal/usecase/user"

	"github.com/joho/godotenv"
)

// @title Recruitment API
// @version 1.0
// @description REST API for Recruitment and Selection system
// @host localhost:8080
// @BasePath /
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Database Connection
	dbCfg := database.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		DBName:   os.Getenv("DB_NAME"),
	}

	db, err := database.ConnectDB(dbCfg)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}

	// Infrastructure
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "very_secret_key" // default fallback
	}
	jwtService := auth.NewJWTService(jwtSecret)

	// Repositories
	userRepo := repository.NewUserRepository(db)
	jobRepo := repository.NewJobRepository(db)
	appRepo := repository.NewApplicationRepository(db)

	// UseCases
	registerUC := user.NewRegisterUseCase(userRepo)
	loginUC := user.NewLoginUseCase(userRepo, jwtService)

	createJobUC := job.NewCreateJobUseCase(jobRepo)
	updateJobUC := job.NewUpdateJobUseCase(jobRepo)
	cancelJobUC := job.NewCancelJobUseCase(jobRepo, appRepo)
	getJobUC := job.NewGetJobUseCase(jobRepo, appRepo)
	listApplicantsUC := job.NewListApplicantsUseCase(jobRepo, appRepo)
	searchJobsUC := job.NewSearchJobsUseCase(jobRepo)
	listJobsUC := job.NewListJobsUseCase(jobRepo)

	applyUC := application.NewApplyUseCase(appRepo, jobRepo)
	withdrawUC := application.NewWithdrawUseCase(appRepo)
	listAppsUC := application.NewListMyApplicationsUseCase(appRepo)

	// Handlers
	userHandler := handler.NewUserHandler(registerUC, loginUC)
	jobHandler := handler.NewJobHandler(createJobUC, updateJobUC, cancelJobUC, getJobUC, searchJobsUC, listJobsUC, listApplicantsUC, jobRepo)
	appHandler := handler.NewApplicationHandler(applyUC, withdrawUC, listAppsUC)

	// Router
	r := router.SetupRouter(userHandler, jobHandler, appHandler, jwtService)

	// Server Start
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
