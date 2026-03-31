package user

import (
	"context"
	"errors"

	"recruitment/internal/domain/entity"
	"recruitment/internal/domain/repository"

	"golang.org/x/crypto/bcrypt"
)

type RegisterUseCase struct {
	userRepo repository.UserRepository
}

func NewRegisterUseCase(repo repository.UserRepository) *RegisterUseCase {
	return &RegisterUseCase{userRepo: repo}
}

type RegisterInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func (uc *RegisterUseCase) Execute(ctx context.Context, input RegisterInput) (*entity.User, error) {
	if len(input.Password) < 6 {
		return nil, errors.New("password must be at least 6 characters")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), 12)
	if err != nil {
		return nil, err
	}

	user := &entity.User{
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
	}

	err = uc.userRepo.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}
