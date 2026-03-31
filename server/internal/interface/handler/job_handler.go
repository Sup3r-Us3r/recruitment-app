package handler

import (
	"net/http"

	"recruitment/internal/usecase/job"

	"github.com/gin-gonic/gin"
)

type JobHandler struct {
	createJobUC *job.CreateJobUseCase
	searchJobUC *job.SearchJobsUseCase
	listJobsUC  *job.ListJobsUseCase
}

func NewJobHandler(createJobUC *job.CreateJobUseCase, searchJobUC *job.SearchJobsUseCase, listJobsUC *job.ListJobsUseCase) *JobHandler {
	return &JobHandler{
		createJobUC: createJobUC,
		searchJobUC: searchJobUC,
		listJobsUC:  listJobsUC,
	}
}

// Create godoc
// @Summary Create a new job
// @Description Creates a new job posting associated with the authenticated user
// @Tags jobs
// @Accept json
// @Produce json
// @Param request body job.CreateJobInput true "Job Creation Payload"
// @Security ApiKeyAuth
// @Success 201 {object} JobResponse
// @Failure 400 {object} map[string]string "Invalid input"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs [post]
func (h *JobHandler) Create(c *gin.Context) {
	var input job.CreateJobInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Extrai userID do contexto setado pelo middleware
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userID, ok := userIDRaw.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user context"})
		return
	}

	input.OwnerID = userID

	res, err := h.createJobUC.Execute(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":          res.ID,
		"title":       res.Title,
		"description": res.Description,
		"location":    res.Location,
		"owner_id":    res.OwnerID,
		"created_at":  res.CreatedAt,
	})
}

// List godoc
// @Summary List all jobs
// @Description Retrieve a list of all jobs, optionally filtered by a search query
// @Tags jobs
// @Produce json
// @Param search query string false "Search query to filter jobs by title or description"
// @Success 200 {array} JobResponse
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs [get]
func (h *JobHandler) List(c *gin.Context) {
	searchQuery := c.Query("search")
	res, err := h.searchJobUC.Execute(c.Request.Context(), searchQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Parse custom output instead of raw entity
	output := make([]gin.H, 0)
	for _, j := range res {
		output = append(output, gin.H{
			"id":          j.ID,
			"title":       j.Title,
			"description": j.Description,
			"location":    j.Location,
			"owner_id":    j.OwnerID,
			"created_at":  j.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, output)
}

// ListMine godoc
// @Summary List my jobs
// @Description Retrieve a list of all jobs created by the authenticated user
// @Tags jobs
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {array} JobResponse
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs/mine [get]
func (h *JobHandler) ListMine(c *gin.Context) {
	// Extrai userID do contexto
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userID := userIDRaw.(uint)

	res, err := h.listJobsUC.Execute(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	output := make([]gin.H, 0)
	for _, j := range res {
		output = append(output, gin.H{
			"id":          j.ID,
			"title":       j.Title,
			"description": j.Description,
			"location":    j.Location,
			"owner_id":    j.OwnerID,
			"created_at":  j.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, output)
}
