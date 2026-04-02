package handler

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"recruitment/internal/domain/entity"
	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/usecase/application"

	"github.com/gin-gonic/gin"
)

type ApplicationHandler struct {
	applyUC    *application.ApplyUseCase
	withdrawUC *application.WithdrawUseCase
	listAppUC  *application.ListMyApplicationsUseCase
}

// UserResponse represents the user data in applications.
type UserResponse struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

// JobResponse represents the job data in applications.
type JobResponse struct {
	ID          uint       `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Company     string     `json:"company"`
	Location    string     `json:"location"`
	CanceledAt  *time.Time `json:"canceled_at"`
	OwnerID     uint       `json:"owner_id"`
	CreatedAt   time.Time  `json:"created_at"`
}

// ApplicationResponse represents a single application.
type ApplicationResponse struct {
	ID         uint          `json:"id"`
	JobID      uint          `json:"job_id"`
	UserID     uint          `json:"user_id"`
	Job        *JobResponse  `json:"job,omitempty"`
	User       *UserResponse `json:"user,omitempty"`
	CanceledAt *time.Time    `json:"canceled_at"`
	CreatedAt  time.Time     `json:"created_at"`
}

func NewApplicationHandler(applyUC *application.ApplyUseCase, withdrawUC *application.WithdrawUseCase, listAppUC *application.ListMyApplicationsUseCase) *ApplicationHandler {
	return &ApplicationHandler{
		applyUC:    applyUC,
		withdrawUC: withdrawUC,
		listAppUC:  listAppUC,
	}
}

// Apply godoc
// @Summary Apply to a Job
// @Description Allows the authenticated user to apply to a specific job
// @Tags applications
// @Accept json
// @Produce json
// @Param id path string true "Job ID"
// @Security ApiKeyAuth
// @Success 201 {object} ApplicationResponse
// @Failure 400 {object} map[string]string "Invalid job ID"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 404 {object} map[string]string "Job not found"
// @Failure 409 {object} map[string]string "Duplicate application"
// @Failure 422 {object} map[string]string "Cannot apply to own job"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs/{id}/apply [post]
func (h *ApplicationHandler) Apply(c *gin.Context) {
	jobIDParam := c.Param("id")
	jobID, err := strconv.ParseUint(jobIDParam, 10, 32)
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
	if !ok || userRole != entity.RoleCandidate {
		c.JSON(http.StatusForbidden, gin.H{"error": domainErrs.ErrForbidden.Error()})
		return
	}

	res, err := h.applyUC.Execute(c.Request.Context(), uint(jobID), userID)
	if err != nil {
		statusCode := http.StatusInternalServerError

		if errors.Is(err, domainErrs.ErrJobNotFound) {
			statusCode = http.StatusNotFound
		} else if errors.Is(err, domainErrs.ErrDuplicateApplication) {
			statusCode = http.StatusConflict
		} else if errors.Is(err, domainErrs.ErrCannotApplyOwnJob) {
			statusCode = http.StatusUnprocessableEntity
		}

		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":         res.ID,
		"job_id":     res.JobID,
		"user_id":    res.UserID,
		"created_at": res.CreatedAt,
	})
}

// ListMine godoc
// @Summary List my applications
// @Description Retrieve a list of all jobs the authenticated user has applied for
// @Tags applications
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {array} ApplicationResponse
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/applications/mine [get]
func (h *ApplicationHandler) ListMine(c *gin.Context) {
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
	if !ok || userRole != entity.RoleCandidate {
		c.JSON(http.StatusForbidden, gin.H{"error": domainErrs.ErrForbidden.Error()})
		return
	}

	res, err := h.listAppUC.Execute(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	output := make([]ApplicationResponse, 0, len(res))
	for _, a := range res {
		appRes := ApplicationResponse{
			ID:         a.ID,
			JobID:      a.JobID,
			UserID:     a.UserID,
			CanceledAt: a.CanceledAt,
			CreatedAt:  a.CreatedAt,
		}

		if a.Job != nil {
			appRes.Job = &JobResponse{
				ID:          a.Job.ID,
				Title:       a.Job.Title,
				Description: a.Job.Description,
				Company:     a.Job.Company,
				Location:    a.Job.Location,
				CanceledAt:  a.Job.CanceledAt,
				OwnerID:     a.Job.OwnerID,
				CreatedAt:   a.Job.CreatedAt,
			}
		}

		if a.User != nil {
			appRes.User = &UserResponse{
				ID:        a.User.ID,
				Email:     a.User.Email,
				CreatedAt: a.User.CreatedAt,
			}
		}

		output = append(output, appRes)
	}

	c.JSON(http.StatusOK, output)
}

// Withdraw godoc
// @Summary Withdraw application
// @Description Allows the authenticated candidate to withdraw their application from a job
// @Tags applications
// @Produce json
// @Param id path string true "Job ID"
// @Security ApiKeyAuth
// @Success 204 "No Content"
// @Failure 400 {object} map[string]string "Invalid job ID"
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 403 {object} map[string]string "Forbidden"
// @Failure 404 {object} map[string]string "Application not found"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/jobs/{id}/apply [delete]
func (h *ApplicationHandler) Withdraw(c *gin.Context) {
	jobIDParam := c.Param("id")
	jobID, err := strconv.ParseUint(jobIDParam, 10, 32)
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
	if !ok || userRole != entity.RoleCandidate {
		c.JSON(http.StatusForbidden, gin.H{"error": domainErrs.ErrForbidden.Error()})
		return
	}

	err = h.withdrawUC.Execute(c.Request.Context(), uint(jobID), userID)
	if err != nil {
		if errors.Is(err, domainErrs.ErrApplicationNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
