package user

import (
	"context"

	domainErrs "recruitment/internal/domain/errors"
	"recruitment/internal/domain/repository"
	"recruitment/internal/infrastructure/auth"

	"golang.org/x/crypto/bcrypt"
)

type LoginUseCase struct {
	userRepo   repository.UserRepository
	jwtService auth.JWTService
}

func NewLoginUseCase(repo repository.UserRepository, jwtService auth.JWTService) *LoginUseCase {
	return &LoginUseCase{
		userRepo:   repo,
		jwtService: jwtService,
	}
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginOutput struct {
	Token string `json:"token"`
}

func (uc *LoginUseCase) Execute(ctx context.Context, input LoginInput) (*LoginOutput, error) {
	user, err := uc.userRepo.FindByEmail(ctx, input.Email)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password))
	if err != nil {
		return nil, domainErrs.ErrInvalidCredentials
	}

	token, err := uc.jwtService.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &LoginOutput{Token: token}, nil
}
