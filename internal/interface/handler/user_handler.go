package handler

import (
	"errors"
	"net/http"
	"time"

	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/usecase/user"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	registerUC *user.RegisterUseCase
	loginUC    *user.LoginUseCase
}

// RegisterResponse represents the created user without sensitive data.
type RegisterResponse struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

func NewUserHandler(registerUC *user.RegisterUseCase, loginUC *user.LoginUseCase) *UserHandler {
	return &UserHandler{
		registerUC: registerUC,
		loginUC:    loginUC,
	}
}

// Register godoc
// @Summary Register a new user
// @Description Creates a new user in the system
// @Tags authentication
// @Accept json
// @Produce json
// @Param request body user.RegisterInput true "Registration Payload"
// @Success 201 {object} RegisterResponse
// @Failure 400 {object} map[string]string "Invalid input or password too short"
// @Failure 409 {object} map[string]string "Email already exists"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/auth/register [post]
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

// Login godoc
// @Summary Login an existing user
// @Description Authenticates a user and returns a JWT token
// @Tags authentication
// @Accept json
// @Produce json
// @Param request body user.LoginInput true "Login Payload"
// @Success 200 {object} user.LoginOutput
// @Failure 400 {object} map[string]string "Invalid input"
// @Failure 401 {object} map[string]string "Unauthorized / Invalid credentials"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /api/v1/auth/login [post]
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
