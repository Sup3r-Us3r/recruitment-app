package handler

import (
	"errors"
	"net/http"
	"strconv"

	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/usecase/application"

	"github.com/gin-gonic/gin"
)

type ApplicationHandler struct {
	applyUC   *application.ApplyUseCase
	listAppUC *application.ListMyApplicationsUseCase
}

func NewApplicationHandler(applyUC *application.ApplyUseCase, listAppUC *application.ListMyApplicationsUseCase) *ApplicationHandler {
	return &ApplicationHandler{
		applyUC:   applyUC,
		listAppUC: listAppUC,
	}
}

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

func (h *ApplicationHandler) ListMine(c *gin.Context) {
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userID := userIDRaw.(uint)

	res, err := h.listAppUC.Execute(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	output := make([]gin.H, 0)
	for _, a := range res {
		output = append(output, gin.H{
			"id":         a.ID,
			"job_id":     a.JobID,
			"user_id":    a.UserID,
			"created_at": a.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, output)
}
