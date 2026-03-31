package handler

import (
	"errors"
	"net/http"

	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/usecase/user"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	registerUC *user.RegisterUseCase
	loginUC    *user.LoginUseCase
}

func NewUserHandler(registerUC *user.RegisterUseCase, loginUC *user.LoginUseCase) *UserHandler {
	return &UserHandler{
		registerUC: registerUC,
		loginUC:    loginUC,
	}
}

func (h *UserHandler) Register(c *gin.Context) {
	var input user.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	res, err := h.registerUC.Execute(c.Request.Context(), input)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, domainErrs.ErrEmailAlreadyExists) {
			statusCode = http.StatusConflict
		} else if err.Error() == "password must be at least 6 characters" { // Simplified domain check mapping
			statusCode = http.StatusBadRequest
		}

		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":         res.ID,
		"email":      res.Email,
		"created_at": res.CreatedAt,
	})
}

func (h *UserHandler) Login(c *gin.Context) {
	var input user.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	res, err := h.loginUC.Execute(c.Request.Context(), input)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, domainErrs.ErrInvalidCredentials) {
			statusCode = http.StatusUnauthorized
		}

		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}
