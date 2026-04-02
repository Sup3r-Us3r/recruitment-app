package auth

import (
	"errors"
	"time"

	"recruitment/internal/domain/entity"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService interface {
	GenerateToken(userID uint, name string, email string, role entity.UserRole) (string, error)
	ValidateToken(tokenString string) (*AuthClaims, error)
}

type jwtService struct {
	secretKey []byte
}

func NewJWTService(secret string) JWTService {
	return &jwtService{
		secretKey: []byte(secret),
	}
}

type authClaims struct {
	UserID uint   `json:"user_id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

type AuthClaims struct {
	UserID uint
	Name   string
	Email  string
	Role   entity.UserRole
}

func (j *jwtService) GenerateToken(userID uint, name string, email string, role entity.UserRole) (string, error) {
	claims := &authClaims{
		UserID: userID,
		Name:   name,
		Email:  email,
		Role:   string(role),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(j.secretKey)
}

func (j *jwtService) ValidateToken(tokenString string) (*AuthClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &authClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return j.secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*authClaims); ok && token.Valid {
		return &AuthClaims{
			UserID: claims.UserID,
			Name:   claims.Name,
			Email:  claims.Email,
			Role:   entity.UserRole(claims.Role),
		}, nil
	}

	return nil, errors.New("invalid token")
}
