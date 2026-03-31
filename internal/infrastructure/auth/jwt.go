package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService interface {
	GenerateToken(userID uint) (string, error)
	ValidateToken(tokenString string) (uint, error)
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
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

func (j *jwtService) GenerateToken(userID uint) (string, error) {
	claims := &authClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(j.secretKey)
}

func (j *jwtService) ValidateToken(tokenString string) (uint, error) {
	token, err := jwt.ParseWithClaims(tokenString, &authClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return j.secretKey, nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(*authClaims); ok && token.Valid {
		return claims.UserID, nil
	}

	return 0, errors.New("invalid token")
}
