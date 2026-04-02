package handler

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
	"recruitment/internal/usecase/job"

	"github.com/gin-gonic/gin"
)

type JobHandler struct {
	createJobUC     *job.CreateJobUseCase
	updateJobUC     *job.UpdateJobUseCase
	cancelJobUC     *job.CancelJobUseCase
	getJobUC        *job.GetJobUseCase
	searchJobUC     *job.SearchJobsUseCase
	listJobsUC      *job.ListJobsUseCase
	listApplicants  *job.ListApplicantsUseCase
	jobRepo         repository.JobRepository
}

func NewJobHandler(
	createJobUC *job.CreateJobUseCase,
	updateJobUC *job.UpdateJobUseCase,
	cancelJobUC *job.CancelJobUseCase,
	getJobUC *job.GetJobUseCase,
	searchJobUC *job.SearchJobsUseCase,
	listJobsUC *job.ListJobsUseCase,
	listApplicants *job.ListApplicantsUseCase,
	jobRepo repository.JobRepository,
) *JobHandler {
	return &JobHandler{
		createJobUC:    createJobUC,
		updateJobUC:    updateJobUC,
		cancelJobUC:    cancelJobUC,
		getJobUC:       getJobUC,
		searchJobUC:    searchJobUC,
		listJobsUC:     listJobsUC,
		listApplicants: listApplicants,
		jobRepo:        jobRepo,
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

	userRoleRaw, exists := c.Get("userRole")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userRole, ok := userRoleRaw.(entity.UserRole)
	if !ok || userRole != entity.RoleRecruiter {
		c.JSON(http.StatusForbidden, gin.H{"error": domainErrs.ErrForbidden.Error()})
		return
	}

	input.OwnerID = userID

	res, err := h.createJobUC.Execute(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":           res.ID,
		"title":        res.Title,
		"description":  res.Description,
		"company":      res.Company,
		"location":     res.Location,
		"work_mode":    res.WorkMode,
		"labels":       res.Labels,
		"owner_id":     res.OwnerID,
		"canceled_at":  res.CanceledAt,
		"created_at":   res.CreatedAt,
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
	filter := repository.JobFilter{
		Search: c.Query("search"),
	}

	if wm := c.Query("work_mode"); wm != "" {
		filter.WorkModes = strings.Split(wm, ",")
	}

	if lb := c.Query("labels"); lb != "" {
		filter.Labels = strings.Split(lb, ",")
	}

	res, err := h.searchJobUC.Execute(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Parse custom output instead of raw entity
	output := make([]gin.H, 0)
	for _, j := range res {
		output = append(output, gin.H{
			"id":           j.ID,
			"title":        j.Title,
			"description":  j.Description,
			"company":      j.Company,
			"location":     j.Location,
			"work_mode":    j.WorkMode,
			"labels":       j.Labels,
			"owner_id":     j.OwnerID,
			"canceled_at":  j.CanceledAt,
			"created_at":   j.CreatedAt,
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

	userRoleRaw, exists := c.Get("userRole")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userRole, ok := userRoleRaw.(entity.UserRole)
	if !ok || userRole != entity.RoleRecruiter {
		c.JSON(http.StatusForbidden, gin.H{"error": domainErrs.ErrForbidden.Error()})
		return
	}

	res, err := h.listJobsUC.Execute(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	output := make([]gin.H, 0)
	for _, j := range res {
		output = append(output, gin.H{
			"id":           j.ID,
			"title":        j.Title,
			"description":  j.Description,
			"company":      j.Company,
			"location":     j.Location,
			"work_mode":    j.WorkMode,
			"labels":       j.Labels,
			"owner_id":     j.OwnerID,
			"canceled_at":  j.CanceledAt,
			"created_at":   j.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, output)
}

// GetByID godoc
// @Summary Get job by ID
// @Description Retrieve a single job by its ID, including the number of applications
// @Tags jobs
// @Produce json
// @Param id path int true "Job ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string "Invalid job ID"
// @Failure 404 {object} map[string]string "Job not found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs/{id} [get]
func (h *JobHandler) GetByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	result, err := h.getJobUC.Execute(c.Request.Context(), uint(id))
	if err != nil {
		if errors.Is(err, domainErrs.ErrJobNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	j := result.Job
	c.JSON(http.StatusOK, gin.H{
		"id":                j.ID,
		"title":             j.Title,
		"description":       j.Description,
		"company":           j.Company,
		"location":          j.Location,
		"work_mode":         j.WorkMode,
		"labels":            j.Labels,
		"owner_id":          j.OwnerID,
		"canceled_at":       j.CanceledAt,
		"created_at":        j.CreatedAt,
		"application_count": result.ApplicationCount,
	})
}

// Update godoc
// @Summary Update a job
// @Description Update a job posting. Only the owner can update the job.
// @Tags jobs
// @Accept json
// @Produce json
// @Param id path int true "Job ID"
// @Param request body job.UpdateJobInput true "Job Update Payload"
// @Security ApiKeyAuth
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string "Invalid input"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 403 {object} map[string]string "Forbidden"
// @Failure 404 {object} map[string]string "Job not found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs/{id} [put]
func (h *JobHandler) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	var input job.UpdateJobInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

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

	userRoleRaw, exists := c.Get("userRole")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userRole, ok := userRoleRaw.(entity.UserRole)
	if !ok || userRole != entity.RoleRecruiter {
		c.JSON(http.StatusForbidden, gin.H{"error": domainErrs.ErrForbidden.Error()})
		return
	}

	input.ID = uint(id)
	input.OwnerID = userID

	res, err := h.updateJobUC.Execute(c.Request.Context(), input)
	if err != nil {
		if errors.Is(err, domainErrs.ErrJobNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if errors.Is(err, domainErrs.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": "you can only edit your own jobs"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":           res.ID,
		"title":        res.Title,
		"description":  res.Description,
		"company":      res.Company,
		"location":     res.Location,
		"work_mode":    res.WorkMode,
		"labels":       res.Labels,
		"owner_id":     res.OwnerID,
		"canceled_at":  res.CanceledAt,
		"created_at":   res.CreatedAt,
	})
}

// ListLabels godoc
// @Summary List all distinct labels
// @Description Retrieve a list of all unique labels used across jobs
// @Tags jobs
// @Produce json
// @Success 200 {array} string
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs/labels [get]
func (h *JobHandler) ListLabels(c *gin.Context) {
	labels, err := h.jobRepo.ListDistinctLabels(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if labels == nil {
		labels = []string{}
	}
	c.JSON(http.StatusOK, labels)
}

// Cancel godoc
// @Summary Cancel a job
// @Description Cancel a job posting and all its active applications. Only the owner can cancel.
// @Tags jobs
// @Produce json
// @Param id path int true "Job ID"
// @Security ApiKeyAuth
// @Success 204 "No Content"
// @Failure 400 {object} map[string]string "Invalid job ID"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 403 {object} map[string]string "Forbidden"
// @Failure 404 {object} map[string]string "Job not found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs/{id}/cancel [post]
func (h *JobHandler) Cancel(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

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

	userRoleRaw, exists := c.Get("userRole")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userRole, ok := userRoleRaw.(entity.UserRole)
	if !ok || userRole != entity.RoleRecruiter {
		c.JSON(http.StatusForbidden, gin.H{"error": domainErrs.ErrForbidden.Error()})
		return
	}

	err = h.cancelJobUC.Execute(c.Request.Context(), uint(id), userID)
	if err != nil {
		if errors.Is(err, domainErrs.ErrJobNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if errors.Is(err, domainErrs.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": "you can only cancel your own jobs"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// ListApplicants godoc
// @Summary List applicants for a job
// @Description Retrieve the list of candidates who applied to a job. Only the job owner can access.
// @Tags jobs
// @Produce json
// @Param id path int true "Job ID"
// @Security ApiKeyAuth
// @Success 200 {array} map[string]interface{}
// @Failure 400 {object} map[string]string "Invalid job ID"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 403 {object} map[string]string "Forbidden"
// @Failure 404 {object} map[string]string "Job not found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs/{id}/applicants [get]
func (h *JobHandler) ListApplicants(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDRaw.(uint)

	userRoleRaw, exists := c.Get("userRole")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userRole, ok := userRoleRaw.(entity.UserRole)
	if !ok || userRole != entity.RoleRecruiter {
		c.JSON(http.StatusForbidden, gin.H{"error": domainErrs.ErrForbidden.Error()})
		return
	}

	apps, err := h.listApplicants.Execute(c.Request.Context(), uint(id), userID)
	if err != nil {
		if errors.Is(err, domainErrs.ErrJobNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if errors.Is(err, domainErrs.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": "you can only view applicants for your own jobs"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	output := make([]gin.H, 0, len(apps))
	for _, a := range apps {
		item := gin.H{
			"id":         a.ID,
			"created_at": a.CreatedAt,
		}
		if a.User != nil {
			item["user"] = gin.H{
				"id":    a.User.ID,
				"name":  a.User.Name,
				"email": a.User.Email,
			}
		}
		output = append(output, item)
	}

	c.JSON(http.StatusOK, output)
}
